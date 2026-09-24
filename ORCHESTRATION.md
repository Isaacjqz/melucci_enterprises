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
Last updated: 2026-09-24
Updated by: Claude Code
Current round: 3.4 (T3.4 — add Rebin Mustafa to the Leadership section)
```

> **T3.4 (2026-09-24), supersedes T3.3 (completed, `4ccc81a`).** Add a sixth principal.
>
> **Change (Cowork direct edit, in working tree):**
> - `content/site.ts` — new entry appended to `principals.items`: **Rebin Mustafa, "Managing Partner"**,
>   three-paragraph bio, photo `/brand/principals/rebin-mustafa.jpg`. Placed LAST, after Kim Wells
>   (Isaac's call). Title confirmed as "Managing Partner" — Isaac initially wrote "project manager",
>   which contradicted the supplied bio; resolved with him directly.
> - `public/brand/principals/rebin-mustafa.jpg` — NEW (untracked). Cropped by Cowork from the supplied
>   `mustafa.rebin.jpg` (941×1672) to 632×790 (4:5) so framing matches the other five; verified in a
>   side-by-side card simulation. The original `mustafa.rebin.jpg` was deleted — it was an unused
>   duplicate that would otherwise be publicly served.
> - Bio text is verbatim from Isaac apart from restoring spaces in run-together words from the source
>   PDF ("throughhis" → "through his", "supportsbusiness" → "supports business", etc.). No meaning changed.
>
> **CRITICAL — selective commit, same as T3.3:** `components/HeroSignature.tsx` is STILL uncommitted
> (the true-artwork reveal-mask fix, T3.2 — preview-approved but deliberately held back). Do NOT commit
> it and do NOT discard it. Commit ONLY `content/site.ts`, the new jpg, and `ORCHESTRATION.md`.
>
> **Do:** build + lint + full suite. The principals E2E derives from `site.principals.items` (`.map(name)`
> and `.length`) so six people should pass unchanged — but the test TITLE still says "all five leaders";
> update that wording. Visual check at 1280px (grid should now be a clean 3+3 instead of 3+2) and 375px
> (1-col stack, Biography toggle tappable). Commit + push; confirm Vercel deploy green and Rebin live on
> www.meluccienterprises.com. Report hash + `git status` after (HeroSignature.tsx must still show modified).

> **T3.3 (2026-08-27), supersedes T3.2 for THIS round.** Isaac wants ONLY one change deployed now:
> `content/site.ts` — the line "Melucci Firm, P.C.: A partner with legal experience and office
> management duties." removed from Miosoty's bio array.
>
> **CRITICAL — selective commit:** `components/HeroSignature.tsx` also has uncommitted changes in the
> working tree (the true-artwork reveal-mask fix, T3.2 below — preview-approved on the dev server but
> Isaac is holding it back for now). Do NOT commit it. Do NOT discard it either — leave it exactly
> as-is in the working tree for a later round. Stage and commit ONLY `content/site.ts` (and
> `ORCHESTRATION.md` if desired).
>
> **Do:** verify the site.ts diff is exactly the one-line bio removal; build + lint + suite green
> (note: build output will include the uncommitted HeroSignature change — that's fine for validation,
> just keep the COMMIT scoped to site.ts); commit + push; confirm Vercel deploy green and the live
> Leadership section no longer shows the line. Report hash + `git status` after (HeroSignature.tsx
> must still show as modified).

> **T3.2 (2026-08-27) — ON HOLD, do not commit yet. Preview-approved on dev; Isaac deferring deploy.**
> Original task: Isaac flagged the animation's ink quality: pointy
> interior corners at the M's valleys and synthetic-looking stroke terminals — the procedural ribbon
> (centerline + pressure-model widths) only approximates the traced artwork.
>
> **Change (Cowork direct edit, in `components/HeroSignature.tsx`):** the visible ink is now the TRUE
> traced artwork (`/brand/monogram-ivory.svg`, same file as the thumbnail/site marks), drawn each
> frame and clipped with `destination-in` by the ribbon path inflated ×1.9 + 3px
> (`ribbonPath(L, forMask)`); the ribbon is demoted to a reveal mask. Artwork registered to the
> ribbon by bounding box (`ART_RECT` from EL/ER extents ↔ `ART_SRC` ink-bbox fractions measured from
> the PNG alpha; aspects agree within 0.2%). Artwork loads via `img.decode()` before play/static
> render; on load failure the old ribbon is the fallback. Timing/particles/quill untouched.
>
> **Do:** build + lint + full suite green (hero E2E asserts states — should hold; report counts).
> Visual verify at 1280px + 375px: play the full animation and check (a) mid-write the ink hugs the
> pen with no unrevealed slivers popping in late and no premature reveal of neighboring strokes at
> crossings (if the inflated mask leaks onto a crossing stroke, drop MASK_SCALE toward 1.5), (b) the
> finished frame's interior corners and stroke terminals are pixel-identical to the served monogram,
> (c) reduced-motion static render correct. Commit + push; confirm Vercel deploy green + live.

> **T3.1 (2026-08-27, COMPLETED + APPROVED — kept for context) — replaced the completed T3 below.** THE SITE IS LIVE at
> www.meluccienterprises.com (Vercel, GitHub auto-deploy on push to main; DNS cut over at GoDaddy;
> MX/Microsoft email untouched). Pushing = deploying now — nothing goes out without green tests.
>
> **Change (Cowork direct edit, in working tree):** `components/HeroSignature.tsx` — the signature
> composition sat optically low (worst on mobile). In `layout()`, MY now takes 40% of free space
> above / 60% below (was 50/50): `MY = Math.max(8, (SH - totalH) * 0.4 - markH * 0.02)`. The three
> pre-JS fallback `top` styles moved to match: rule 64%→61%, wordmark 67%→64%, tagline 74%→71%.
> All animation geometry derives from MY, so the quill path moves with it.
>
> **Also in this round (Cowork direct edits):** link-preview (Open Graph) image. New
> `app/opengraph-image.png` (1200×630, signature on the dark hero panel, rendered with the site's
> Cormorant) + `app/opengraph-image.alt.txt`; `app/layout.tsx` gained
> `metadataBase: new URL("https://www.meluccienterprises.com")` so the og:image URL resolves
> absolute. Verify the built HTML `<head>` contains og:image + twitter:image pointing at it.
>
> **Do:** build + lint + full suite (hero E2E may assert positions — update if so, report counts);
> visual check at 1280px AND 375px (composition should sit slightly above center, scroll cue clear
> of the tagline); commit + push to origin/main; confirm the Vercel deploy goes green and
> www.meluccienterprises.com serves it. Report commit hash.

---

## 4. Current Task  *(Cowork Claude → Claude Code)*

**Task ID:** T3 — Pre-launch: commit ALL pending working-tree changes, update tests, deploy-ready

**Objective:** The site deploys to Vercel next. Verify, commit, and push EVERYTHING pending in the
working tree (several rounds of Cowork direct edits, 2026-07-25 → 2026-08-26), updating the test suite
to match the current site. No new features.

**Pending changes to commit (working tree is the source of truth):**
1. **Monogram vectorization** (T2.2, still uncommitted): re-traced `public/brand/monogram.svg` (smooth
   curves, ~51KB), new per-color `monogram-{brass,ink,ivory}.svg`, `components/Monogram.tsx` renders
   them via `next/image unoptimized`.
2. **Hero signature animation** (new): `components/HeroSignature.tsx`, `lib/signature-mark.ts` +
   `lib/signature-mark.test.ts`, `e2e/hero.spec.ts`, `public/brand/quill.png`; `components/Masthead.tsx`
   deleted; `app/page.tsx` restructured (HeroSignature + intro section); e2e specs already edited.
3. **Principals section** (new): section V on the page; photos in `public/brand/principals/`;
   `content/site.ts` `principals` block. **Order: Miosoty (CEO) → Daniel Melucci (General Counsel) →
   Major General (Ret.) Paul E. Knapp (President) → Román Jáquez (COO) → Kim Wells, CPA (CFO).**
4. **Collapsible bios** (2026-08-26): new `components/PrincipalCard.tsx` — bios hidden behind an
   accessible "Biography" toggle (aria-expanded/aria-controls, 44px target, grid-rows animation,
   reduced-motion safe). Used by `app/page.tsx`.
5. **Copy updates** (2026-08-26, in `content/site.ts` + `CONTENT.md`): mandates now include
   **"Commodities"** (7 items); Transactional Stewardship body now "Active **throughout** the
   transaction lifecycle…".
6. **Font swap** (2026-08-26): Fraunces → **Cormorant Garamond** (500/600 + italic) in
   `app/layout.tsx` (`--font-cormorant`) + `app/globals.css`; `DESIGN_SYSTEM.md` updated (rationale:
   Fraunces' hooked "J" rejected in principals' names).
7. Docs: `CONTENT.md`, `DESIGN_SYSTEM.md`, `ORCHESTRATION.md`. Do NOT commit `.claude/` if it's
   session-local config — add to `.gitignore` if appropriate.

**Acceptance criteria:**
- **Update the test suite to match current reality** (expect failures otherwise): mandates list (7 incl.
  Commodities), stewardship copy, principals order/titles/names, bios hidden until the Biography toggle
  is clicked (add an E2E: click toggle → bio visible; aria-expanded flips), hero signature behavior,
  monogram accessible name. Vitest + Playwright — full suite green; report exact counts.
- `npm run build` + `npm run lint` clean. Visual sanity check at 1280px AND 375px (mobile) — principals
  grid 1-col on phone, toggle tappable; Cormorant renders on all serif headings.
- No secrets/PII in tree; `.env*` untracked. `npm audit` reported. **Confirm `.env.example` still lists
  `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`** (needed for Vercel env setup next).
- Commit (logical commits or one comprehensive commit — CC's choice) and **push to origin/main**.
  Report hash(es). Local == remote head.

**Out of scope:** visual changes beyond the working tree; SEO/sitemap (next round); deployment itself.

**How to verify:** build/lint/tests green; page correct at both breakpoints; push confirmed.

---

## 4-ARCHIVE. Prior Task (T2 — completed)

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

### T3.4 Report — 2026-09-24

**Summary:** Rebin Mustafa (Managing Partner) added as the sixth principal. Committed selectively,
pushed, and **live on www.meluccienterprises.com**. `HeroSignature.tsx` is still uncommitted and
unchanged in the working tree.

**Verified:**
- `content/site.ts` diff is exactly the new sixth entry (placed after Kim Wells); the jpg is 632×790 (4:5).
- **Test fix beyond the title change:** the principals E2E failed on Rebin, not on the count. His
  third bio paragraph contains "the Managing Partner at Melucci Group", so `getByText(role)` matched
  two elements and hit a strict-mode violation. The role check now uses `{ exact: true }`, with a
  comment explaining why. Test title changed from "five" to "six" and the order comment updated.
- `npm run build` clean · `npm run lint` clean · **Vitest 17/17 · Playwright 22/22 — total 39/39.**
  (Note: the shell's default `node` is 18.14, which Next 16 refuses. I ran the suite with nvm's
  Node 24.16. Vercel is unaffected.)
- Visual check on the dev server. **1280px:** a clean 3+3 grid (two rows of three cards, same left
  edges); all six photos load and render at the same 305×381. **375px:** 1-column stack, no
  horizontal scroll (scrollWidth 375), Biography toggle 114×44. Tapping it sets aria-expanded to
  true and shows all three bio paragraphs.
- The build includes the uncommitted HeroSignature change, but the deploy does not, because Vercel
  builds from the commit.

**⚠ `npm audit` got worse — needs a decision next round:** **5 vulns (1 critical, 2 high,
2 moderate)**. Last round it was 3 high. New findings:
- **next ≤16.3.2, critical.** Two RCE advisories: GHSA-p293-qw3h-jr36 (Windows-hosted servers, which
  doesn't apply on Vercel) and GHSA-2xp9-vwfh-vxw4 (Image Optimization API with AVIF). The fix is
  next@16.3.6, which is outside the pinned range.
- **postcss** and **sharp**, both high, bundled with next. The same upgrade fixes them.
- **vitest/@vitest/mocker**, moderate, dev-only. `npm audit fix` fixes it.

I made no changes because upgrades are out of T3.4 scope. I recommend a short round that bumps next
to 16.3.6 and re-runs the full suite.

**Commits (pushed; live on origin/main):**
- `134964a` T3.4: add Rebin Mustafa (Managing Partner) to the Leadership section
  (`content/site.ts`, `public/brand/principals/rebin-mustafa.jpg`, `e2e/site.spec.ts`, `ORCHESTRATION.md`)
- plus the docs commit containing this report

**Deploy:** live on the first check after push. The live HTML contains "Rebin Mustafa", and
`/brand/principals/rebin-mustafa.jpg` serves 200 as image/jpeg at 130,193 bytes, which matches the
committed file. I couldn't read Vercel's status API because `gh` isn't authenticated in this shell,
so this check was against the live site.

**`git status` after:** ` M components/HeroSignature.tsx` (only; still held back as instructed).

**Blockers:** none.

**Status set to:** AWAITING_REVIEW

### T3.1 Report — 2026-08-27

**Summary:** Cowork's hero optical-centering edit and the Open Graph link-preview assets verified,
committed, and **pushed to origin/main; the Vercel auto-deploy is live** — www.meluccienterprises.com
serves the new build. No code changes beyond the working tree except one housekeeping fix (below).

**Verified:**
- `components/HeroSignature.tsx` diff matches the work order exactly: `MY = max(8, (SH-totalH)*0.4 -
  markH*0.02)` + fallback tops 61%/64%/71%. No hero E2E asserts positions (states only) — **no test
  updates needed**.
- OG image is exactly 1200×630; `opengraph-image.png` + `.alt.txt` is a valid file convention in this
  Next version (checked `node_modules/next/dist/docs`), and Turbopack supports the alt file. Built
  `<head>` confirmed: `og:image` + `twitter:image` **absolute** URLs (metadataBase), width/height 1200/630,
  `twitter:card summary_large_image`, and both `og:image:alt`/`twitter:image:alt` present. (Nit: the alt
  content carries the file's trailing newline — harmless, consumers trim.)
- `npm run build` clean (`/opengraph-image.png` appears as a static route) · `npm run lint` clean ·
  **Vitest 17/17 · Playwright 22/22 — total 39/39.**
- Visual check on the running site at **1280px and 375px**: finished composition sits slightly above
  center at both widths, scroll cue clear of the tagline; animation plays and tap-skip works.
- `npm audit`: **3 high, unchanged** (transitive, bundled in next@16.2.11 — upgrade deferred per Round 3
  decision). No secrets/PII in tree.

**Housekeeping fix (found during the secrets check):** `.env.example` was **never actually in the repo**
— the `.gitignore` `.env*` rule swallowed it (prior reports over-claimed it as committed; it only existed
locally). Added `!.env.example` to `.gitignore` and committed the file (placeholders only, verified).
Matters for anyone cloning fresh; Vercel env vars themselves are unaffected.

**Commits (pushed; live on origin/main):**
- `e2045f0` T3.1: hero optical centering (40/60 free space) + Open Graph link-preview image
- `0f0df64` chore: actually track .env.example (placeholders) — was swallowed by the .env* ignore
- plus the docs commit containing this report

**Deploy:** green and serving — the new build appeared on https://www.meluccienterprises.com **~40s
after push** (live HTML contains the `top:61%` fallback and the absolute `og:image` meta;
`/opengraph-image.png` itself serves 200, image/png, 71,782 bytes).

**Blockers:** none.

**Status set to:** AWAITING_REVIEW

---

### T3 Report — 2026-08-26

**Summary:** All pending working-tree changes (items 1–7 of §4) verified, test suite updated to the
current site, everything committed and **pushed to origin/main**. No visual/feature changes beyond the
working tree; the only code deltas are test updates and a semver-safe `npm audit fix` (lockfile only).

**Test suite updates (the only edits beyond the pending work):**
- `e2e/site.spec.ts` — principals test now asserts the exact five-leader ORDER (CEO → General Counsel →
  President → COO → CFO) plus photo alt text and titles; NEW test: bios stay hidden until the Biography
  toggle is clicked — collapsed region measures 0px high and `aria-hidden="true"`, click flips
  `aria-expanded` false→true and `aria-hidden`→false, all bio paragraphs become visible (all 5 cards).
  Note: Playwright's `toBeVisible()` cannot see grid-rows-0fr overflow clipping, so hiddenness is
  asserted via bounding box + aria state. Mobile test extended: principals stack 1-col at 375px (cards
  share x, stacked y) and the toggle's touch target is ≥44px.
- Mandates/stewardship copy tests self-update (they iterate `content/site.ts`, already asserted verbatim).
- Hero behavior (`e2e/hero.spec.ts`, added with the feature): plays on load / tap skips / replays on
  reload / reduced-motion renders finished frame / SSR + noscript fallbacks. Monogram accessible name
  covered in hero + site specs (canvas `role="img"`) and the footer `next/image` alt.

**Verify:** `npm run build` clean (`/`, `/privacy` static; `/api/inquiry` dynamic; icons static) ·
`npm run lint` clean · **Vitest 17/17** (2 files: inquiry schema 9, signature-mark 8) · **Playwright
22/22** (smoke 4 — masthead assertion replaced by footer wordmark; site 8; inquiry 5; hero 5) — **total
39/39**, re-run green after the audit fix. Visual sanity at **1280px and 375px** via full-page
screenshots on the running site: all sections in order, 7 mandates incl. Commodities, principals grid
3-col/1-col with the specified order, expanded bio legible, toggle tappable, **Cormorant Garamond
renders on every serif heading**, hero mark + wordmark crisp at both widths.

**Security/audit:** no secrets/PII in tree (pattern scan clean); `.env*` untracked; `.env.example`
confirmed to list `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`. `npm audit`: was 12 high →
ran semver-compatible `npm audit fix` (brace-expansion, js-yaml, nanoid — dev/toolchain chains) → **3
high remain, all transitive inside next@16.2.11** (bundled postcss + sharp, flagged via next). `npm audit
fix --force` would jump to next@16.3.3 (outside the stated range) — pre-launch framework upgrade left as
a Cowork/Isaac decision; worth doing as its own verified round if desired.

**Housekeeping:** `.claude/` (session-local launch config) added to `.gitignore`, not committed.
`site.masthead` in `content/site.ts` remains unused (decision still with Cowork). A stale
`.git/index.lock` from 2026-07-25 was blocking commits — verified no git process was running, removed.

**Commits (pushed; local == remote head = the docs commit following these two):**
- `685bf44` brand: monogram as true per-color SVG variants rendered via next/image
- `a2cb7ba` T3: signature hero, principals w/ collapsible bios, Cormorant Garamond, copy + test updates
- plus the docs commit containing this report (§5) — the current origin/main head

**Blockers:** none. Deploy-ready — Vercel env needs the three `.env.example` keys.

**Status set to:** AWAITING_REVIEW

---

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

**Commit/push:** `064851d` "brand: vectorized MD monogram + hero refinements + reveal fix + icons"
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

**Round 3.1 / T3.1 — APPROVED (2026-08-27).** Hero optical centering + OG link-preview card live on
www.meluccienterprises.com (`e2045f0`, `0f0df64`, `64a21db`); 39/39 green; Cowork visually verified the
live hero. Good catch on `.env.example` never having been committed (gitignore swallow) — fix approved.
**SITE IS LIVE.** Launch remainder: Resend domain verify (Isaac clicking) → end-to-end inquiry form test.
Post-launch backlog: next@16.3.3 upgrade round; SEO round (sitemap/robots/schema); restrict Resend key
to the verified domain; Wix plan cancellation (client's call, no rush).

**Round 3 / T3 — APPROVED (2026-08-26).** All pending work committed + pushed (`685bf44`, `a2cb7ba`,
`ebca424`); suite 39/39 green; both breakpoints verified; no secrets. **Decision: defer next@16.3.3
upgrade until post-launch** (remaining 3 highs are build-time deps bundled in Next, not runtime; no
framework jumps right before deploy — schedule as its own round after the site is live). Next: deploy
(Vercel import + env vars → Resend domain → Vercel domains → DNS cutover at Wix, preserve MX).

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
