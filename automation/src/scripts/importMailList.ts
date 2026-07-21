import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import XLSX from "xlsx";
import { closeDb, pool, query } from "../db.js";
import { ImportedRow, NormalizedContact } from "../types.js";
import { normalizeContact } from "../rules/normalizeContact.js";
import {
  firstNonEmpty,
  normalizeCompanyName,
  normalizeKey,
  parseNumber,
  parseSpreadsheetPriority,
  toDomain,
  toWebsite
} from "../rules/normalizeText.js";

dotenv.config();

type ImportReport = {
  files: string[];
  rows_seen: number;
  rows_imported: number;
  rows_skipped: number;
  ready_for_draft: number;
  needs_manual_review: number;
  do_not_contact: number;
  by_route: Record<string, number>;
  skipped: Array<{ file: string; sheet: string; row: number; reason: string }>;
};

const defaultReport: ImportReport = {
  files: [],
  rows_seen: 0,
  rows_imported: 0,
  rows_skipped: 0,
  ready_for_draft: 0,
  needs_manual_review: 0,
  do_not_contact: 0,
  by_route: {},
  skipped: []
};

function valueByAliases(row: Record<string, unknown>, aliases: string[]): string | null {
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    for (const [key, value] of Object.entries(row)) {
      if (normalizeKey(key) === normalizedAlias) {
        const text = firstNonEmpty(value);
        if (text) return text;
      }
    }
  }
  return null;
}

function rowToImported(sourceFile: string, sourceSheet: string, rowNumber: number, row: Record<string, unknown>): ImportedRow | null {
  const company = valueByAliases(row, ["Company", "Company Name"]);
  if (!company) return null;

  const category = valueByAliases(row, ["Category", "Buyer Type", "Company Type", "Vanilla Channel Fit", "Relevant Capabilities"]);
  const route = valueByAliases(row, ["Contact / Supplier URL", "Contact URL", "Best Contact Route", "Procurement Route", "Source URL"]);
  const website = valueByAliases(row, ["Website"]);
  const publicEmail = valueByAliases(row, ["Public Email", "Email"]);
  const notes = [
    valueByAliases(row, ["Vanilla Relevance", "Vanilla Buyer Fit", "Buyer Fit"]),
    valueByAliases(row, ["Why This Buyer Matters", "Why It Matters"]),
    valueByAliases(row, ["Recommended First Approach", "First Move"]),
    valueByAliases(row, ["Verification Notes", "Data Confidence"])
  ]
    .filter(Boolean)
    .join(" | ");

  const spreadsheetPriority = parseSpreadsheetPriority(valueByAliases(row, ["Priority Tier", "Priority"]));

  return {
    source_file: sourceFile,
    source_sheet: sourceSheet,
    row_number: rowNumber,
    company_name: company,
    normalized_company_name: normalizeCompanyName(company),
    website: toWebsite(website),
    domain: toDomain(website),
    phone: valueByAliases(row, ["Public Phone", "Phone"]),
    public_email: publicEmail,
    contact_form_url: route,
    supplier_portal_url: valueByAliases(row, ["Procurement Route", "Best Contact Route"]),
    notes: notes || null,
    spreadsheet_segment: category,
    spreadsheet_priority: spreadsheetPriority,
    spreadsheet_score: parseNumber(valueByAliases(row, ["Score"])),
    recommended_role: valueByAliases(row, ["Recommended Role to Target", "Best Buyer Role", "Recommended Contact Role"]),
    headquarters: valueByAliases(row, ["Headquarters", "HQ / Primary Country", "HQ / Country"])
  };
}

async function suppressedEmails(): Promise<Set<string>> {
  const result = await query<{ email: string }>("select lower(email) as email from suppression_list where email is not null");
  return new Set(result.rows.map((row) => row.email));
}

async function upsertNormalizedContact(row: NormalizedContact): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const accountResult = await client.query<{ id: string }>(
      `insert into buyer_accounts (
        company_name, normalized_company_name, domain, website, headquarters, buyer_segment,
        spreadsheet_segment, priority, lead_score, source_file, source_sheet, source_row, notes, updated_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now())
      on conflict (normalized_company_name, (coalesce(domain, ''))) do update set
        company_name = excluded.company_name,
        website = coalesce(excluded.website, buyer_accounts.website),
        headquarters = coalesce(excluded.headquarters, buyer_accounts.headquarters),
        buyer_segment = excluded.buyer_segment,
        spreadsheet_segment = excluded.spreadsheet_segment,
        priority = excluded.priority,
        lead_score = greatest(buyer_accounts.lead_score, excluded.lead_score),
        notes = coalesce(excluded.notes, buyer_accounts.notes),
        updated_at = now()
      returning id`,
      [
        row.company_name,
        row.normalized_company_name,
        row.domain,
        row.website,
        row.headquarters,
        row.buyer_segment,
        row.spreadsheet_segment,
        row.priority,
        row.lead_score,
        row.source_file,
        row.source_sheet,
        row.row_number,
        row.notes
      ]
    );
    const accountId = accountResult.rows[0].id;
    const contactResult = await client.query<{ id: string }>(
      `insert into buyer_contacts (
        account_id, role_title, contact_role, public_email, email_status, phone, contact_status, updated_at
      ) values ($1,$2,$3,$4,$5,$6,$7,now())
      on conflict (account_id, (coalesce(public_email, '')), (coalesce(role_title, ''))) do update set
        contact_role = excluded.contact_role,
        email_status = excluded.email_status,
        phone = coalesce(excluded.phone, buyer_contacts.phone),
        contact_status = excluded.contact_status,
        updated_at = now()
      returning id`,
      [
        accountId,
        row.recommended_role,
        row.contact_role,
        row.public_email,
        row.email_status,
        row.phone,
        row.contact_status
      ]
    );
    const contactId = contactResult.rows[0].id;
    const routeValue =
      row.public_email ?? row.supplier_portal_url ?? row.contact_form_url ?? row.phone ?? row.website ?? null;
    await client.query(
      `insert into contact_routes (account_id, contact_id, route_type, route_value, source, is_primary)
       values ($1,$2,$3,$4,$5,true)
       on conflict (account_id, (coalesce(contact_id, '00000000-0000-0000-0000-000000000000'::uuid)), route_type, (coalesce(route_value, ''))) do update set
         source = excluded.source,
         is_primary = excluded.is_primary`,
      [accountId, contactId, row.contact_route_type, routeValue, row.source_file]
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function importMailList(mailListDir = process.env.MAIL_LIST_DIR ?? "../mail_list"): Promise<ImportReport> {
  const absoluteDir = path.resolve(process.cwd(), mailListDir);
  const report: ImportReport = structuredClone(defaultReport);
  const suppressed = await suppressedEmails();
  const seen = new Set<string>();
  const files = fs.readdirSync(absoluteDir).filter((file) => file.toLowerCase().endsWith(".xlsx"));
  report.files = files;

  for (const file of files) {
    const workbook = XLSX.readFile(path.join(absoluteDir, file), { cellDates: true });
    for (const sheetName of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: null });
      for (const [index, rawRow] of rows.entries()) {
        report.rows_seen += 1;
        const imported = rowToImported(file, sheetName, index + 2, rawRow);
        if (!imported) {
          report.rows_skipped += 1;
          report.skipped.push({ file, sheet: sheetName, row: index + 2, reason: "missing_company" });
          continue;
        }
        const normalized = normalizeContact(imported, suppressed);
        const dedupeKey = [
          normalized.normalized_company_name,
          normalized.domain ?? "",
          normalized.public_email ?? ""
        ].join("|");
        if (seen.has(dedupeKey)) {
          report.rows_skipped += 1;
          report.skipped.push({ file, sheet: sheetName, row: index + 2, reason: "duplicate_in_import" });
          continue;
        }
        seen.add(dedupeKey);
        await upsertNormalizedContact(normalized);
        report.rows_imported += 1;
        report[normalized.contact_status] += 1;
        report.by_route[normalized.contact_route_type] = (report.by_route[normalized.contact_route_type] ?? 0) + 1;
      }
    }
  }

  fs.mkdirSync(path.resolve(process.cwd(), "reports"), { recursive: true });
  fs.writeFileSync(path.resolve(process.cwd(), "reports", "mail_list_import_report.json"), JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  importMailList()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2));
    })
    .finally(() => closeDb());
}
