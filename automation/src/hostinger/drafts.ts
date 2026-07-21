import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { claimGuard } from "../rules/claimGuard.js";
import { selectEmailTemplate } from "../rules/selectEmailTemplate.js";
import type { BuyerSegment, ContactRole, Priority } from "../types.js";
import { getStore } from "./store.js";
import { maybeRefineDraftWithOpenAI } from "./openaiDraftAssist.js";

function templatePath(templateKey: string) {
  return path.resolve(process.cwd(), "src", "templates", "emails", `${templateKey}.hbs`);
}

function splitSubject(rendered: string) {
  const lines = rendered.replace(/\r\n/g, "\n").split("\n");
  const first = lines[0] ?? "";
  if (first.toLowerCase().startsWith("subject:")) {
    return { subject: first.replace(/^subject:\s*/i, "").trim(), body: lines.slice(1).join("\n").trim() };
  }
  return { subject: "The Vanilla Republic", body: rendered.trim() };
}

export async function generateHostingerDrafts(limit = 200) {
  const store = getStore();
  const candidates = await store.draftCandidates(limit);
  let created = 0;
  let skipped = 0;
  const queuedEmails = new Set<string>();

  for (const candidate of candidates) {
    const email = candidate.contact.public_email?.trim().toLowerCase();
    if (!email || queuedEmails.has(email)) {
      skipped += 1;
      continue;
    }
    if (await store.hasIntroDraft(candidate.contact.id)) {
      skipped += 1;
      continue;
    }
    queuedEmails.add(email);
    const templateKey = selectEmailTemplate({
      buyer_segment: candidate.buyer_segment as BuyerSegment,
      contact_role: candidate.contact.contact_role as ContactRole,
      priority: candidate.priority as Priority
    });
    if (!templateKey) {
      skipped += 1;
      continue;
    }
    const source = fs.readFileSync(templatePath(templateKey), "utf8");
    const rendered = Handlebars.compile(source, { noEscape: true })({
      companyName: candidate.company_name,
      contactGreeting: "there",
      physicalMailingAddress: process.env.PHYSICAL_MAILING_ADDRESS ?? "[Physical Mailing Address]"
    });
    const raw = splitSubject(rendered);
    const refined = await maybeRefineDraftWithOpenAI({
      subject: raw.subject,
      body: raw.body,
      companyName: candidate.company_name
    });
    const guard = claimGuard(`${refined.subject}\n${refined.body}`);
    await store.createDraft({
      account_id: candidate.id,
      contact_id: candidate.contact.id,
      channel: "email",
      template_key: templateKey,
      subject: refined.subject,
      body: refined.body,
      status: "pending_approval",
      risk_status: guard.risk_status,
      claims_used: guard.claims_used
    });
    created += 1;
  }
  return { created, skipped, sent: 0, status: "pending_approval_only" };
}
