# Future VPS Migration

Future procedure only. n8n stays local for now.

## Possible Future Target

A VPS or public virtual machine may later host:
- n8n
- PostgreSQL
- automation API
- reverse proxy / TLS

## Website VPS Environment

For a future public n8n or automation endpoint, create `website/current_site/.env.production` from:

```text
website/current_site/.env.production.vps.example
```

Expected mode:

```text
VITE_FORM_MODE=vps_n8n
```

## Migration Checklist

- Provision VPS.
- Configure firewall.
- Configure TLS.
- Move n8n credentials securely.
- Move PostgreSQL data using a backup/restore plan.
- Set production environment variables without printing secrets.
- Configure backups.
- Test `/health`.
- Test sample request webhook.
- Confirm no automatic outbound email sending.
- Confirm suppression rules remain active.

## Guardrails

n8n should orchestrate calls to the automation API only. Business logic belongs in code under `automation/src/rules`.
