import dotenv from "dotenv";
import mysql from "mysql2/promise";
import crypto from "node:crypto";
import type {
  BuyerAccount,
  BuyerContact,
  Campaign,
  DraftWithContext,
  LeadWithContact,
  OutreachDraft,
  SampleRequest,
  Suppression,
  Task
} from "./types.js";

dotenv.config();

type UpsertAccountInput = Omit<BuyerAccount, "id" | "created_at" | "updated_at">;
type UpsertContactInput = Omit<BuyerContact, "id" | "created_at" | "updated_at" | "unsubscribed" | "bounced">;
type DraftInput = Omit<OutreachDraft, "id" | "created_at" | "updated_at" | "reviewed_by" | "review_notes" | "sent_at">;

export type Store = {
  mode: "memory" | "mysql";
  health(): Promise<Record<string, unknown>>;
  close(): Promise<void>;
  upsertAccount(input: UpsertAccountInput): Promise<BuyerAccount>;
  upsertContact(input: UpsertContactInput): Promise<BuyerContact>;
  addSampleRequest(input: Omit<SampleRequest, "id" | "created_at">): Promise<SampleRequest>;
  addTask(input: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task>;
  addSuppression(input: Omit<Suppression, "created_at">): Promise<void>;
  suppressedEmails(): Promise<Set<string>>;
  createDraft(input: DraftInput): Promise<OutreachDraft>;
  hasIntroDraft(contactId: string): Promise<boolean>;
  draftCandidates(limit: number): Promise<Array<BuyerAccount & { contact: BuyerContact }>>;
  pendingDrafts(limit?: number): Promise<DraftWithContext[]>;
  updateDraftStatus(id: string, status: OutreachDraft["status"], review?: { reviewed_by?: string; review_notes?: string }): Promise<OutreachDraft | null>;
  markDraftSent(id: string): Promise<void>;
  leads(limit?: number): Promise<LeadWithContact[]>;
  summary(): Promise<Record<string, number>>;
  campaigns(): Promise<Campaign[]>;
  createCampaign(input: Pick<Campaign, "name" | "segment_filter" | "notes">): Promise<Campaign>;
};

function id() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

class MemoryStore implements Store {
  mode: Store["mode"] = "memory";
  accounts: BuyerAccount[] = [];
  contacts: BuyerContact[] = [];
  drafts: OutreachDraft[] = [];
  samples: SampleRequest[] = [];
  tasks: Task[] = [];
  suppressions: Suppression[] = [];
  campaignRows: Campaign[] = [];

  async health(): Promise<Record<string, unknown>> {
    return { db_driver: "memory", records: this.accounts.length };
  }

  async close() {}

  async upsertAccount(input: UpsertAccountInput) {
    const existing = this.accounts.find((row) => row.normalized_company_name === input.normalized_company_name && (row.domain ?? "") === (input.domain ?? ""));
    if (existing) {
      Object.assign(existing, {
        ...input,
        lead_score: Math.max(existing.lead_score, input.lead_score),
        updated_at: now()
      });
      return existing;
    }
    const row: BuyerAccount = { id: id(), ...input, created_at: now(), updated_at: now() };
    this.accounts.push(row);
    return row;
  }

  async upsertContact(input: UpsertContactInput) {
    const existing = this.contacts.find((row) => row.account_id === input.account_id && (row.public_email ?? "") === (input.public_email ?? "") && (row.role_title ?? "") === (input.role_title ?? ""));
    if (existing) {
      Object.assign(existing, { ...input, updated_at: now() });
      return existing;
    }
    const row: BuyerContact = { id: id(), ...input, unsubscribed: false, bounced: false, created_at: now(), updated_at: now() };
    this.contacts.push(row);
    return row;
  }

  async addSampleRequest(input: Omit<SampleRequest, "id" | "created_at">) {
    const row: SampleRequest = { id: id(), ...input, created_at: now() };
    this.samples.push(row);
    return row;
  }

  async addTask(input: Omit<Task, "id" | "created_at" | "updated_at">) {
    const row: Task = { id: id(), ...input, created_at: now(), updated_at: now() };
    this.tasks.push(row);
    return row;
  }

  async addSuppression(input: Omit<Suppression, "created_at">) {
    if (!this.suppressions.some((row) => row.email === input.email.toLowerCase())) {
      this.suppressions.push({ ...input, email: input.email.toLowerCase(), created_at: now() });
    }
    for (const contact of this.contacts.filter((row) => row.public_email?.toLowerCase() === input.email.toLowerCase())) {
      contact.contact_status = "do_not_contact";
      if (input.reason === "unsubscribe") contact.unsubscribed = true;
      if (input.reason === "bounce") contact.bounced = true;
    }
  }

  async suppressedEmails() {
    return new Set(this.suppressions.map((row) => row.email.toLowerCase()));
  }

  async createDraft(input: DraftInput) {
    const row: OutreachDraft = { id: id(), ...input, reviewed_by: null, review_notes: null, sent_at: null, created_at: now(), updated_at: now() };
    this.drafts.push(row);
    return row;
  }

  async hasIntroDraft(contactId: string) {
    return this.drafts.some((row) => row.contact_id === contactId && row.template_key.includes("intro") && ["pending_approval", "approved", "sent"].includes(row.status));
  }

  async draftCandidates(limit: number) {
    return this.contacts
      .filter((contact) => contact.contact_status === "ready_for_draft" && contact.email_status === "valid" && Boolean(contact.public_email))
      .map((contact) => {
        const account = this.accounts.find((row) => row.id === contact.account_id);
        return account ? { ...account, contact } : null;
      })
      .filter((row): row is BuyerAccount & { contact: BuyerContact } => Boolean(row))
      .sort((a, b) => b.lead_score - a.lead_score)
      .slice(0, limit);
  }

  async pendingDrafts(limit = 200) {
    return this.drafts
      .filter((row) => row.status === "pending_approval")
      .map((draft) => {
        const account = this.accounts.find((row) => row.id === draft.account_id);
        const contact = this.contacts.find((row) => row.id === draft.contact_id);
        return {
          ...draft,
          company_name: account?.company_name ?? "",
          public_email: contact?.public_email ?? null,
          priority: account?.priority ?? "HOLD",
          lead_score: account?.lead_score ?? 0,
          buyer_segment: account?.buyer_segment ?? "unknown"
        };
      })
      .slice(0, limit);
  }

  async updateDraftStatus(idValue: string, status: OutreachDraft["status"], review?: { reviewed_by?: string; review_notes?: string }) {
    const draft = this.drafts.find((row) => row.id === idValue);
    if (!draft) return null;
    draft.status = status;
    draft.reviewed_by = review?.reviewed_by ?? draft.reviewed_by;
    draft.review_notes = review?.review_notes ?? draft.review_notes;
    draft.updated_at = now();
    return draft;
  }

  async markDraftSent(idValue: string) {
    const draft = this.drafts.find((row) => row.id === idValue);
    if (draft) {
      draft.status = "sent";
      draft.sent_at = now();
      draft.updated_at = now();
    }
  }

  async leads(limit = 250): Promise<LeadWithContact[]> {
    return this.accounts.slice(0, limit).map((account) => {
      const contact = this.contacts.find((row) => row.account_id === account.id);
      return {
        ...account,
        contact_id: contact?.id ?? null,
        contact_name: contact?.contact_name ?? null,
        public_email: contact?.public_email ?? null,
        contact_status: contact?.contact_status ?? null,
        email_status: contact?.email_status ?? null
      };
    });
  }

  async summary(): Promise<Record<string, number>> {
    return {
      accounts: this.accounts.length,
      contacts: this.contacts.length,
      ready_for_draft: this.contacts.filter((row) => row.contact_status === "ready_for_draft").length,
      needs_manual_review: this.contacts.filter((row) => row.contact_status === "needs_manual_review").length,
      pending_drafts: this.drafts.filter((row) => row.status === "pending_approval").length,
      sent: this.drafts.filter((row) => row.status === "sent").length
    };
  }

  async campaigns() {
    return this.campaignRows;
  }

  async createCampaign(input: Pick<Campaign, "name" | "segment_filter" | "notes">): Promise<Campaign> {
    const row: Campaign = { id: id(), status: "draft", ...input, created_at: now(), updated_at: now() };
    this.campaignRows.push(row);
    return row;
  }
}

class MySqlStore extends MemoryStore {
  mode: Store["mode"] = "mysql";
  private pool: mysql.Pool;

  constructor() {
    super();
    const mysqlHost = process.env.MYSQL_HOST === "localhost" ? "127.0.0.1" : process.env.MYSQL_HOST;
    this.pool = mysql.createPool({
      host: mysqlHost,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
      namedPlaceholders: false
    });
  }

  async health(): Promise<Record<string, unknown>> {
    const [rows] = await this.pool.query("select now() as database_time");
    return { db_driver: "mysql", database_time: rows };
  }

  async close() {
    await this.pool.end();
  }

  async upsertAccount(input: UpsertAccountInput) {
    const accountId = id();
    await this.pool.execute(
      `insert into buyer_accounts
       (id, company_name, normalized_company_name, domain, website, headquarters, buyer_segment, priority, lead_score, notes, source_file)
       values (?,?,?,?,?,?,?,?,?,?,?)
       on duplicate key update
       company_name=values(company_name), website=coalesce(values(website), website), headquarters=coalesce(values(headquarters), headquarters),
       buyer_segment=values(buyer_segment), priority=values(priority), lead_score=greatest(lead_score, values(lead_score)),
       notes=coalesce(values(notes), notes), updated_at=current_timestamp`,
      [accountId, input.company_name, input.normalized_company_name, input.domain ?? "", input.website, input.headquarters, input.buyer_segment, input.priority, input.lead_score, input.notes, input.source_file]
    );
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      "select * from buyer_accounts where normalized_company_name=? and coalesce(domain,'')=? limit 1",
      [input.normalized_company_name, input.domain ?? ""]
    );
    return rows[0] as BuyerAccount;
  }

  async upsertContact(input: UpsertContactInput) {
    const contactId = id();
    await this.pool.execute(
      `insert into buyer_contacts
       (id, account_id, contact_name, role_title, contact_role, public_email, email_status, phone, contact_status)
       values (?,?,?,?,?,?,?,?,?)
       on duplicate key update
       contact_name=values(contact_name), contact_role=values(contact_role), email_status=values(email_status),
       phone=coalesce(values(phone), phone), contact_status=values(contact_status), updated_at=current_timestamp`,
      [contactId, input.account_id, input.contact_name, input.role_title ?? "", input.contact_role, input.public_email ?? "", input.email_status, input.phone, input.contact_status]
    );
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      "select * from buyer_contacts where account_id=? and coalesce(public_email,'')=? and coalesce(role_title,'')=? limit 1",
      [input.account_id, input.public_email ?? "", input.role_title ?? ""]
    );
    return rows[0] as BuyerContact;
  }

  async addSampleRequest(input: Omit<SampleRequest, "id" | "created_at">) {
    const rowId = id();
    await this.pool.execute(
      "insert into sample_requests (id, account_id, contact_id, company_name, contact_name, email, phone, request_payload) values (?,?,?,?,?,?,?,?)",
      [rowId, input.account_id, input.contact_id, input.company_name, input.contact_name, input.email, input.phone, JSON.stringify(input.request_payload)]
    );
    return { id: rowId, ...input, created_at: now() };
  }

  async addTask(input: Omit<Task, "id" | "created_at" | "updated_at">) {
    const rowId = id();
    await this.pool.execute(
      "insert into tasks (id, account_id, contact_id, task_type, status, notes, due_at) values (?,?,?,?,?,?,?)",
      [rowId, input.account_id, input.contact_id, input.task_type, input.status, input.notes, input.due_at]
    );
    return { id: rowId, ...input, created_at: now(), updated_at: now() };
  }

  async addSuppression(input: Omit<Suppression, "created_at">) {
    await this.pool.execute("insert ignore into suppression_list (email, reason, source) values (?,?,?)", [input.email.toLowerCase(), input.reason, input.source]);
    await this.pool.execute(
      `update buyer_contacts set contact_status='do_not_contact',
       unsubscribed=case when ?='unsubscribe' then true else unsubscribed end,
       bounced=case when ?='bounce' then true else bounced end,
       updated_at=current_timestamp where lower(public_email)=lower(?)`,
      [input.reason, input.reason, input.email]
    );
  }

  async suppressedEmails() {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>("select lower(email) as email from suppression_list");
    return new Set(rows.map((row) => String(row.email)));
  }

  async createDraft(input: DraftInput) {
    const rowId = id();
    await this.pool.execute(
      `insert into outreach_drafts
       (id, account_id, contact_id, channel, template_key, subject, body, status, risk_status, claims_used)
       values (?,?,?,?,?,?,?,?,?,?)`,
      [rowId, input.account_id, input.contact_id, input.channel, input.template_key, input.subject, input.body, input.status, input.risk_status, JSON.stringify(input.claims_used)]
    );
    return { id: rowId, ...input, reviewed_by: null, review_notes: null, sent_at: null, created_at: now(), updated_at: now() };
  }

  async hasIntroDraft(contactId: string) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      "select id from outreach_drafts where contact_id=? and template_key like '%intro%' and status in ('pending_approval','approved','sent') limit 1",
      [contactId]
    );
    return rows.length > 0;
  }

  async draftCandidates(limit: number) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `select ba.*, bc.id as c_id, bc.account_id as c_account_id, bc.contact_name, bc.role_title, bc.contact_role,
       bc.public_email, bc.email_status, bc.phone, bc.contact_status, bc.unsubscribed, bc.bounced, bc.created_at as c_created_at, bc.updated_at as c_updated_at
       from buyer_accounts ba join buyer_contacts bc on bc.account_id=ba.id
       where bc.contact_status='ready_for_draft' and bc.email_status='valid' and bc.public_email is not null
       order by ba.lead_score desc limit ?`,
      [limit]
    );
    return rows.map((row) => ({
      ...(row as unknown as BuyerAccount),
      contact: {
        id: row.c_id,
        account_id: row.c_account_id,
        contact_name: row.contact_name,
        role_title: row.role_title,
        contact_role: row.contact_role,
        public_email: row.public_email,
        email_status: row.email_status,
        phone: row.phone,
        contact_status: row.contact_status,
        unsubscribed: Boolean(row.unsubscribed),
        bounced: Boolean(row.bounced),
        created_at: row.c_created_at,
        updated_at: row.c_updated_at
      } as BuyerContact
    }));
  }

  async pendingDrafts(limit = 200) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `select od.*, ba.company_name, ba.priority, ba.lead_score, ba.buyer_segment, bc.public_email
       from outreach_drafts od
       join buyer_accounts ba on ba.id=od.account_id
       join buyer_contacts bc on bc.id=od.contact_id
       where od.status='pending_approval'
       order by ba.lead_score desc, od.created_at asc limit ?`,
      [limit]
    );
    return rows.map((row) => ({ ...row, claims_used: safeJson(row.claims_used, []) })) as DraftWithContext[];
  }

  async updateDraftStatus(idValue: string, status: OutreachDraft["status"], review?: { reviewed_by?: string; review_notes?: string }) {
    await this.pool.execute(
      "update outreach_drafts set status=?, reviewed_by=coalesce(?, reviewed_by), review_notes=coalesce(?, review_notes), updated_at=current_timestamp where id=?",
      [status, review?.reviewed_by ?? null, review?.review_notes ?? null, idValue]
    );
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>("select * from outreach_drafts where id=? limit 1", [idValue]);
    return (rows[0] as OutreachDraft) ?? null;
  }

  async markDraftSent(idValue: string) {
    await this.pool.execute("update outreach_drafts set status='sent', sent_at=current_timestamp, updated_at=current_timestamp where id=?", [idValue]);
  }

  async leads(limit = 250) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `select ba.*, bc.id as contact_id, bc.contact_name, bc.public_email, bc.contact_status, bc.email_status
       from buyer_accounts ba left join buyer_contacts bc on bc.account_id=ba.id
       order by ba.lead_score desc limit ?`,
      [limit]
    );
    return rows as LeadWithContact[];
  }

  async summary() {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
      `select
       (select count(*) from buyer_accounts) as accounts,
       (select count(*) from buyer_contacts) as contacts,
       (select count(*) from buyer_contacts where contact_status='ready_for_draft') as ready_for_draft,
       (select count(*) from buyer_contacts where contact_status='needs_manual_review') as needs_manual_review,
       (select count(*) from outreach_drafts where status='pending_approval') as pending_drafts,
       (select count(*) from outreach_drafts where status='sent') as sent`
    );
    return rows[0] as Record<string, number>;
  }

  async campaigns() {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>("select * from campaigns order by created_at desc");
    return rows as Campaign[];
  }

  async createCampaign(input: Pick<Campaign, "name" | "segment_filter" | "notes">): Promise<Campaign> {
    const rowId = id();
    await this.pool.execute("insert into campaigns (id, name, segment_filter, notes) values (?,?,?,?)", [rowId, input.name, input.segment_filter, input.notes]);
    return { id: rowId, status: "draft", ...input, created_at: now(), updated_at: now() };
  }
}

function safeJson(value: unknown, fallback: string[]) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value ?? fallback;
  } catch {
    return fallback;
  }
}

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    store = (process.env.DB_DRIVER ?? "memory") === "mysql" ? new MySqlStore() : new MemoryStore();
  }
  return store;
}
