# ORCHESTRATION.md — Cowork ⇄ Claude Code Handoff File (Melucci Enterprises)

> Single source of truth and communication channel between **Cowork Claude** (planner/relay, talks to
> Isaac) and **Claude Code** (executor, writes code). Each party writes ONLY to its designated sections.

---

## 0. Protocol Rules (read first)

**Roles**
- **Cowork Claude** — writes work orders into *§4 Current Task*, sets `STATUS: NEEDS_CC_ACTION`. Reads
  *§5* after Claude Code finishes and relays to the human. Records decisions in *§6*, archives to *§7*.
- **Claude Code** — when `STATUS: NEEDS_CC_ACTION`, reads *§4*, does the work, fills in *§5*, sets
  `STATUS: AWAITING_REVIEW`. Writes only to §3 (status) and §5.

**Status values:** `NEEDS_CC_ACTION` · `CC_IN_PROGRESS` · `AWAITING_REVIEW` · `APPROVED` · `BLOCKED`.

**Rules:** one party acts at a time (per STATUS); write only to your own sections; update `Last updated`
/`Updated by`; if ambiguous, set `BLOCKED` and ask in §5 rather than guessing.

---

## 1. Project Context

**Project:** Rebuild the Melucci Enterprises website (currently a slow Wix site at
https://www.meluccienterprises.com).
**What it is:** a private intermediation firm — facilitates private, off-market, high-value transactions
(real assets/infrastructure, energy, aviation, private capital, nation-scale developments, AI data centers)
at the principal level, with discretion and confidentiality.
**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS → Vercel. Static-first, single-page narrative
+ a Privacy page. Secure Resend "Private Inquiry" form.
**Brand:** DISTINCT from the Melucci Firm — "quiet luxury" (rarefied, minimal, editorial). Design
direction TBD (Obsidian / Cinematic / Prospectus). "M" monogram logo (to be supplied + cleaned).
**Content:** the existing site copy is excellent — reuse it; do NOT fabricate deals, stats, or claims.
**Full plan:** see `meluccienterprises-rebuild-plan.md`.

---

## 2. Working Agreements

- All code in this folder. Keep changes scoped to the §4 task. Note every file changed in §5.

### 2a. Security Standards (every task — non-negotiable)
- The Private Inquiry form collects sensitive PII. Treat all input as confidential.
- No secrets in client code/repo/commits — env vars only; `.env.example` with placeholders; `.env*` gitignored.
- Security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy,
  Permissions-Policy). HTTPS everywhere (host).
- Server-side validate + sanitize ALL form input (Zod). Never trust the client. Guard against injection/XSS.
- Do NOT log raw PII. No DB storage unless a task requires it. Honeypot + server-side rate limiting on the form.
- Locked-down API route (POST-only, no open CORS). Run `npm audit`; report vulns in §5.

### 2b. Testing Standards (every task — non-negotiable)
- **Playwright E2E required** for every feature/page. Cover: routes load (200, correct heading), the
  inquiry form happy + failure paths + honeypot (Resend stubbed), no secrets/PII in rendered HTML/bundle.
- Unit tests (Vitest) for validation/util logic. A task is NOT done unless build, lint, and the full test
  suite pass. Report exact counts in §5. Wire `npm run test` / `npm run test:e2e`.

---

## 3. Status

```
STATUS: CC_IN_PROGRESS
Last updated: 2026-07-25
Updated by: Claude Code
Current round: 1 (T1 — project scaffold)
```

---

## 4. Current Task  *(Cowork Claude → Claude Code)*

**Task ID:** T1 — Project Scaffold (design-agnostic foundation)

**Objective:** Stand up the Next.js foundation so later rounds can add the "quiet luxury" design + content.

**Details / acceptance criteria:**
1. Initialize **Next.js (App Router) + TypeScript + Tailwind CSS** in this folder (current stable Next.js). Include ESLint.
2. Routes (placeholder pages, each a clear `<h1>` + one line):
   - `/` (Home — single-page site)
   - `/privacy`
3. Shared **root layout**: a minimal **Header** (monogram placeholder + "Melucci Enterprises" wordmark) and a
   **Footer** (firm name, "Private inquiries" link to the inquiry section/contact, current-year copyright).
4. Folder structure: `components/`, `content/`, `lib/`, `public/`. A `content/site.ts` single-source-of-truth
   for firm name, nav, and copy scaffolding.
5. Tailwind + a neutral placeholder theme (a font via `next/font`). Final design comes in T2.
6. **Security baseline (§2a):** `.gitignore` (excludes `.env*`, node_modules, build); `.env.example`; security
   headers in `next.config`. Run `npm audit` and report.
7. **Testing (§2b):** install/configure **Playwright**; smoke E2E loading both routes (200 + `<h1>`). Wire
   `npm run test:e2e` into `package.json`.
8. `README.md` (install/run/test). Initialize a local git repo + one initial commit. **Do NOT push to a remote
   yet** — the private GitHub repo will be provided next round.

**Out of scope:** real design/content, the inquiry-form backend, SEO, deployment, domain/DNS.

**How to verify:** `npm run build` + `npm run dev` clean; both routes render; Playwright smoke passes;
`npm audit` reported; no secrets committed; one local commit made (no remote push).

---

## 5. Claude Code Report  *(Claude Code → Cowork Claude)*

_Empty — awaiting Claude Code's T1 report._

**Summary:** — · **Files:** — · **Verify:** — · **Security:** — · **Tests:** — · **Blockers:** — · **Status set to:** —

---

## 6. Review & Decisions  *(Cowork Claude records human's approval/feedback)*

- **Brand:** distinct "quiet luxury" identity (not shared with the law firm). Design direction pending pick.
- Stack/host/workflow: identical to the Melucci Firm build.

---

## 7. History Log  *(append-only — completed rounds)*

_No completed rounds yet._
