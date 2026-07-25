/**
 * Single source of truth for site-wide content.
 * Copy comes verbatim from CONTENT.md (the firm's existing wording) —
 * do NOT fabricate deals, stats, names, or claims.
 */
export const site = {
  name: "Melucci Enterprises",
  monogram: "M", // placeholder — real monogram asset to be supplied (see components/Monogram.tsx)
  masthead: "MELUCCI ENTERPRISES · EST. NEW YORK",
  description:
    "Melucci Enterprises facilitates private, off-market transactions through long-standing relationships, disciplined processes, and decisive execution.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Privacy", href: "/privacy" },
  ],
  inquiries: {
    label: "Private inquiries",
    href: "/#contact",
  },
  hero: {
    heading: "Private intermediation for extraordinary assets.",
    intro:
      "Melucci Enterprises facilitates private, off-market transactions through long-standing relationships, disciplined processes, and decisive execution.",
  },
  principal: {
    eyebrow: "Principal-level engagement",
    body: "Our role is to create clarity and continuity in complex transactions. We operate at the principal level, representing defined mandates where discretion, authority, and alignment are established in advance.",
  },
  bridge: {
    eyebrow: "The bridge",
    body: "Our responsibility is to preserve trust while enabling progress. We serve as the bridge between buyers and sellers, vision and capital, opportunity and execution.",
  },
  mandates: {
    eyebrow: "Mandates we handle",
    heading: "Mandates we handle",
    items: [
      "Real assets and infrastructure",
      "Natural resources and energy",
      "Aviation and strategic mobility",
      "Private capital and special situations",
      "Nation-scale and transformational developments",
      "AI data center solutions",
    ],
  },
  about: {
    eyebrow: "About the firm",
    heading: "Discretion, continuity, and a long-term view.",
    body: "We operate with discretion, continuity, and a long-term view. Melucci Enterprises is a private intermediation firm serving principals, family offices, institutional interests, and authorized representatives engaged in complex, high-value transactions.",
  },
  approach: {
    eyebrow: "Approach & reputation",
    heading: "Relationship-led. Mandate-driven.",
    approach:
      "Our work is relationship-led and mandate-driven. Introductions are made deliberately. Interests are protected throughout the process. Execution is guided by preparation and responsibility.",
    reputation:
      "Our reputation is sustained through consistent delivery and disciplined restraint. We are known for protecting relationships, preserving confidentiality, and maintaining alignment in environments where trust is essential.",
  },
  services: {
    eyebrow: "Services",
    heading: "Services",
    items: [
      {
        title: "Private Intermediation",
        body: "Principal-to-principal introductions structured around defined, off-market mandates.",
      },
      {
        title: "Legal & Financial Coordination",
        body: "Coordination with legal and financial counsel to ensure clarity, protection, and continuity.",
      },
      {
        title: "Transactional Stewardship",
        body: "Active on the transaction lifecycle to manage complexity, momentum, and relationships.",
      },
    ],
  },
  confidential: {
    eyebrow: "Confidential engagement",
    body: "All engagements are private and subject to qualification, legal review, and mutual alignment. We work exclusively with authorized principals and defined mandates.",
  },
  inquiry: {
    eyebrow: "Private inquiry",
    heading: "Begin a conversation.",
    note: "Submissions are treated as confidential. This form does not constitute an engagement.",
  },
} as const;

export type Site = typeof site;
