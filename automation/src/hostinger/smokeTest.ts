import dotenv from "dotenv";
import { importMailListHostinger } from "./mailImport.js";
import { generateHostingerDrafts } from "./drafts.js";
import { getStore } from "./store.js";

dotenv.config();
process.env.DB_DRIVER = process.env.DB_DRIVER || "memory";
process.env.EMAIL_DRY_RUN = "true";

async function main() {
  const store = getStore();
  const importReport = await importMailListHostinger(process.env.MAIL_LIST_DIR ?? "../mail_list");
  const draftReport = await generateHostingerDrafts(25);
  const pending = await store.pendingDrafts(5);
  const summary = await store.summary();
  const result = {
    ok: true,
    db_driver: store.mode,
    import: {
      files: importReport.files,
      rows_seen: importReport.rows_seen,
      rows_imported: importReport.rows_imported,
      ready_for_draft: importReport.ready_for_draft,
      needs_manual_review: importReport.needs_manual_review,
      do_not_contact: importReport.do_not_contact,
      by_route: importReport.by_route
    },
    drafts: draftReport,
    pending_preview: pending.map((draft) => ({
      id: draft.id,
      company_name: draft.company_name,
      recipient: draft.public_email,
      subject: draft.subject,
      status: draft.status
    })),
    summary
  };
  console.log(JSON.stringify(result, null, 2));
  await store.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
