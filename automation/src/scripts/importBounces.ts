import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { closeDb, query } from "../db.js";
import { extractEmails } from "../rules/extractEmailAndContactRoutes.js";

export async function importBounces(filePath = process.argv[2]): Promise<{ imported: number }> {
  if (!filePath) throw new Error("Usage: npm run suppression:bounces -- path/to/bounces.csv");
  const text = fs.readFileSync(filePath, "utf8");
  const emails = Array.from(new Set(extractEmails(text)));
  for (const email of emails) {
    await query(
      `insert into suppression_list (email, reason, source)
       values ($1,'bounce',$2)
       on conflict do nothing`,
      [email, filePath]
    );
    await query(
      `update buyer_contacts set bounced = true, contact_status = 'do_not_contact', updated_at = now()
       where lower(public_email) = lower($1)`,
      [email]
    );
  }
  return { imported: emails.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  importBounces()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => closeDb());
}
