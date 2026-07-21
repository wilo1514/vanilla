# Hostinger Node App Deployment

Future procedure only. Do not deploy until the owner explicitly approves.

Hostinger Cloud Startup can support Node.js Web Apps. This path may be used for the landing page, the automation API, or a small form endpoint.

## Candidate Apps

Landing as Node app:
- Possible, but static deployment is simpler.

Automation API as Node app:
- Useful if the sample request endpoint needs to be public.
- Requires PostgreSQL access and carefully managed environment variables.

## Environment

For website builds targeting a Hostinger Node endpoint, create `website/current_site/.env.production` from:

```text
website/current_site/.env.production.hostinger-node.example
```

Expected mode:

```text
VITE_FORM_MODE=hostinger_node
```

## Automation API Notes

The automation API expects:

```text
DATABASE_URL
PORT
MAIL_LIST_DIR
EXPORT_DIR
PHYSICAL_MAILING_ADDRESS
```

Do not commit or print production `.env` values.

## Startup

Hostinger Node app startup should run the compiled API:

```bash
npm install
npm run build
npm run db:init
npm start
```

Confirm Hostinger can run the database init step safely before using this in production.

## Guardrails

- No OpenAI runtime calls.
- No Apollo.
- No Hunter.
- No ZeroBounce.
- No automatic email sending.
- Drafts remain `pending_approval`.
- n8n remains local until a later VPS migration decision.
