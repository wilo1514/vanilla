import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { closeDb, query } from "./db.js";
import { importMailList } from "./scripts/importMailList.js";
import { generateEmailDrafts } from "./scripts/generateEmailDrafts.js";
import { createTestEmailDraft } from "./scripts/createTestEmailDraft.js";
import { extractEmails } from "./rules/extractEmailAndContactRoutes.js";
import { classifyRole } from "./rules/classifyRole.js";
import { classifySegment } from "./rules/classifySegment.js";
import { isValidEmail } from "./rules/extractEmailAndContactRoutes.js";
import { normalizeCompanyName, normalizeText, toDomain, toWebsite } from "./rules/normalizeText.js";
import { scoreLead } from "./rules/scoreLead.js";

dotenv.config();

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json({ limit: "1mb" }));

const uuidParams = z.object({ id: z.string().uuid() });
const reviewBody = z.object({
  reviewed_by: z.string().optional(),
  review_notes: z.string().optional()
});
const sampleRequestBody = z.object({
  first_name: z.string().trim().min(1, "first_name is required"),
  last_name: z.string().trim().min(1, "last_name is required"),
  company: z.string().trim().min(1, "company is required"),
  title: z.string().trim().optional().default(""),
  email: z.string().trim().email("email must be format-valid"),
  phone: z.string().trim().optional().default(""),
  website: z.string().trim().optional().default(""),
  country: z.string().trim().optional().default(""),
  state: z.string().trim().optional().default(""),
  buyer_segment: z.string().trim().min(1, "buyer_segment is required"),
  estimated_monthly_usage: z.string().trim().optional().default(""),
  application: z.string().trim().optional().default(""),
  interested_in: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
  consent_to_contact: z.literal(true, {
    errorMap: () => ({ message: "consent_to_contact must be true" })
  }),
  source: z.string().trim().optional().default("local_landing"),
  submitted_at: z.string().trim().optional()
});
const suppressionBody = z.object({
  email: z.string().email(),
  source: z.string().optional()
});

app.get("/health", async (_req, res, next) => {
  try {
    const result = await query<{ now: Date }>("select now()");
    res.json({
      ok: true,
      service: "vanilla-republic-automation",
      runtime_ai: false,
      database_time: result.rows[0].now
    });
  } catch (error) {
    next(error);
  }
});

app.post("/contacts/import", async (req, res, next) => {
  try {
    const body = z.object({ mail_list_dir: z.string().optional() }).parse(req.body ?? {});
    const report = await importMailList(body.mail_list_dir);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

app.post("/contacts/score", async (_req, res, next) => {
  try {
    const result = await query(
      `update buyer_accounts ba
       set lead_score = lead_score,
           priority = case
             when lead_score >= 80 then 'A'
             when lead_score >= 60 then 'B'
             when lead_score >= 40 then 'C'
             else 'HOLD'
           end,
           updated_at = now()
       returning id, company_name, lead_score, priority`
    );
    res.json({ updated: result.rowCount, accounts: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post("/drafts/generate", async (req, res, next) => {
  try {
    const body = z.object({ limit: z.number().int().positive().max(5000).optional() }).parse(req.body ?? {});
    const result = await generateEmailDrafts(body.limit);
    res.json({ ...result, status: "pending_approval_only", sent: 0 });
  } catch (error) {
    next(error);
  }
});

app.post("/drafts/test-email", async (req, res, next) => {
  try {
    const body = z.object({
      recipient: z.string().email().optional(),
      reply_to: z.string().email().optional()
    }).parse(req.body ?? {});
    const result = await createTestEmailDraft(body.recipient, body.reply_to);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/drafts/pending", async (_req, res, next) => {
  try {
    const result = await query(
      `select
        od.id,
        od.channel,
        od.template_key,
        od.subject,
        od.body,
        od.risk_status,
        od.claims_used,
        od.created_at,
        ba.company_name,
        ba.priority,
        ba.lead_score,
        bc.public_email
      from outreach_drafts od
      left join buyer_accounts ba on ba.id = od.account_id
      left join buyer_contacts bc on bc.id = od.contact_id
      where od.status = 'pending_approval'
      order by ba.lead_score desc nulls last, od.created_at asc`
    );
    res.json({ drafts: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post("/drafts/:id/approve", async (req, res, next) => {
  try {
    const { id } = uuidParams.parse(req.params);
    const body = reviewBody.parse(req.body ?? {});
    const result = await query(
      `update outreach_drafts
       set status = 'approved', reviewed_at = now(), reviewed_by = $2, review_notes = $3
       where id = $1 and status = 'pending_approval'
       returning *`,
      [id, body.reviewed_by ?? null, body.review_notes ?? null]
    );
    res.json({ draft: result.rows[0] ?? null, sent: 0 });
  } catch (error) {
    next(error);
  }
});

app.post("/drafts/:id/reject", async (req, res, next) => {
  try {
    const { id } = uuidParams.parse(req.params);
    const body = reviewBody.parse(req.body ?? {});
    const result = await query(
      `update outreach_drafts
       set status = 'rejected', reviewed_at = now(), reviewed_by = $2, review_notes = $3
       where id = $1 and status = 'pending_approval'
       returning *`,
      [id, body.reviewed_by ?? null, body.review_notes ?? null]
    );
    res.json({ draft: result.rows[0] ?? null, sent: 0 });
  } catch (error) {
    next(error);
  }
});

app.post("/webhooks/sample-request", async (req, res, next) => {
  try {
    const body = sampleRequestBody.parse(req.body ?? {});
    const companyName = normalizeText(body.company);
    const fullName = normalizeText(`${body.first_name} ${body.last_name}`);
    const website = toWebsite(body.website);
    const domain = toDomain(website ?? body.website);
    const buyerSegment = classifySegment(body.buyer_segment, body.application, body.interested_in, body.message);
    const contactRole = classifyRole(body.title, body.message);
    const leadScore = scoreLead({
      buyer_segment: buyerSegment,
      contact_role: contactRole,
      contact_route_type: "email",
      headquarters: [body.state, body.country].filter(Boolean).join(", "),
      notes: [body.application, body.interested_in, body.message].filter(Boolean).join(" | "),
      category: body.buyer_segment
    });

    if (!isValidEmail(body.email)) {
      res.status(400).json({
        ok: false,
        error: "validation_error",
        message: "email must be format-valid"
      });
      return;
    }

    const accountResult = await query<{ id: string }>(
      `insert into buyer_accounts (
        company_name, normalized_company_name, domain, website, headquarters,
        buyer_segment, spreadsheet_segment, priority, lead_score, source_file, notes, updated_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now())
      on conflict (normalized_company_name, (coalesce(domain, ''))) do update set
        company_name = excluded.company_name,
        website = coalesce(excluded.website, buyer_accounts.website),
        headquarters = coalesce(excluded.headquarters, buyer_accounts.headquarters),
        buyer_segment = excluded.buyer_segment,
        spreadsheet_segment = excluded.spreadsheet_segment,
        priority = excluded.priority,
        lead_score = greatest(buyer_accounts.lead_score, excluded.lead_score),
        notes = concat_ws(' | ', buyer_accounts.notes, excluded.notes),
        updated_at = now()
      returning id`,
      [
        companyName,
        normalizeCompanyName(companyName),
        domain,
        website,
        [body.state, body.country].filter(Boolean).join(", ") || null,
        buyerSegment,
        body.buyer_segment,
        leadScore.priority,
        leadScore.total,
        body.source || "local_landing",
        [body.application, body.interested_in, body.message].filter(Boolean).join(" | ") || null
      ]
    );
    const accountId = accountResult.rows[0].id;

    const contactResult = await query<{ id: string }>(
      `insert into buyer_contacts (
        account_id, contact_name, role_title, contact_role, public_email,
        email_status, phone, contact_status, updated_at
      ) values ($1,$2,$3,$4,$5,'valid',$6,'needs_manual_review',now())
      on conflict (account_id, (coalesce(public_email, '')), (coalesce(role_title, ''))) do update set
        contact_name = excluded.contact_name,
        contact_role = excluded.contact_role,
        email_status = 'valid',
        phone = coalesce(excluded.phone, buyer_contacts.phone),
        contact_status = 'needs_manual_review',
        updated_at = now()
      returning id`,
      [accountId, fullName, body.title || null, contactRole, body.email.toLowerCase(), body.phone || null]
    );
    const contactId = contactResult.rows[0].id;

    await query(
      `insert into contact_routes (account_id, contact_id, route_type, route_value, source, is_primary)
       values ($1,$2,'email',$3,$4,true)
       on conflict (account_id, (coalesce(contact_id, '00000000-0000-0000-0000-000000000000'::uuid)), route_type, (coalesce(route_value, ''))) do update set
         source = excluded.source,
         is_primary = excluded.is_primary`,
      [accountId, contactId, body.email.toLowerCase(), body.source || "local_landing"]
    );

    await query(
      `insert into sample_requests (account_id, contact_id, company_name, contact_name, email, phone, request_payload)
       values ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
      [
        accountId,
        contactId,
        companyName,
        fullName,
        body.email.toLowerCase(),
        body.phone || null,
        JSON.stringify({ ...body, source: body.source || "local_landing" })
      ]
    );

    await query(
      `insert into tasks (account_id, contact_id, task_type, status, notes)
       values ($1,$2,'sample_request_review','new',$3)`,
      [accountId, contactId, `Review sample request from ${companyName} (${body.interested_in || "buyer inquiry"})`]
    );

    res.json({ ok: true, message: "Your request was received.", lead_id: accountId });
  } catch (error) {
    next(error);
  }
});

async function suppress(email: string, reason: "unsubscribe" | "bounce", source?: string) {
  await query(
    `insert into suppression_list (email, reason, source)
     values ($1,$2,$3)
     on conflict do nothing`,
    [email.toLowerCase(), reason, source ?? "api"]
  );
  await query(
    `update buyer_contacts
     set ${reason === "unsubscribe" ? "unsubscribed" : "bounced"} = true,
         contact_status = 'do_not_contact',
         updated_at = now()
     where lower(public_email) = lower($1)`,
    [email]
  );
}

app.post("/suppression/unsubscribe", async (req, res, next) => {
  try {
    const body = suppressionBody.parse(req.body ?? {});
    await suppress(body.email, "unsubscribe", body.source);
    res.json({ ok: true, email: body.email, reason: "unsubscribe" });
  } catch (error) {
    next(error);
  }
});

app.post("/suppression/bounce", async (req, res, next) => {
  try {
    const body = suppressionBody.parse(req.body ?? {});
    await suppress(body.email, "bounce", body.source);
    res.json({ ok: true, email: body.email, reason: "bounce" });
  } catch (error) {
    next(error);
  }
});

app.post("/suppression/bulk-text", async (req, res, next) => {
  try {
    const body = z.object({ text: z.string(), reason: z.enum(["unsubscribe", "bounce"]) }).parse(req.body ?? {});
    const emails = extractEmails(body.text);
    for (const email of emails) {
      await suppress(email, body.reason);
    }
    res.json({ imported: emails.length, reason: body.reason });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ ok: false, error: "validation_error", message: "Please correct the highlighted fields.", details: error.flatten() });
    return;
  }
  const dbCode = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : "";
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (["ECONNREFUSED", "57P01", "57P03", "08006", "08001"].includes(dbCode) || /connect ECONNREFUSED|database system is starting up/i.test(message)) {
    res.status(503).json({
      ok: false,
      error: "database_unavailable",
      message: "PostgreSQL is not ready. Please try again in a moment."
    });
    return;
  }
  res.status(500).json({ ok: false, error: "server_error", message });
});

const port = Number(process.env.PORT ?? 3009);

if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => {
    console.log(`vanilla-republic-automation listening on ${port}`);
  });

  process.on("SIGINT", async () => {
    server.close();
    await closeDb();
    process.exit(0);
  });
}

export { app };
