import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { closeDb, query } from "../db.js";

dotenv.config();

function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function exportPendingApproval(exportDir = process.env.EXPORT_DIR ?? "./exports"): Promise<string> {
  const result = await query<Record<string, unknown>>(
    `select
      od.id,
      od.status,
      od.template_key,
      od.subject,
      od.body,
      od.risk_status,
      ba.company_name,
      bc.public_email,
      ba.priority,
      ba.lead_score
    from outreach_drafts od
    left join buyer_accounts ba on ba.id = od.account_id
    left join buyer_contacts bc on bc.id = od.contact_id
    where od.status = 'pending_approval'
    order by ba.lead_score desc nulls last, od.created_at asc`
  );
  const headers = Object.keys(result.rows[0] ?? {
    id: "",
    status: "",
    template_key: "",
    subject: "",
    body: "",
    risk_status: "",
    company_name: "",
    public_email: "",
    priority: "",
    lead_score: ""
  });
  const csv = [headers.map(csvEscape).join(","), ...result.rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
  const absoluteDir = path.resolve(process.cwd(), exportDir);
  fs.mkdirSync(absoluteDir, { recursive: true });
  const outputPath = path.join(absoluteDir, `pending_approval_${new Date().toISOString().slice(0, 10)}.csv`);
  fs.writeFileSync(outputPath, csv, "utf8");
  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  exportPendingApproval()
    .then((outputPath) => console.log(outputPath))
    .finally(() => closeDb());
}
