# Melucci Enterprises — Website Rebuild Plan

**Client:** Melucci Enterprises — private intermediation firm (off-market, high-value transactions)
**Current site:** https://www.meluccienterprises.com (Wix template)
**Prepared:** July 2026
**Goal:** Rebuild as a fast, fully-owned, "quiet-luxury" website that matches the firm's ultra-premium,
discreet positioning — using the same proven stack and workflow as the Melucci Firm P.C. site.

---

## 1. Objectives

1. Elevate the design to match the (already excellent) copy — the current gap is templated Wix design vs. refined wording.
2. Own the codebase + infrastructure (no Wix lock-in); make it fast (the current site is slow and JS-heavy).
3. A distinct, rarefied brand identity — separate from the approachable law firm ("quiet luxury").
4. A discreet, secure "Private Inquiry" form (sensitive submissions).
5. Real SEO, accessibility, and near-instant load. Minimal, restrained, timeless.

---

## 2. Current State (audit)

| Area | Finding |
|------|---------|
| Builder | Wix.com Website Builder (proprietary, no code export) |
| Hosting | Wix managed hosting (Google Cloud + CDN); media on `static.wixstatic.com` |
| Performance | Slow — blur-up placeholders + heavy JS; several seconds to first meaningful paint |
| Design | Generic Wix: default sans headline, cramped sub-copy, templated spacing/hierarchy |
| Copy | **Excellent** — restrained, confident, "private-bank" tone (keep it) |
| Logo | Hand-drawn "M" script monogram (distinctive; keep + clean up like we did the firm emblem) |
| Structure | Single long-scroll page |

**Implication:** this is primarily a **design + engineering elevation**, not a content project. The words are strong; the presentation needs to be brought up to their level.

---

## 3. Tech Stack (identical to the law firm)

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router), static-first |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Editorial high-contrast serif (e.g., Fraunces/Cormorant) + clean grotesque sans, via `next/font` |
| Inquiry form | Next.js Route Handler + **Resend** (server validation, honeypot, rate limit, no PII logging) |
| Hosting | **Vercel** (free tier, global CDN, auto-SSL) |
| Repo / CI | Private **GitHub** repo + Vercel Git integration (push to `main` → auto-deploy) |
| SEO | metadata, sitemap, robots, JSON-LD (`Organization`) |
| Testing | Playwright E2E + Vitest unit |

---

## 4. Design Direction — "Quiet Luxury" (distinct brand)

Restraint over decoration; the aesthetic of a boutique M&A advisory / private bank. Deep, calm palette;
generous negative space; a single metallic accent (champagne/brass) used sparingly; slow reveal-on-scroll;
cinematic, properly-licensed imagery where used. **One of three concepts, pending selection:**

- **A — Obsidian:** near-black, no imagery, editorial serif, champagne hairline. Most minimal/timeless.
- **B — Cinematic:** full-bleed dark imagery under overlay, serif headline on top. Grandest; needs great photos.
- **C — Prospectus:** ivory stationery + ink serif + hairline rules + monogram. Most distinctive/unexpected.

The **"M" monogram** anchors the identity (header, footer, favicon), recolored to fit the chosen direction.
→ *Design system doc (`DESIGN_SYSTEM.md`) gets written once a direction is picked.*

---

## 5. Site Architecture

A single, elegant long-scroll narrative — paced like a private memorandum, not a brochure:

1. **Hero** — monogram + one-line positioning ("Private intermediation for extraordinary assets").
2. **Principal-Level Engagement / The Bridge** — the firm's philosophy.
3. **Mandates We Handle** — real assets & infrastructure; natural resources & energy; aviation & strategic
   mobility; private capital & special situations; nation-scale developments; AI data centers.
4. **About the Firm** — discretion, continuity, long-term view.
5. **Approach & Reputation** — relationship-led, mandate-driven; confidentiality.
6. **Services** — Private Intermediation · Legal & Financial Coordination · Transactional Stewardship.
7. **Confidential / Private Inquiry** — gated, secure form with strong confidentiality framing.
8. **Footer** + a Privacy page.

---

## 6. Content Integrity

The current copy is refined and makes **no unverifiable claims** (no track record, no client names, no
figures) — by design, for a discreet intermediary. We preserve that restraint: **no fabricated deals,
stats, testimonials, or logos.** Reuse the client's existing wording; polish only for typography/flow.

---

## 7. Build Phases (Cowork ⇄ Claude Code, in rounds)

- **Phase 1 — Design & docs:** pick a direction → write `DESIGN_SYSTEM.md` + content source; clean the monogram.
- **Phase 2 — Scaffold:** Next.js + TS + Tailwind + ESLint; security headers; Playwright harness; **private GitHub repo**.
- **Phase 3 — Build:** the single-page narrative (all sections) in the chosen design system.
- **Phase 4 — Inquiry form:** Resend-backed, secure, confidential.
- **Phase 5 — Launch prep:** SEO, 404, icons, full E2E, production build — deploy-ready.
- **Phase 6 — Launch:** Vercel deploy → temp URL QA → zero-downtime DNS cutover at Wix (**preserve email MX**) → private `OPERATIONS.md` runbook.

All coordinated through `ORCHESTRATION.md` (the handoff file), exactly like the law firm build.

---

## 8. Hosting & Cost

Vercel (free/Hobby) + domain renewal (stays at Wix) + Resend free tier → roughly **$0–15/month** plus
annual domain renewal. Fast, owned, secure — a step-change from the Wix subscription.

---

## 9. Immediate Next Steps

1. **Pick a hero direction** — Obsidian, Cinematic, or Prospectus.
2. **Provide the "M" monogram** file (transparent PNG or SVG) into this folder.
3. Then: write `DESIGN_SYSTEM.md` + content source → set up `ORCHESTRATION.md` → scaffold + private repo.
