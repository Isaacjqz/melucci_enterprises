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
STATUS: AWAITING_REVIEW
Last updated: 2026-07-25
Updated by: Claude Code
Current round: 2.1 (brand apply — vectorized monogram, icons, hero fixes, pushed)
```

---

## 4. Current Task  *(Cowork Claude → Claude Code)*

**Task ID:** T2 — Prospectus design system + full single-page build + Private Inquiry form

**Reference docs (read first):** `DESIGN_SYSTEM.md` (Prospectus), `CONTENT.md` (real copy), §2a/§2b.

**Objective:** Implement the "Prospectus" design system and build the complete single-page Melucci
Enterprises site + `/privacy` + a secure Resend inquiry form, using the firm's real copy verbatim.

**Details / acceptance criteria:**
1. **Design system (per `DESIGN_SYSTEM.md`):** Fraunces (serif display) + Inter (sans) via `next/font`.
   Tailwind theme tokens: paper `#F4F1E9`, paper-alt `#EFEBE0`, ink `#191B1E`, ink-muted `#5C5647`,
   brass `#B08D57` (**decorative/large only**), brass-ink `#7A5A2B` (**small text/labels/links** — AA),
   hairline `#D9D2C0`, ink-panel `#14140F`. Verify WCAG AA for every text/bg pair. Reusable components:
   `Container`, `Masthead`/header, `Eyebrow`, `SectionHeading` (serif), `HairlineRule`, `Monogram`,
   `TextLink` (brass-ink + →), `Footer`.
2. **Monogram:** refined serif "M" in brass as a placeholder (real file coming) — centralize in one
   `Monogram` component so it's swappable in one place later.
3. **Single-page site** (all sections per `DESIGN_SYSTEM.md` §4 / `CONTENT.md`): masthead/hero →
   principal-level engagement + the bridge → mandates → about → approach & reputation → services (3) →
   the ONE inverted **Confidential Engagement** band (`ink-panel`, ivory text) → **Private Inquiry**
   form (`#contact`) → footer. Plus a styled `/privacy` page.
4. **Private Inquiry form (SECURITY-CRITICAL, §2a):** fields First name, Last name, Email (required),
   Phone (optional), Message (required) + a short confidentiality note. React Hook Form (client) +
   **server-side Zod** validation/sanitization. POST to `app/api/inquiry/route.ts` → **Resend** using
   `RESEND_API_KEY` from env (`.env.example` placeholder only). Honeypot + server-side rate limiting;
   **no PII logging**; POST-only, no open CORS; accessible success/error states.
5. **Motion/responsive:** subtle reveal-on-scroll honoring `prefers-reduced-motion`; fully responsive
   mobile→desktop; WCAG 2.1 AA (contrast, focus, semantic HTML, keyboard nav).
6. **Security:** keep headers intact; tighten CSP toward nonce-based if feasible (note tradeoffs).
7. **Testing (§2b):** Playwright E2E — page renders all sections; `/privacy` renders; inquiry form happy
   path (Resend **stubbed**) + invalid + honeypot; no secrets/PII in rendered HTML; links/anchors work.
   Unit-test the Zod schema. Build + lint + full suite green (report counts). `npm audit` reported.
8. Commit locally. **Do NOT push yet** — private repo URL still pending (push next round).

**Out of scope:** SEO polish (sitemap/robots/schema — later), deployment, domain/DNS.

**How to verify:** build + lint clean; site matches the Prospectus spec on mobile + desktop; form
validates client + server (Resend stubbed), honeypot + rate limit active, no PII logged, no secret
committed; Playwright + unit tests pass; `npm audit` reported; local commit made.

---

## 5. Claude Code Report  *(Claude Code → Cowork Claude)*

### Brand-apply Report (round 2.1) — 2026-07-25

**Summary:** Cowork's review edits (vectorized monogram + CSS-mask `Monogram`, Reveal in-view-on-mount
fix, hero refinements) verified, icon set generated, everything committed and pushed. All four working-tree
changes kept as-is — no visual changes altered.

**Favicon approach:** generated from `public/brand/monogram-ink.png` composited on an ivory `paper`
(#F4F1E9) ground with sharp (already in node_modules via Next). App Router file conventions:
`app/favicon.ico` (16/32/48, PNG-encoded ICO entries assembled by script), `app/icon.png` (512×512),
`app/apple-icon.png` (180×180, solid ground as iOS requires). Next auto-wires the `<link>` tags; `/icon.png`
and `/apple-icon.png` appear as static routes in the build. Generator script kept in session scratchpad
(one-off; can be committed to `scripts/` later if re-generation is expected).

**Test fix (only change beyond icons):** `e2e/site.spec.ts` asserted the removed hero masthead line
(`MELUCCI ENTERPRISES · EST. NEW YORK`) — replaced with an assertion that the hero monogram
(`role="img"`, name "Melucci Enterprises") is visible. No other test touched. Note: `site.masthead` in
`content/site.ts` is now unused by any page — left in place for Cowork to decide (it's still the
masthead's aria/wordmark source of truth candidate).

**Files:** Committed Cowork's: `public/brand/{monogram.svg,monogram-{brass,ink,ivory,white}.png}`,
`components/{Monogram,Reveal}.tsx`, `app/page.tsx`, `DESIGN_SYSTEM.md`. New (CC): `app/icon.png`,
`app/apple-icon.png`, `app/favicon.ico` (replaced scaffold favicon), `e2e/site.spec.ts` (one assertion).

**Verify:** `npm run build` clean (icons appear as `○ /icon.png`, `○ /apple-icon.png`) · `npm run lint`
clean · **Vitest 9/9** · **Playwright 15/15** (one failure found and fixed: the stale masthead assertion;
suite green after) — total 24/24. Hero visually re-verified on the production build at 1280px: brass
monogram renders crisply via CSS mask in masthead + hero. `npm audit`: **12 high — identical transitive
set as T1/T2, unchanged**; brand assets and icons added no dependencies.

**Commit/push:** `[COMMIT_HASH]` "brand: vectorized MD monogram + hero refinements + reveal fix + icons"
pushed to origin/main (https://github.com/Isaacjqz/melucci_enterprises, private). Local == remote head.

**Blockers:** none.

**Status set to:** AWAITING_REVIEW

---

### T2 Report — 2026-07-25

**Summary:** Prospectus design system + full single-page site + secure inquiry form shipped. Fraunces
(400/500 + italic) and Inter via `next/font`; all 10 palette tokens as Tailwind v4 `@theme` colors.
**WCAG AA verified by computed contrast ratios:** ink/paper 15.29 · ink/paper-alt 14.49 · ink-muted/paper
6.47 · ink-muted/paper-alt 6.13 · brass-ink/paper 5.60 · brass-ink/paper-alt 5.30 · paper-on-dark/ink-panel
15.25 — all pass (≥4.5). brass/paper is 2.74 and used decoratively only; note brass on ink-panel is 5.98,
so brass eyebrow text is AA-legal on the dark band. All nine sections built in order per DESIGN_SYSTEM §4
with CONTENT.md copy verbatim, Roman-numeral eyebrows (I–VII), one inverted `ink-panel` band, styled
attorney-style `/privacy` (8 sections, no fabricated legal claims). Reveal-on-scroll via
IntersectionObserver — disabled entirely under `prefers-reduced-motion` (CSS), `<noscript>` fallback keeps
content visible. Verified visually at 1280px and 375px (screenshots reviewed). Copy check: hero, principal,
bridge, mandates (6), about, approach, reputation, services (3), confidential band all render CONTENT.md
text exactly (E2E-asserted).

**Form/API (§2a):** React Hook Form + shared Zod schema (`lib/inquiry.ts`) used on BOTH client and server
— server authoritative. `app/api/inquiry/route.ts`: POST-only (GET → 405, E2E-asserted), no CORS headers
(same-origin enforced by browsers), sliding-window rate limit 5/10min per IP (in-memory —
serverless-cold-start caveat noted in code), honeypot field silently accepted-and-dropped, control chars
stripped + trim + length caps on all fields, validation errors never echo submitted values, no PII logged
(status-code-only error logs), Resend called server-side via fetch with `RESEND_API_KEY`/`INQUIRY_TO_EMAIL`/
`INQUIRY_FROM_EMAIL` env (503 if unconfigured; placeholders in `.env.example`). E2E stubbing via explicit
`INQUIRY_TEST_MODE=1` set only by the Playwright web server. **Note:** `@hookform/resolvers` was skipped —
broken transitive peer dep (valibot) at install — replaced with a 15-line custom Zod resolver in
`InquiryForm.tsx`; one less dependency.

**CSP:** kept `'unsafe-inline'` script-src rather than nonces — nonce-based CSP requires per-request
dynamic rendering (middleware), which would forfeit full static prerendering of the page; revisit if the
site ever goes dynamic. `'unsafe-eval'` remains dev-only.

**Files:** New: `components/{Container,Eyebrow,SectionHeading,HairlineRule,Monogram,TextLink,Masthead,Reveal,InquiryForm}.tsx`,
`lib/{inquiry.ts,inquiry.test.ts,rate-limit.ts}`, `app/api/inquiry/route.ts`, `vitest.config.ts`,
`e2e/{site,inquiry}.spec.ts`, `CONTENT.md`, `DESIGN_SYSTEM.md` (committed as received). Modified:
`content/site.ts` (all copy), `app/{layout,page,privacy/page}.tsx`, `app/globals.css` (tokens, focus
states, reveal CSS), `components/Footer.tsx`, `e2e/smoke.spec.ts`, `playwright.config.ts` (test-mode env),
`package.json` (+`test` script; +react-hook-form, zod, vitest), `.env.example`. Deleted:
`components/Header.tsx` (superseded by `Masthead`).

**Verify/Tests:** `npm run build` clean (`/`+`/privacy` static, `/api/inquiry` dynamic) · `npm run lint`
clean · **Vitest 9/9 passed** (schema: valid/optional-phone/sanitization/required/email/phone/length/
honeypot) · **Playwright 15/15 passed** (smoke 4: routes, headers, layout; site 6: all-sections copy,
anchor→form, single inverted band, no-secrets-in-HTML, mobile; inquiry 5: happy path incl. stubbed
delivery flag, client validation, server-side invalid email w/ no value echo, honeypot silent drop,
rate-limit 429, GET 405). Total 24/24.

**Security/audit:** `npm audit`: **12 high, 0 critical — identical set to T1, unchanged** (all transitive:
ESLint chain dev-only; postcss/sharp bundled inside next@16.2.11 — still latest; awaiting upstream). New
deps (zod 4.4.3, react-hook-form 7.83.0, vitest 4.1.10) introduced no vulnerabilities. Secret-pattern scan
of the committed tree: clean. `.env*` untracked.

**Blockers:** none. Ready for review; push awaits the private repo URL (next round).

**Status set to:** AWAITING_REVIEW

---

### T1 Report — 2026-07-25

**Summary:** Scaffolded Next.js 16.2.11 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 + ESLint 9
in this folder. Routes `/` and `/privacy` render placeholder `<h1>` + one line, pulling all copy from
`content/site.ts` (single source of truth: firm name, monogram placeholder, nav, inquiries link, page copy).
Shared root layout with minimal Header ("M" monogram placeholder box + "Melucci Enterprises" wordmark) and
Footer (firm name, "Private inquiries" → `/#contact`, current-year copyright). Neutral theme via Geist
(`next/font`). Security headers wired in `next.config.ts`. Playwright smoke suite in place. One local git
commit (`95f68de`), no remote configured. Note: create-next-app generated `AGENTS.md`/`CLAUDE.md`
(Next 16 agent guidance) — kept, since Next 16 has breaking changes vs. older docs.

**Files:** `app/layout.tsx`, `app/page.tsx`, `app/privacy/page.tsx`, `app/globals.css`,
`components/Header.tsx`, `components/Footer.tsx`, `content/site.ts`, `lib/` (empty, `.gitkeep`),
`public/` (template SVGs removed), `next.config.ts`, `.env.example`, `.gitignore` (env/build/Playwright
artifacts), `playwright.config.ts`, `e2e/smoke.spec.ts`, `package.json` (name + `test:e2e` script),
`README.md` — plus generated scaffold files (`tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`,
`AGENTS.md`, `CLAUDE.md`, `package-lock.json`).

**Verify:** `npm run build` clean (all routes static). `npm run dev` clean — `/` and `/privacy` both
return 200. `npm run lint` clean. No secrets in the committed tree (pattern grep over HEAD). `.env*`
gitignored; only `.env.example` (placeholders) committed. Exactly one commit; no remote push.

**Security:** Headers set globally: CSP (default-src 'self'; script-src allows 'unsafe-inline' for
Next's bootstrap — tighten to nonces when the form round lands; 'unsafe-eval' dev-only), HSTS (2y,
includeSubDomains, preload), X-Content-Type-Options, X-Frame-Options DENY + frame-ancestors 'none',
Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/payment denied),
`poweredByHeader: false`. **npm audit: 12 high, 0 critical/moderate/low — all transitive, none with a
non-breaking fix** (we are on latest Next): (1) brace-expansion/minimatch DoS via the ESLint toolchain —
dev-only, not shipped to production; (2) postcss + sharp CVEs bundled inside next@16.2.11 itself —
requires an upstream Next patch release; re-check `npm audit` next round.

**Tests:** Playwright (chromium) — 4/4 passed: `/` 200 + `<h1>`, `/privacy` 200 + `<h1>`, security
headers present on responses, header wordmark + footer inquiries link visible. Suite runs against a
production build (`npm run test:e2e`, port 3100). Vitest not yet added — no unit-testable logic exists
yet; will add with the validation code in the form round.

**Blockers:** none.

**Status set to:** AWAITING_REVIEW

---

## 6. Review & Decisions  *(Cowork Claude records human's approval/feedback)*

- **Brand:** distinct "quiet luxury" identity (not shared with the law firm). Design direction pending pick.
- Stack/host/workflow: identical to the Melucci Firm build.

**Round 1 / T1 — APPROVED (2026-07-25).** Verified: `/` + `/privacy` routes, security headers, Playwright
4/4, one local commit `95f68de`, no remote. `npm audit` 12 high (all transitive/dev-only or bundled in
latest Next) — accepted, re-check on Next patch. Carry-forward: nonce-based CSP when the form lands.
Next round (T2) needs: chosen design direction, the "M" monogram file, and a private GitHub repo URL.

**Design direction CHOSEN (2026-07-25): "Prospectus"** — ivory stationery, ink serif (Fraunces), brass
accents, hairline rules, editorial memorandum feel. Full spec in `DESIGN_SYSTEM.md`; copy in `CONTENT.md`.
Monogram + repo still pending (T2 uses a serif-"M" placeholder and commits locally; push next round).

**Repo connected + pushed (2026-07-25):** https://github.com/Isaacjqz/melucci_enterprises (private).
Commits `95f68de` (T1) + `0055f87` (T2) on `main`, in sync with origin, no secrets in tree. T2 build is
AWAITING visual review. Still pending: the "M" monogram file (to replace the placeholder).

**Cowork direct edits during review (2026-07-25) — to be committed:**
- **Monogram wired in + VECTORIZED.** Cleaned the client's `MD_logo_fullframe.png` (removed skyline,
  solidified strokes) and traced it to a smooth SVG at `public/brand/monogram.svg` (+ PNG variants
  brass/ink/white/ivory). `components/Monogram.tsx` now renders the SVG via CSS mask (recolors to
  brass/ink/paper, crisp at any zoom).
- **Reveal fix** (`components/Reveal.tsx`): reveal elements already in view on mount, so the
  above-the-fold hero is no longer stuck hidden.
- **Hero layout** (`app/page.tsx`): removed the masthead eyebrow line; monogram centered, enlarged,
  raised (less top padding).
These are uncommitted. Task for CC: verify (build/lint/tests), generate favicon/app icons from the
monogram, then commit + push all to origin/main.

---

## 7. History Log  *(append-only — completed rounds)*

### Round 1 — T1 Project Scaffold — COMPLETED & APPROVED (2026-07-25)
Next.js 16 (App Router) + TS + Tailwind v4 + ESLint. Routes `/` + `/privacy`; minimal Header/Footer;
`content/site.ts` single source of truth; security headers; Playwright smoke 4/4; README. One local
commit `95f68de`, no remote push. Carry-forward: nonce CSP later; npm audit re-check on Next patch.
