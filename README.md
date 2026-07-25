# Melucci Enterprises — Website

Rebuild of the Melucci Enterprises site: Next.js (App Router) + TypeScript + Tailwind CSS,
deployed to Vercel. Static-first single-page narrative plus a Privacy page.

## Install

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

Copy `.env.example` to `.env.local` and fill in values (none required yet — the
inquiry-form backend lands in a later round). Never commit `.env*` files.

## Test

```bash
npm run test:e2e   # Playwright smoke tests (builds and serves the app on port 3100)
```

## Structure

- `app/` — App Router pages (`/`, `/privacy`) and root layout
- `components/` — shared UI (Header, Footer)
- `content/site.ts` — single source of truth for firm name, nav, and copy
- `lib/` — shared utilities (empty for now)
- `public/` — static assets
- `e2e/` — Playwright tests
- `ORCHESTRATION.md` — Cowork ⇄ Claude Code handoff protocol and task log
