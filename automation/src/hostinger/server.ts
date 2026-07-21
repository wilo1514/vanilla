import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { importMailListHostinger } from "./mailImport.js";
import { generateHostingerDrafts } from "./drafts.js";
import { getStore } from "./store.js";
import { checkInbox, sendApprovedDraft } from "./email.js";
import { classifyRole } from "../rules/classifyRole.js";
import { classifySegment } from "../rules/classifySegment.js";
import { isValidEmail } from "../rules/extractEmailAndContactRoutes.js";
import { normalizeCompanyName, normalizeText, toDomain, toWebsite } from "../rules/normalizeText.js";
import { scoreLead } from "../rules/scoreLead.js";

dotenv.config();

const app = express();
const store = getStore();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "2mb" }));

const publicSiteDir = path.resolve(process.cwd(), process.env.PUBLIC_SITE_DIR ?? "../website/current_site/dist");

const sampleRequestBody = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  company: z.string().trim().min(1),
  title: z.string().trim().optional().default(""),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  website: z.string().trim().optional().default(""),
  country: z.string().trim().optional().default(""),
  state: z.string().trim().optional().default(""),
  buyer_segment: z.string().trim().min(1),
  estimated_monthly_usage: z.string().trim().optional().default(""),
  application: z.string().trim().optional().default(""),
  interested_in: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
  consent_to_contact: z.literal(true),
  source: z.string().trim().optional().default("landing"),
  submitted_at: z.string().trim().optional()
});

function requireJobSecret(req: express.Request, res: express.Response, next: express.NextFunction) {
  const expected = process.env.JOB_SECRET;
  if (!expected) {
    res.status(503).json({ ok: false, error: "job_secret_missing" });
    return;
  }
  const provided = req.header("x-job-secret") ?? String(req.query.key ?? "");
  if (provided !== expected) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({ ok: false, error: "admin_token_missing" });
    return;
  }
  const provided = req.header("x-admin-token") ?? String(req.query.token ?? "");
  if (provided !== expected) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }
  next();
}

app.get("/health", async (_req, res, next) => {
  try {
    res.json({
      ok: true,
      service: "vanilla-republic-hostinger",
      db: await store.health(),
      email_dry_run: process.env.EMAIL_DRY_RUN !== "false",
      openai_enabled: Boolean(process.env.OPENAI_API_KEY)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/webhooks/sample-request", async (req, res, next) => {
  try {
    const body = sampleRequestBody.parse(req.body ?? {});
    if (!isValidEmail(body.email)) {
      res.status(400).json({ ok: false, error: "validation_error", message: "email must be format-valid" });
      return;
    }
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
    const account = await store.upsertAccount({
      company_name: companyName,
      normalized_company_name: normalizeCompanyName(companyName),
      domain,
      website,
      headquarters: [body.state, body.country].filter(Boolean).join(", ") || null,
      buyer_segment: buyerSegment,
      priority: leadScore.priority,
      lead_score: leadScore.total,
      notes: [body.application, body.interested_in, body.message].filter(Boolean).join(" | ") || null,
      source_file: body.source
    });
    const contact = await store.upsertContact({
      account_id: account.id,
      contact_name: fullName,
      role_title: body.title,
      contact_role: contactRole,
      public_email: body.email.toLowerCase(),
      email_status: "valid",
      phone: body.phone || null,
      contact_status: "needs_manual_review"
    });
    await store.addSampleRequest({
      account_id: account.id,
      contact_id: contact.id,
      company_name: companyName,
      contact_name: fullName,
      email: body.email.toLowerCase(),
      phone: body.phone || null,
      request_payload: { ...body, source: body.source || "landing" }
    });
    await store.addTask({
      account_id: account.id,
      contact_id: contact.id,
      task_type: "sample_request_review",
      status: "new",
      notes: `Review sample request from ${companyName} (${body.interested_in || "buyer inquiry"})`,
      due_at: null
    });
    res.json({ ok: true, message: "Your request was received.", lead_id: account.id });
  } catch (error) {
    next(error);
  }
});

app.post("/jobs/import-mail-list", requireJobSecret, async (req, res, next) => {
  try {
    res.json(await importMailListHostinger(req.body?.mail_list_dir));
  } catch (error) {
    next(error);
  }
});

app.post("/jobs/generate-drafts", requireJobSecret, async (req, res, next) => {
  try {
    res.json(await generateHostingerDrafts(Number(req.body?.limit ?? 200)));
  } catch (error) {
    next(error);
  }
});

app.post("/jobs/check-inbox", requireJobSecret, async (_req, res, next) => {
  try {
    res.json(await checkInbox());
  } catch (error) {
    next(error);
  }
});

app.get("/admin", (_req, res) => {
  res.type("html").send(adminHtml());
});

app.get("/admin/api/summary", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await store.summary());
  } catch (error) {
    next(error);
  }
});

app.get("/admin/api/leads", requireAdmin, async (_req, res, next) => {
  try {
    res.json({ leads: await store.leads() });
  } catch (error) {
    next(error);
  }
});

app.get("/admin/api/drafts", requireAdmin, async (_req, res, next) => {
  try {
    res.json({ drafts: await store.pendingDrafts() });
  } catch (error) {
    next(error);
  }
});

app.post("/admin/api/drafts/:id/approve", requireAdmin, async (req, res, next) => {
  try {
    res.json({ draft: await store.updateDraftStatus(String(req.params.id), "approved", req.body ?? {}) });
  } catch (error) {
    next(error);
  }
});

app.post("/admin/api/drafts/:id/reject", requireAdmin, async (req, res, next) => {
  try {
    res.json({ draft: await store.updateDraftStatus(String(req.params.id), "rejected", req.body ?? {}) });
  } catch (error) {
    next(error);
  }
});

app.post("/admin/api/drafts/:id/send", requireAdmin, async (req, res, next) => {
  try {
    const drafts = await store.pendingDrafts(1000);
    const draftId = String(req.params.id);
    const draft = drafts.find((row) => row.id === draftId);
    if (!draft) {
      res.status(404).json({ ok: false, error: "draft_not_found_or_not_pending" });
      return;
    }
    await store.updateDraftStatus(draft.id, "approved", req.body ?? {});
    const result = await sendApprovedDraft(draft);
    if (result.ok) await store.markDraftSent(draft.id);
    res.json({ ...result, sent: result.dry_run ? 0 : 1 });
  } catch (error) {
    next(error);
  }
});

app.post("/admin/api/campaigns", requireAdmin, async (req, res, next) => {
  try {
    const body = z.object({ name: z.string().min(1), segment_filter: z.string().optional().nullable(), notes: z.string().optional().nullable() }).parse(req.body);
    res.json({ campaign: await store.createCampaign({ name: body.name, segment_filter: body.segment_filter ?? null, notes: body.notes ?? null }) });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ ok: false, error: "validation_error", message: "Please correct the highlighted fields.", details: error.flatten() });
    return;
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  res.status(500).json({ ok: false, error: "server_error", message });
});

if (fs.existsSync(publicSiteDir)) {
  app.use(express.static(publicSiteDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/admin/") || req.path.startsWith("/jobs/") || req.path.startsWith("/webhooks/")) {
      next();
      return;
    }
    res.sendFile(path.join(publicSiteDir, "index.html"));
  });
}

function adminHtml() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>The Vanilla Republic CRM</title>
<style>
body{margin:0;font-family:Inter,Arial,sans-serif;background:#f6f1e8;color:#201a14}.wrap{max-width:1180px;margin:0 auto;padding:28px}
header{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:22px}.brand{font-weight:900;font-size:24px}.token{display:flex;gap:8px}
input,button,textarea{font:inherit}input,textarea{border:1px solid #d9cdb8;border-radius:8px;padding:10px;background:#fff}button{border:0;border-radius:8px;padding:10px 14px;background:#211b15;color:#fff;font-weight:800;cursor:pointer}.gold{background:#d8b65e;color:#111}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:#fff;border:1px solid #e2d7c5;border-radius:10px;padding:16px;box-shadow:0 10px 30px rgba(50,38,22,.06)}.metric{font-size:30px;font-weight:900}.tabs{display:flex;gap:8px;margin:20px 0}.tab{background:#fff;color:#211b15;border:1px solid #d9cdb8}.tab.active{background:#d8b65e}.panel{display:none}.panel.active{display:block}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden}td,th{padding:12px;border-bottom:1px solid #eee;text-align:left;vertical-align:top}th{background:#211b15;color:#fff}.draft{white-space:pre-wrap;max-height:220px;overflow:auto}.muted{color:#786d60}.actions{display:flex;gap:8px;flex-wrap:wrap}@media(max-width:850px){.grid{grid-template-columns:1fr 1fr}header{display:block}.token{margin-top:12px}}@media(max-width:560px){.grid{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<header><div><div class="brand">The Vanilla Republic CRM</div><div class="muted">Buyer leads, campaigns, drafts, and approvals.</div></div><div class="token"><input id="token" type="password" placeholder="Admin token"/><button onclick="loadAll()">Connect</button></div></header>
<section class="grid" id="metrics"></section>
<div class="tabs"><button class="tab active" onclick="show('leads')">Leads</button><button class="tab" onclick="show('drafts')">Drafts</button><button class="tab" onclick="show('campaigns')">Campaigns</button></div>
<section id="leads" class="panel active card"></section><section id="drafts" class="panel card"></section><section id="campaigns" class="panel card"><h2>Create Campaign</h2><input id="campaignName" placeholder="Campaign name"/> <input id="segmentFilter" placeholder="Segment filter"/> <button onclick="createCampaign()">Create</button><div id="campaignResult"></div></section>
</div><script>
function token(){return document.getElementById('token').value}
async function api(path, opts={}){const r=await fetch(path,{...opts,headers:{'content-type':'application/json','x-admin-token':token(),...(opts.headers||{})}}); if(!r.ok) throw new Error(await r.text()); return r.json()}
function show(id){document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.getElementById(id).classList.add('active');event.target.classList.add('active')}
async function loadAll(){await Promise.all([summary(),leads(),drafts()])}
async function summary(){const s=await api('/admin/api/summary');document.getElementById('metrics').innerHTML=Object.entries(s).map(([k,v])=>'<div class="card"><div class="muted">'+k.replaceAll('_',' ')+'</div><div class="metric">'+v+'</div></div>').join('')}
async function leads(){const data=await api('/admin/api/leads');document.getElementById('leads').innerHTML='<h2>Buyer Leads</h2><table><tr><th>Company</th><th>Segment</th><th>Score</th><th>Email</th><th>Status</th></tr>'+data.leads.map(l=>'<tr><td>'+l.company_name+'</td><td>'+l.buyer_segment+'</td><td>'+l.lead_score+' / '+l.priority+'</td><td>'+(l.public_email||'')+'</td><td>'+(l.contact_status||'')+'</td></tr>').join('')+'</table>'}
async function drafts(){const data=await api('/admin/api/drafts');document.getElementById('drafts').innerHTML='<h2>Pending Drafts</h2>'+data.drafts.map(d=>'<div class="card"><b>'+d.company_name+'</b> <span class="muted">'+(d.public_email||'')+'</span><h3>'+d.subject+'</h3><div class="draft">'+d.body.replace(/[&<>]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))+'</div><div class="actions"><button class="gold" onclick="sendDraft(\\''+d.id+'\\')">Approve + Send</button><button onclick="approve(\\''+d.id+'\\')">Approve Only</button><button onclick="rejectDraft(\\''+d.id+'\\')">Reject</button></div></div>').join('')}
async function approve(id){await api('/admin/api/drafts/'+id+'/approve',{method:'POST',body:'{}'});await drafts();await summary()}
async function rejectDraft(id){await api('/admin/api/drafts/'+id+'/reject',{method:'POST',body:'{}'});await drafts();await summary()}
async function sendDraft(id){const r=await api('/admin/api/drafts/'+id+'/send',{method:'POST',body:'{}'});alert(r.dry_run?'Dry run: no email sent.':'Sent.');await drafts();await summary()}
async function createCampaign(){const body={name:document.getElementById('campaignName').value,segment_filter:document.getElementById('segmentFilter').value,notes:null};document.getElementById('campaignResult').textContent=JSON.stringify(await api('/admin/api/campaigns',{method:'POST',body:JSON.stringify(body)}),null,2)}
</script></body></html>`;
}

const port = Number(process.env.PORT ?? 3009);
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => console.log(`vanilla-republic-hostinger listening on ${port}`));
  process.on("SIGINT", async () => {
    server.close();
    await store.close();
    process.exit(0);
  });
}

export { app };
