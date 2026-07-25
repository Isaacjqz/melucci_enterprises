# Melucci Enterprises — Design System

**Direction:** "Prospectus" — quiet-luxury, editorial stationery. The site should read like an opened
private memorandum: ivory paper, deep ink serif, hairline rules, a brass monogram, and generous negative
space. Restraint over decoration. Distinct from the Melucci Firm (this is more rarefied and minimal).

---

## 1. Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `paper` (primary bg) | `#F4F1E9` | Main ivory background |
| `paper-alt` (section bg) | `#EFEBE0` | Alternating section band |
| `ink` (primary text) | `#191B1E` | Headings + strong text |
| `ink-muted` (body) | `#5C5647` | Body copy, secondary text |
| `brass` (accent, decorative) | `#B08D57` | Rules, large monogram, decorative only — **NOT small text (fails AA)** |
| `brass-ink` (accent text) | `#7A5A2B` | Small brass TEXT: eyebrow labels, links, "→" (WCAG AA on paper) |
| `hairline` | `#D9D2C0` | Dividers, rules, borders |
| `hairline-soft` | `#DED7C6` | Softer section borders |
| **Inverted (for one "Confidential" band):** | | |
| `ink-panel` (dark bg) | `#14140F` | Deep near-black inverted section |
| `paper-on-dark` | `#EDE9E0` | Ivory text on the dark panel |

Contrast note: `brass #B08D57` is ~2.6:1 on paper — decorative/large only. Use `brass-ink #7A5A2B`
(~5:1) for any small brass text/labels/links. Verify WCAG AA for every text/bg pair.

---

## 2. Typography

- **Display / headings:** a high-contrast editorial serif — **Fraunces** (preferred) or Cormorant. Load
  via `next/font/google`, self-hosted. Weights 400/500; italic used sparingly for emphasis.
- **Body / UI / labels:** a clean, neutral sans (Inter or similar), 400/500. Comfortable line-height 1.75.
- **Eyebrow labels:** uppercase, `letter-spacing: 0.22em`, ~10–11px, `brass-ink`.
- **Masthead line:** tiny tracked caps (`MELUCCI ENTERPRISES` … `EST. NEW YORK`).
- Scale: H1 clamp(2rem, 4.5vw, 3rem) serif; section H2 ~1.5–2rem serif; body 15–17px sans.
- Sentence case for headings ("Private intermediation for extraordinary assets."). Caps only for eyebrows/masthead.

---

## 3. Components & Motifs

- **Hairline rules** separating sections and framing the masthead — a signature of the aesthetic.
- **Brass monogram "M"** as a recurring mark (masthead, footer, favicon, section openers).
- **Eyebrow + serif heading** pattern to open every section.
- **Optional numbered sections** (I · II · III) like a memorandum — elegant, discreet.
- **Links:** minimal text links in `brass-ink` with a trailing "→"; no loud filled buttons. The inquiry
  submit may be a single refined `ink` (or `brass-ink`) button.
- **Reveal-on-scroll:** slow, subtle fade/translate; honor `prefers-reduced-motion`.
- **Imagery:** sparse and optional. If any photo is used, treat it duotone/sepia toned to the paper
  palette so it never breaks the stationery feel. The power here is typographic, not photographic.

---

## 4. Layout & Section Rhythm (single-page)

Centered content, max-width ~1080px; text columns narrower (~62–70ch) for editorial measure. Very
generous vertical spacing. Sections in order:

1. **Masthead / Hero** — thin top rule; `MELUCCI ENTERPRISES · EST. NEW YORK`; brass monogram; serif H1
   ("Private intermediation for extraordinary assets."); short intro line; "Private inquiries →" link.
2. **Principal-Level Engagement / The Bridge** — the philosophy (two short blocks).
3. **Mandates We Handle** — refined list (real assets & infrastructure; natural resources & energy;
   aviation & strategic mobility; private capital & special situations; nation-scale developments; AI
   data center solutions).
4. **About the Firm** — discretion, continuity, long-term view.
5. **Approach & Reputation** — relationship-led, mandate-driven; confidentiality.
6. **Services** — Private Intermediation · Legal & Financial Coordination · Transactional Stewardship.
7. **Confidential Engagement** — the ONE inverted dark band (`ink-panel`) for gravitas: "All engagements
   are private and subject to qualification, legal review, and mutual alignment."
8. **Private Inquiry** — the form: First name · Last name · Email* · Phone · Message*; confidentiality note.
9. **Footer** — monogram, firm name, minimal links, current-year copyright.

---

## 5. Logo

The hand-drawn **"M" monogram** from the current site. To be supplied and cleaned into transparent recolor
variants: `brass` (on paper), `ink` (on paper, for small/favicon where brass fails contrast), and
`paper` (ivory, for the dark Confidential band + favicon on dark). Until supplied, use a refined serif "M"
placeholder in `brass`.

---

## 6. Content Integrity

Reuse the client's existing (excellent) copy. **No fabricated deals, statistics, client names, logos, or
track record** — the restraint is the brand. Add an attorney-style privacy/confidentiality page.

## 7. Accessibility & Quality

WCAG 2.1 AA (contrast, focus states, semantic HTML, keyboard nav, reduced motion). Performance budget:
near-instant load (a stark contrast to the current Wix site). Lighthouse 95+.
