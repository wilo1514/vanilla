# Local Docker Runbook

This project is currently local-first. Nothing is uploaded to Hostinger from this runbook.

## Services

- `postgres`: PostgreSQL 16 Alpine, exposed on `localhost:5434`.
- `automation-api`: Node 20 Alpine, mounted from `../automation`, exposed on `localhost:3009`.
- `n8n`: official n8n image, exposed on `localhost:5678`.

Runtime guardrails:
- No AI runtime calls.
- No Apollo.
- No Hunter.
- No ZeroBounce.
- No automatic outbound sending.
- No social auto-publishing.
- n8n orchestrates HTTP calls to the automation API; business logic stays in code.

## First Run

From the project root:

```powershell
.\scripts\start-local.ps1
```

If `n8n-local/.env` is missing, the script copies `n8n-local/.env.example` and warns you to edit local passwords and keys. It does not overwrite an existing `.env`.

## Stop

```powershell
.\scripts\stop-local.ps1
```

## Restart

```powershell
.\scripts\restart-local.ps1
```

## Logs

```powershell
.\scripts\logs-local.ps1
```

## Health Check

```powershell
.\scripts\healthcheck-local.ps1
```

Expected URLs:

- n8n: `http://localhost:5678`
- automation API: `http://localhost:3009/health`

## Import and Draft Flow

After the stack is running:

```powershell
cd n8n-local
docker compose exec automation-api npm run import:mail-list
docker compose exec automation-api npm run drafts:generate
docker compose exec automation-api npm run drafts:export
```

Expected behavior:
- XLSX files are read from `/mail-list`.
- Import report is written by the automation API.
- Drafts are created only as `pending_approval`.
- Form-only and supplier-portal-only contacts are marked `needs_manual_review`.
- Invalid, unsubscribed, and bounced contacts are blocked.
- No email is sent.

## Local Website

In another terminal:

```powershell
cd website/current_site
npm install
npm run dev
```

Use `website/current_site/.env.example` for local form settings.

## Troubleshooting

If Docker commands fail with a Docker engine pipe error, start Docker Desktop and wait until it reports that the engine is running.

If the API health check fails, inspect logs:

```powershell
.\scripts\logs-local.ps1
```
