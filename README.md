# Tikves Ticket Claim Portal

Standalone Angular 16 website for invited guests who need to claim Tikves tickets from an email without installing the mobile app.

## Local development

```bash
npm install
npm start
```

The app expects the Tikves backend to expose:

- `POST /api/v1.0/tikves/public/ticket-claim/start`
- `POST /api/v1.0/tikves/public/ticket-claim/verify`
- `GET /api/v1.0/tikves/auth/user`
- `GET /api/v1.0/tikves/data/http/attendances`

## Runtime API base URL

The portal reads the API base URL from `window.__tikvesClaimApiBaseUrl__`.

Edit `src/assets/runtime-config.js` for local testing, or replace the built `assets/runtime-config.js` file on the server:

```js
window.__tikvesClaimApiBaseUrl__ = 'https://api.your-domain.com';
```

Leave it empty only if the website and API are served from the same origin.

## Production build

```bash
npm run build
```

The production output is written to:

```text
dist/tikves-ticket-claim-portal
```

## Backend deploy notes

For the invite-email CTA and cross-origin access, the backend should be configured with:

- `PUBLIC_CLAIM_PORTAL_URL=https://claim.your-domain.com`
- `CORS_ORIGINS=https://dashboard.qwertydemo.com,https://claim.your-domain.com`
