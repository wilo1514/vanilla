# Hostinger Code-First Automation

This replaces n8n/Docker/PostgreSQL in production with a Hostinger Cloud Startup compatible stack.

## Production Stack

- Hostinger Node.js Web App deployed from GitHub
- Hostinger MySQL
- Hostinger Email SMTP/IMAP
- Hostinger Cron Jobs
- Optional OpenAI API for draft assistance only
- No n8n
- No Docker
- No VPS
- No automatic sending by default

## Local Safe Mode

Local tests can run without MySQL by using the in-memory store.

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

Start local API:

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
http://localhost:3009/health
http://localhost:3009/admin
```

Use `local-admin-token` in the admin token field.

## Hostinger Environment Variables

Set these in the Hostinger Node.js Web App environment:

```txt
NODE_ENV=production
PORT=<Hostinger provided port if required>
DB_DRIVER=mysql
MYSQL_HOST=<hostinger mysql host>
MYSQL_PORT=3306
MYSQL_USER=<mysql user>
MYSQL_PASSWORD=<mysql password>
MYSQL_DATABASE=<mysql database>
ADMIN_TOKEN=<long random admin token>
JOB_SECRET=<long random cron token>
MAIL_LIST_DIR=../mail_list
PUBLIC_BASE_URL=https://api.yourdomain.com
PHYSICAL_MAILING_ADDRESS=<business mailing address>
EMAIL_DRY_RUN=true
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<hostinger mailbox>
SMTP_PASSWORD=<hostinger mailbox password>
SMTP_FROM=<hostinger mailbox>
SMTP_REPLY_TO=<reply mailbox>
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=<hostinger mailbox>
IMAP_PASSWORD=<hostinger mailbox password>
OPENAI_API_KEY=
```

If Hostinger deploys only the `automation` folder instead of the whole repository, create `automation/mail_list`, upload the XLSX files there, and use:

```txt
MAIL_LIST_DIR=./mail_list
```

Keep `EMAIL_DRY_RUN=true` until you manually verify drafts and sending.

## MySQL Schema

Run this SQL in Hostinger MySQL using phpMyAdmin/Adminer:

```txt
automation/src/hostinger/schema.mysql.sql
```

Or run from a trusted machine with credentials:

```powershell
cd automation
$env:DB_DRIVER='mysql'
$env:MYSQL_HOST='<host>'
$env:MYSQL_USER='<user>'
$env:MYSQL_PASSWORD='<password>'
$env:MYSQL_DATABASE='<database>'
npm run db:mysql:init
```

## Hostinger Node.js App

Recommended settings:

```txt
Repository: GitHub repo for this project
Root directory: automation
Build command: npm install && npm run build:hostinger
Start command: npm run start
```

If Hostinger runs `npm install` automatically, use:

```txt
Build command: npm run build:hostinger
Start command: npm run start
```

The `build:hostinger` script builds the React/Vite landing first with `VITE_SAMPLE_REQUEST_ENDPOINT=/webhooks/sample-request`, then compiles the Node.js API.

## Cron Jobs

Create Hostinger cron jobs that call protected endpoints.

Every 15 minutes:

```txt
curl -X POST "https://api.yourdomain.com/jobs/check-inbox?key=JOB_SECRET"
```

Every 30 minutes:

```txt
curl -X POST "https://api.yourdomain.com/jobs/generate-drafts?key=JOB_SECRET" -H "Content-Type: application/json" -d "{\"limit\":50}"
```

Manual/import only:

```txt
curl -X POST "https://api.yourdomain.com/jobs/import-mail-list?key=JOB_SECRET" -H "Content-Type: application/json" -d "{}"
```

## Admin CRM

Open:

```txt
https://api.yourdomain.com/admin
```

The admin page supports:

- Summary metrics
- Buyer leads
- Pending drafts
- Approve only
- Reject
- Approve + send
- Campaign creation

With `EMAIL_DRY_RUN=true`, approve + send does not send; it only verifies the flow.

## Safety Rules

- Imported leads with no valid-format email are not ready for drafts.
- Contacts with forms/portals only remain manual review.
- Suppressed, bounced, invalid, or unsubscribed contacts are blocked.
- Drafts start as `pending_approval`.
- Email sending requires an explicit admin action.
- OpenAI is optional and must not send messages directly.
