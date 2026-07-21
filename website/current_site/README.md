# The Vanilla Republic Website

React/Vite landing page for The Vanilla Republic.

## Stack

- React
- Vite
- Material UI
- Framer Motion
- Lucide React

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the sample request endpoint in `.env.local`:

```text
VITE_SAMPLE_REQUEST_ENDPOINT=http://localhost:3009/webhooks/sample-request
```

If the variable is missing, the form logs the payload in development and shows a friendly local-capture message. It does not send email.

## Build

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

## Hostinger Deployment

This is a static React/Vite build. Hostinger should receive the contents of `dist`, not the project source.

Steps:

1. Confirm `.env.local` or the build environment has `VITE_SAMPLE_REQUEST_ENDPOINT` set to the public sample-request endpoint.
2. Run `npm install`.
3. Run `npm run build`.
4. Open `dist`.
5. Upload the contents of `dist` into the Hostinger site root, usually `public_html`.
6. Confirm `index.html`, `assets/`, `logo.png`, `icono.png`, and any static files are present in `public_html`.
7. If Hostinger serves this as a single-page app with future routes, add a rewrite to serve `index.html` for unknown routes. The current landing page uses anchor sections and does not require route rewrites.
8. Test the live form with a controlled test inquiry before publishing the URL broadly.

## Manual QA

- Hero displays the brand, positioning, proof wording, and CTAs.
- Trust bar appears on desktop and mobile.
- Buyer segment cards wrap cleanly on mobile.
- Buyer inquiry form includes every required field.
- Form shows validation for required fields.
- Form posts to `VITE_SAMPLE_REQUEST_ENDPOINT` when configured.
- If the endpoint is missing in development, the payload is logged and the user sees a friendly message.
- No automatic outbound email is sent by the website.
- No risky unsupported claims are visible.
- Run `npm run build` before deployment.
