# Hostinger Go-Live Checklist

Use this when you are ready to deploy The Vanilla Republic.

Temporary Hostinger URL:

```txt
https://moccasin-mouse-280097.hostingersite.com/
```

For the first deployment, you can run the landing and API from the same Node.js Web App:

```txt
Landing: https://moccasin-mouse-280097.hostingersite.com/
API health: https://moccasin-mouse-280097.hostingersite.com/health
Admin CRM: https://moccasin-mouse-280097.hostingersite.com/admin
Form endpoint: https://moccasin-mouse-280097.hostingersite.com/webhooks/sample-request
```

## 1. Before Upload

Run locally:

```powershell
cd automation
npm run build
$env:DB_DRIVER='memory'
$env:EMAIL_DRY_RUN='true'
$env:ENABLE_OPENAI_DRAFT_ASSIST='false'
$env:MAIL_LIST_DIR='../mail_list'
npm run hostinger:smoke
```

Expected:

- `ok: true`
- `rows_imported` around `346`
- `ready_for_draft` around `112`
- `needs_manual_review` around `234`
- `sent: 0`

Build website:

```powershell
cd website/current_site
$env:VITE_SAMPLE_REQUEST_ENDPOINT='https://moccasin-mouse-280097.hostingersite.com/webhooks/sample-request'
npm run build
```

For the all-in-one Node.js Web App deployment, keep `PUBLIC_SITE_DIR=../website/current_site/dist`.
For a separate static website deployment, upload the contents of `website/current_site/dist` to the public site root.

## 2. Hostinger MySQL

Create a MySQL database in hPanel.

Save:

- Host
- Database name
- Username
- Password
- Port, usually `3306`

Run the schema in phpMyAdmin/Adminer:

```txt
automation/src/hostinger/schema.mysql.sql
```

## 3. Hostinger Node.js Web App

Create a Node.js Web App.

Recommended:

```txt
Repository: GitHub repository
Root directory: automation
Build command: npm install && npm run build:hostinger
Start command: npm run start
```

If Hostinger installs dependencies automatically:

```txt
Build command: npm run build:hostinger
Start command: npm run start
```

## 4. Environment Variables

Set:

```txt
NODE_ENV=production
DB_DRIVER=mysql
MYSQL_HOST=<from Hostinger>
MYSQL_PORT=3306
MYSQL_USER=<from Hostinger>
MYSQL_PASSWORD=<from Hostinger>
MYSQL_DATABASE=<from Hostinger>
ADMIN_TOKEN=<long random token>
JOB_SECRET=<long random token>
MAIL_LIST_DIR=../mail_list
PUBLIC_BASE_URL=https://api.yourdomain.com
PUBLIC_SITE_DIR=../website/current_site/dist
CORS_ORIGIN=https://moccasin-mouse-280097.hostingersite.com
PHYSICAL_MAILING_ADDRESS=<business mailing address>
EMAIL_DRY_RUN=true
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<hostinger mailbox>
SMTP_PASSWORD=<mailbox password>
SMTP_FROM=<hostinger mailbox>
SMTP_REPLY_TO=<reply mailbox>
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=<hostinger mailbox>
IMAP_PASSWORD=<mailbox password>
ENABLE_OPENAI_DRAFT_ASSIST=false
OPENAI_DRAFT_MODEL=gpt-4.1-mini
OPENAI_API_KEY=
```

Keep `EMAIL_DRY_RUN=true` for the first live test.

## 5. First Live Test

Open:

```txt
https://api.yourdomain.com/health
https://api.yourdomain.com/admin
```

Use `ADMIN_TOKEN` in the admin token field.

Test the landing form with your own information.

Confirm:

- New lead appears in CRM.
- New task appears in database.
- No email is sent.

## 6. Import Mail List

Run once:

```txt
POST https://api.yourdomain.com/jobs/import-mail-list?key=JOB_SECRET
```

Then open admin CRM and confirm leads are visible.

## 7. Generate Drafts

Run:

```txt
POST https://api.yourdomain.com/jobs/generate-drafts?key=JOB_SECRET
```

Confirm:

- Drafts appear in admin CRM.
- Status is pending approval.
- No email is sent while `EMAIL_DRY_RUN=true`.

## 8. Cron Jobs

Add Hostinger Cron Jobs:

Every 15 minutes:

```txt
curl -X POST "https://api.yourdomain.com/jobs/check-inbox?key=JOB_SECRET"
```

Every 30 minutes:

```txt
curl -X POST "https://api.yourdomain.com/jobs/generate-drafts?key=JOB_SECRET" -H "Content-Type: application/json" -d "{\"limit\":50}"
```

Do not schedule import unless you intentionally update the XLSX files.

## 9. Enable Real Sending

Only after dry-run tests:

```txt
EMAIL_DRY_RUN=false
```

Then approve and send one controlled draft to your own test email first.

## 10. Safety Rules

- Do not publish `.env` files.
- Do not expose `ADMIN_TOKEN`.
- Do not expose `JOB_SECRET`.
- Do not enable automatic sending.
- OpenAI may assist drafts only when explicitly enabled.
- All buyer-facing content stays in English.
- Do not claim every lot has the August 2025 / Harvest 2 vanillin result.
