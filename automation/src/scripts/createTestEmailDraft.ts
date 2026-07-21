import dotenv from "dotenv";
import { pathToFileURL } from "node:url";
import { closeDb, query } from "../db.js";
import { claimGuard } from "../rules/claimGuard.js";
import { normalizeCompanyName } from "../rules/normalizeText.js";

dotenv.config();

type TestDraftResult = {
  ok: true;
  draft_id: string;
  recipient: string;
  reply_to: string;
  status: "pending_approval";
  sent: 0;
};

export async function createTestEmailDraft(
  recipient = process.env.TEST_EMAIL_RECIPIENT ?? "your-test-recipient@example.com",
  replyTo = process.env.TEST_REPLY_TO ?? "your-reply-to@example.com"
): Promise<TestDraftResult> {
  const companyName = "The Vanilla Republic Local Test Buyer";
  const normalizedCompanyName = normalizeCompanyName(companyName);
  const account = await query<{ id: string }>(
    `insert into buyer_accounts (
      company_name, normalized_company_name, domain, website, headquarters,
      buyer_segment, spreadsheet_segment, priority, lead_score, source_file, notes, updated_at
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now())
    on conflict (normalized_company_name, (coalesce(domain, ''))) do update set
      buyer_segment = excluded.buyer_segment,
      priority = excluded.priority,
      lead_score = excluded.lead_score,
      notes = excluded.notes,
      updated_at = now()
    returning id`,
    [
      companyName,
      normalizedCompanyName,
      "local-test.example",
      "https://local-test.example",
      "Local QA",
      "test_buyer",
      "local_test",
      "A",
      100,
      "manual_test_email",
      `Manual test draft only. Recipient: ${recipient}. Reply-To: ${replyTo}. No email was sent.`
    ]
  );

  const contact = await query<{ id: string }>(
    `insert into buyer_contacts (
      account_id, contact_name, role_title, contact_role, public_email,
      email_status, contact_status, updated_at
    ) values ($1,$2,$3,$4,$5,'valid','ready_for_draft',now())
    on conflict (account_id, (coalesce(public_email, '')), (coalesce(role_title, ''))) do update set
      contact_name = excluded.contact_name,
      contact_role = excluded.contact_role,
      email_status = 'valid',
      contact_status = 'ready_for_draft',
      updated_at = now()
    returning id`,
    [account.rows[0].id, "William Lituma", "Local Test Recipient", "buyer", recipient.toLowerCase()]
  );

  await query(
    `insert into contact_routes (account_id, contact_id, route_type, route_value, source, is_primary)
     values ($1,$2,'email',$3,'manual_test_email',true)
     on conflict (account_id, (coalesce(contact_id, '00000000-0000-0000-0000-000000000000'::uuid)), route_type, (coalesce(route_value, ''))) do update set
       source = excluded.source,
       is_primary = excluded.is_primary`,
    [account.rows[0].id, contact.rows[0].id, recipient.toLowerCase()]
  );

  const body = [
    "Hello William,",
    "",
    "This is a local approval-queue test draft from The Vanilla Republic deterministic automation system.",
    "",
    "Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin.",
    "",
    "No email has been sent automatically. This record exists only as a pending approval draft for local ecosystem testing.",
    "",
    "Best regards,",
    "The Vanilla Republic",
    "",
    `Reply-To for a future approved send: ${replyTo}`
  ].join("\n");
  const subject = "Local test draft - The Vanilla Republic";
  const guard = claimGuard(`${subject}\n${body}`);

  const draft = await query<{ id: string }>(
    `insert into outreach_drafts (
      account_id, contact_id, channel, template_key, subject, body, status, risk_status, claims_used, review_notes
    ) values ($1,$2,'email','manual_test_email',$3,$4,'pending_approval',$5,$6::jsonb,$7)
    returning id`,
    [
      account.rows[0].id,
      contact.rows[0].id,
      subject,
      body,
      guard.risk_status,
      JSON.stringify(guard.claims_used),
      `Dry-run test draft. Recipient=${recipient}. Reply-To=${replyTo}. Sent=0.`
    ]
  );

  await query(
    `insert into outreach_events (draft_id, account_id, contact_id, event_type, notes)
     values ($1,$2,$3,'test_email_draft_created',$4)`,
    [
      draft.rows[0].id,
      account.rows[0].id,
      contact.rows[0].id,
      `Created pending approval test draft for ${recipient}. Reply-To ${replyTo}. No email sent.`
    ]
  );

  return {
    ok: true,
    draft_id: draft.rows[0].id,
    recipient,
    reply_to: replyTo,
    status: "pending_approval",
    sent: 0
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createTestEmailDraft(process.argv[2], process.argv[3])
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => closeDb());
}
