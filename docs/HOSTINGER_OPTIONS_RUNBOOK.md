# Hostinger Options Runbook

Nothing has been uploaded to Hostinger yet. This document prepares two future options.

## Option A: Static React/Vite Landing

Use this when the landing page is static and the form posts to an external or PHP-compatible endpoint.

Best for:
- Simple public landing page.
- Fast deployment.
- Low operational maintenance.

Build source:

```text
website/current_site
```

Output:

```text
website/current_site/dist
```

Upload target:

```text
Hostinger public_html
```

Use environment example:

```text
website/current_site/.env.production.hostinger-static.example
```

## Option B: Hostinger Node.js Web App

Use this if Hostinger Cloud Startup will host a Node.js app for either the landing or the automation API.

Best for:
- Server-side API endpoints.
- A Node-hosted form endpoint.
- Future authenticated buyer/admin tools.

Use environment example:

```text
website/current_site/.env.production.hostinger-node.example
```

For the automation API, keep these guardrails:
- No AI runtime calls.
- No Apollo, Hunter, or ZeroBounce.
- No email sending until a human-approved sender workflow exists.
- Keep drafts as `pending_approval`.

## n8n Status

n8n stays local for now. Later it may move to a VPS or public virtual machine.

Do not deploy n8n to Hostinger static hosting.
