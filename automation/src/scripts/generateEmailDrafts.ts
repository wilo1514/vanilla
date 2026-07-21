import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Handlebars from "handlebars";
import { closeDb, query } from "../db.js";
import { claimGuard } from "../rules/claimGuard.js";
import { selectEmailTemplate } from "../rules/selectEmailTemplate.js";
import { BuyerSegment, ContactRole, Priority } from "../types.js";

dotenv.config();

type DraftCandidate = {
  account_id: string;
  contact_id: string;
  company_name: string;
  buyer_segment: BuyerSegment;
  contact_role: ContactRole;
  priority: Priority;
  public_email: string;
  role_title: string | null;
};

function templatePath(templateKey: string): string {
  return path.resolve(process.cwd(), "src", "templates", "emails", `${templateKey}.hbs`);
}

function splitSubject(rendered: string): { subject: string; body: string } {
  const lines = rendered.replace(/\r\n/g, "\n").split("\n");
  const first = lines[0] ?? "";
  if (first.toLowerCase().startsWith("subject:")) {
    return { subject: first.replace(/^subject:\s*/i, "").trim(), body: lines.slice(1).join("\n").trim() };
  }
  return { subject: "The Vanilla Republic", body: rendered.trim() };
}

export async function generateEmailDrafts(limit = 500): Promise<{ created: number; skipped: number }> {
  const candidates = await query<DraftCandidate>(
    `select
      ba.id as account_id,
      bc.id as contact_id,
      ba.company_name,
      ba.buyer_segment,
      bc.contact_role,
      ba.priority,
      bc.public_email,
      bc.role_title
    from buyer_accounts ba
    join buyer_contacts bc on bc.account_id = ba.id
    where bc.contact_status = 'ready_for_draft'
      and bc.email_status = 'valid'
      and bc.public_email is not null
      and not exists (
        select 1 from outreach_drafts od
        where od.contact_id = bc.id and od.template_key like '%intro%' and od.status in ('pending_approval','approved')
      )
    order by ba.lead_score desc
    limit $1`,
    [limit]
  );

  let created = 0;
  let skipped = 0;
  for (const candidate of candidates.rows) {
    const templateKey = selectEmailTemplate(candidate);
    if (!templateKey) {
      skipped += 1;
      continue;
    }
    const source = fs.readFileSync(templatePath(templateKey), "utf8");
    const render = Handlebars.compile(source, { noEscape: true });
    const rendered = render({
      companyName: candidate.company_name,
      contactGreeting: "there",
      physicalMailingAddress: process.env.PHYSICAL_MAILING_ADDRESS ?? "[Physical Mailing Address]"
    });
    const { subject, body } = splitSubject(rendered);
    const guard = claimGuard(`${subject}\n${body}`);
    await query(
      `insert into outreach_drafts (
        account_id, contact_id, channel, template_key, subject, body, status, risk_status, claims_used
      ) values ($1,$2,'email',$3,$4,$5,'pending_approval',$6,$7::jsonb)`,
      [
        candidate.account_id,
        candidate.contact_id,
        templateKey,
        subject,
        body,
        guard.risk_status,
        JSON.stringify(guard.claims_used)
      ]
    );
    created += 1;
  }
  return { created, skipped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateEmailDrafts(Number(process.argv[2] ?? 500))
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => closeDb());
}
