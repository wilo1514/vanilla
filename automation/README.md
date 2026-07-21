# The Vanilla Republic Automation

## Current Production Direction

The production path is now **Hostinger code-first automation**:

- Node.js Web App from GitHub
- MySQL
- Hostinger Email SMTP/IMAP
- Hostinger Cron Jobs
- Admin CRM panel at `/admin`
- No n8n in production
- No Docker in production
- No VPS required
- No automatic email sending by default

See:

```txt
../docs/HOSTINGER_CODE_FIRST_AUTOMATION.md
```

Quick local smoke test:

```powershell
cd automation
$env:DB_DRIVER='memory'
$env:EMAIL_DRY_RUN='true'
$env:ADMIN_TOKEN='local-admin-token'
$env:JOB_SECRET='local-job-secret'
$env:MAIL_LIST_DIR='../mail_list'
npm run build
npm run hostinger:smoke
```

Start local Hostinger-compatible API:

```powershell
cd automation
$env:DB_DRIVER='memory'
$env:EMAIL_DRY_RUN='true'
$env:ADMIN_TOKEN='local-admin-token'
$env:JOB_SECRET='local-job-secret'
$env:MAIL_LIST_DIR='../mail_list'
$env:PORT='3009'
npm run start
```

Open:

```txt
http://localhost:3009/admin
```

Deterministic low-AI automation for B2B buyer import, scoring, draft generation, suppression handling, sample request intake, and manual approval queues.

Runtime rules:
- No OpenAI calls.
- No Apollo, Hunter, ZeroBounce, or paid enrichment calls.
- No automatic email sending.
- Generated email content is stored as `pending_approval`.
- Brand-facing content is English.
- Claims are checked by deterministic `claimGuard`.

## Setup

```bash
cd automation
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env`, then initialize PostgreSQL:

```bash
npm run db:init
```

## Commands

Import all Excel files from `../mail_list`:

```bash
npm run import:mail-list
```

Generate email drafts only:

```bash
npm run drafts:generate
```

Export pending drafts to CSV:

```bash
npm run drafts:export
```

Import unsubscribe or bounce files containing email addresses:

```bash
npm run suppression:unsubscribes -- ./path/to/unsubscribes.csv
npm run suppression:bounces -- ./path/to/bounces.csv
```

Run the API:

```bash
npm run dev
```

Check health:

```bash
npm run healthcheck
```

## API

- `GET /health`
- `POST /contacts/import`
- `POST /contacts/score`
- `POST /drafts/generate`
- `GET /drafts/pending`
- `POST /drafts/:id/approve`
- `POST /drafts/:id/reject`
- `POST /webhooks/sample-request`
- `POST /suppression/unsubscribe`
- `POST /suppression/bounce`

Approving a draft marks it approved for human review. It does not send email.

## Mail List Import

The importer reads every `.xlsx` file in `../mail_list`, detects columns dynamically, separates real email addresses from contact forms, supplier portals, URLs, and text such as `Not publicly listed`, validates email format in code, deduplicates by normalized company name, domain, and email, assigns deterministic buyer segment and route type, and writes `reports/mail_list_import_report.json`.

Outreach status rules:
- `ready_for_draft`: valid email route and not suppressed.
- `needs_manual_review`: form, portal, phone, or website-only route.
- `do_not_contact`: suppressed, unsubscribed, bounced, or invalid email.

## Database Tables

- `buyer_accounts`
- `buyer_contacts`
- `contact_routes`
- `suppression_list`
- `outreach_drafts`
- `outreach_events`
- `sample_requests`
- `social_drafts`
- `tasks`
