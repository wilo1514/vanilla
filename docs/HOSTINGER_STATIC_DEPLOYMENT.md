# Hostinger Static Deployment

Future procedure only. Do not deploy until the owner explicitly approves.

## Prepare Environment

Create `website/current_site/.env.production` from:

```text
website/current_site/.env.production.hostinger-static.example
```

Expected mode:

```text
VITE_FORM_MODE=hostinger_static_php
```

## Build

From the project root:

```powershell
.\scripts\build-website-hostinger.ps1
```

Or manually:

```powershell
cd website/current_site
npm install
npm run build
```

## Upload

Upload the contents of:

```text
website/current_site/dist
```

to Hostinger:

```text
public_html
```

Upload only the built files. Do not upload:
- `.env` files
- source files
- `node_modules`
- scripts
- local docs

## QA After Upload

- Open the homepage.
- Confirm the hero and buyer sections render.
- Submit a controlled test inquiry.
- Confirm no automatic email is sent.
- Confirm the form endpoint receives the request or returns a clear error.
