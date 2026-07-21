# n8n Local

Local Docker setup for n8n, PostgreSQL, and The Vanilla Republic deterministic automation API.

Guardrails:
- n8n orchestrates the automation API only.
- n8n must not contain business logic.
- No AI nodes.
- No Apollo, Hunter, or ZeroBounce.
- No automatic outbound sending.
- Email output remains draft-only and `pending_approval`.
- Do not commit `.env`, n8n runtime data, or secrets.

## Services

- `postgres`: shared local PostgreSQL database on host port `5434`.
- `automation-api`: Node/TypeScript API mounted from `../automation` and exposed on host port `3009`.
- `n8n`: local n8n exposed on host port `5678`.

The automation API uses PostgreSQL through the Docker network URL:

```text
postgres://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/POSTGRES_DB
```

n8n should call the automation API through:

```text
http://automation-api:3009
```

## Setup

Recommended startup from the project root:

```powershell
.\scripts\start-local.ps1
```

The script checks Docker, creates `n8n-local/.env` from `.env.example` only if missing, starts Docker Compose, runs a health check, and prints local URLs.

Manual setup:

Create a local `.env` from `.env.example` if one does not already exist:

```bash
cd n8n-local
cp .env.example .env
```

Do not overwrite an existing `.env`.

Start the stack:

```bash
docker compose up -d
```

Open n8n:

```text
http://localhost:5678
```

Automation API:

```text
http://localhost:3009/health
```

More detail:

- `docs/LOCAL_DOCKER_RUNBOOK.md`
- `docs/HOSTINGER_OPTIONS_RUNBOOK.md`
- `docs/FUTURE_VPS_MIGRATION.md`

## Local Files

- `/files/input` maps to `n8n-local/local-files/input`
- `/files/output` maps to `n8n-local/local-files/output`

Use `local-files/input` for manual CSV/XLSX inputs that n8n needs to pass through. Use `local-files/output` for exported pending approval CSVs.

## Workflow 1: Buyer XLSX/CSV Import

Purpose: trigger deterministic import of buyer account/contact data.

n8n nodes:
- Manual Trigger
- Preflight health check
- API/database ready decision
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/contacts/import`
- Imported rows decision
- Import report summary
- Route outcome switch:
  - `ready_for_draft`
  - `needs_manual_review`
  - `do_not_contact`
- Lead priority recalculation
- Draft generation, still pending approval only
- Pending queue read

Recommended body:

```json
{}
```

Rules:
- Do not parse buyer scoring in n8n.
- Do not enrich contacts in n8n.
- Do not call Apollo, Hunter, ZeroBounce, or AI nodes.
- Let the automation API read `/mail-list` and write the import report.

## Workflow 2: Generate Outreach Drafts

Purpose: create email drafts only.

n8n nodes:
- Manual Trigger
- Preflight health check
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/drafts/generate`
- New drafts created decision
- Skipped/duplicate decision
- Pending approval queue read

Recommended body:

```json
{
  "limit": 500
}
```

Rules:
- Drafts must remain `pending_approval`.
- Do not add SMTP, Gmail, Outlook, SendGrid, Mailgun, or other sending nodes.
- Do not rewrite copy in n8n.

## Workflow 3: Export Pending Approval

Purpose: prepare human-review CSV output.

n8n nodes:
- Manual Trigger
- HTTP Request: `GET {{ $env.AUTOMATION_API_URL }}/drafts/pending`
- Pending drafts exist decision
- Human review routing switch:
  - standard review
  - claim guard review
  - no pending drafts

For file export, run from the host:

```bash
cd automation
npm run drafts:export
```

Output goes to `n8n-local/local-files/output` when the Docker `EXPORT_DIR=/files/output` setting is used.

Rules:
- Export is for human review only.
- Approval does not send emails.

## Workflow 4: Sample Request Webhook

Purpose: accept sample request data and create a review task.

n8n nodes:
- Webhook Trigger
- Consent decision
- Email format decision
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/webhooks/sample-request`
- Lead saved decision
- Webhook response:
  - received
  - validation error
  - API error

Pass through fields such as:

```json
{
  "first_name": "Buyer",
  "last_name": "Name",
  "company": "Example Buyer",
  "buyer_segment": "Specialty Distributors",
  "email": "buyer@example.com",
  "phone": "+1 555 0100",
  "consent_to_contact": true
}
```

Rules:
- Create internal tasks only.
- Do not send automated confirmation emails unless a human-approved process is added later.

## Workflow 5: Unsubscribe Handler

Purpose: suppress contacts that request removal.

n8n nodes:
- Webhook Trigger or manual form entry
- Email format decision
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/suppression/unsubscribe`
- Webhook response:
  - suppressed
  - invalid email

Body:

```json
{
  "email": "buyer@example.com",
  "source": "n8n"
}
```

Rules:
- Suppression is deterministic.
- Suppressed contacts become `do_not_contact`.

## Workflow 6: Bounce Import

Purpose: mark bounced addresses as suppressed.

n8n nodes:
- Manual Trigger
- Paste/test bounce email set node
- Email format decision
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/suppression/bounce`
- Suppression confirmation
- Invalid bounce record branch

Body:

```json
{
  "email": "buyer@example.com",
  "source": "bounce_import"
}
```

Rules:
- Do not perform deliverability verification.
- Do not use ZeroBounce or similar services.
- Bounced contacts become `do_not_contact`.

## Workflow 7: Manual Test Email Draft

Purpose: test the local email ecosystem without sending an email.

n8n nodes:
- Manual Trigger
- Test recipient settings:
  - recipient: your controlled test inbox
  - reply-to: your controlled reply inbox
- Email format decision
- HTTP Request: `POST {{ $env.AUTOMATION_API_URL }}/drafts/test-email`
- Draft created decision
- Pending approval queue read

Rules:
- This creates an `outreach_drafts` record only.
- Status remains `pending_approval`.
- `sent` must remain `0`.
- No SMTP, Gmail, Outlook, SendGrid, Mailgun, or other sending node is used.

## Rebuild and Reimport Workflows

Workflow JSON files are generated deterministically from:

```text
n8n-local/workflows/build-workflows.mjs
```

Rebuild local JSON:

```powershell
cd n8n-local\workflows
node .\build-workflows.mjs
```

Reimport into the running n8n container:

```powershell
cd n8n-local
docker compose exec n8n sh -lc 'for f in /workflows/*.json; do n8n import:workflow --input="$f"; done'
```

Verify imported workflow names:

```powershell
docker compose exec n8n n8n list:workflow
```

Expected workflows:

- `Buyer XLSX/CSV Import - Decision Tree`
- `Generate Outreach Drafts - Approval Gate`
- `Export Pending Approval - Review Queue`
- `Sample Request Webhook - Lead Intake`
- `Unsubscribe Handler - Suppression Tree`
- `Bounce Import - Suppression Tree`
- `Manual Test Email Draft - Approval Only`
