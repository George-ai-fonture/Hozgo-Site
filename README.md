# HOZGO marketing site

Vite, React 18, TypeScript and Tailwind. Black, white and gunmetal grey only, Montserrat type, matching the HOZGO app.

## Run locally

```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check then build to dist/
npm start          # serve dist/ with server.js (PORT, default 3000)
npm run lint       # type-check only
```

## Environment variables

Copy `.env.example` to `.env.local`. All are optional and are baked in at build time.

| Variable | Purpose |
| --- | --- |
| `VITE_APP_URL` | Base URL of the HOZGO web app. Defaults to `https://hozgo.co.uk`. |
| `VITE_SUPABASE_URL` | Supabase project URL, if forms write directly to Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key. Never use a service role key. |
| `VITE_LEAD_ENDPOINT` | Optional HTTPS endpoint that receives leads as a JSON POST. |

## Deploy on Railway

- Build command: `npm install && npm run build`
- Start command: `npm start` (runs `node server.js`, zero dependencies, listens on `PORT`)
- Set any `VITE_*` variables in Railway before the build runs.
- `.railwayignore` keeps private notes and `legacy/` out of the upload.

`server.js` serves `dist/`, caches hashed `/assets/` files for a year, sends `no-cache` for HTML, and falls back to `index.html` for client-side routes.

## Layout

```
src/
  components/layout/   header, footer, store badges, container, section, page meta
  components/ui/       shadcn-style primitives
  lib/                 utils (cn) and site constants
  pages/               one file per route
public/
  brand/               logos, favicons, OG image
  photos/              HOZGO Facebook photos
legacy/                previous hand-written HTML site and screenshots (not deployed)
assets/                previous site assets (kept for reference)
server.js              static server for dist/
```

Private notes (`CLAUDE.md`, `offer.md`, `ideal-customer.md`) are tracked but never served.
