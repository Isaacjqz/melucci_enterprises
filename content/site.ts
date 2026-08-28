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
      "Commodities",
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
  principals: {
    eyebrow: "Leadership",
    heading: "The principals.",
    // Names and photos come from the firm's own deck ("Melucci Enterprises
    // LLC v7 — Onyx & Gold", slides 3–4 and 8). Bios are verbatim from the
    // deck, or as supplied directly by Isaac (2026-08-16).
    items: [
      {
        name: "Miosoty Melucci",
        role: "Chief Executive Officer",
        bio: [
          "Miosoty Melucci is a South Florida-based entrepreneur, developer, and business connector. She is the CEO of Melucci Enterprises LLC and Founder/CEO of Melucci Designs LLC, where she has successfully led the development, design, and construction of over 15 full-scale real estate properties.",
          "Known for her extensive network in construction, finance, and regulatory sectors, she frequently acts as a bridge between buyers, sellers, and capital.",
          "Her key roles and ventures include:",
          "Melucci Enterprises LLC: CEO of the business consulting and venture-backing firm.",
          "Melucci Designs LLC: CEO of the design and real estate development company.",
          "Speaking engagements: She has served as a featured speaker at business events such as the World Venture Forum.",
        ],
        photo: "/brand/principals/miosoty-melucci.jpg",
      },
      {
        name: "Daniel Melucci, Esq.",
        role: "General Counsel",
        // Bio supplied by Isaac (2026-08-16) — verbatim.
        bio: [
          "Daniel Melucci is the founder and principal of Melucci Firm P.C. A New York attorney since 1992 with more than three decades of experience, he has spent his career helping individuals and families through some of their most difficult moments — from overwhelming debt to serious injury.",
          "He has concentrated on bankruptcy since 1995 and also represents clients in personal injury, commercial litigation, business and corporate matters, contracts and legal documents, and appeals. A seasoned litigator, Daniel has tried numerous cases through verdict and argued roughly fifteen appeals before the New York Appellate Division and the U.S. Court of Appeals for the Second Circuit. He is admitted to the New York state and federal courts, the Second Circuit, and the Supreme Court of the United States.",
          "A graduate of Brooklyn Law School and trained through the National Institute for Trial Advocacy, Daniel is fluent in Spanish and has been recognized for representing September 11 victims on a pro bono basis. He believes legal help should feel human — he meets every client person-to-person, explains the options in plain language, and offers a free initial consultation. Se habla español.",
        ],
        photo: "/brand/principals/daniel-melucci.jpg",
      },
      {
        name: "Major General (Ret.) Paul E. Knapp",
        role: "President",
        bio: [
          "Paul E. Knapp is a distinguished senior executive and retired Major General in the U.S. Air Force with over 30 years of leadership in defense, homeland security, emergency management, cybersecurity and public administration. Known for his strategic acumen and ability to lead through complex challenges, Knapp has earned recognition as a trusted advisor to military, state, and federal leaders.",
          "Knapp offers a unique combination of strategic vision, operational execution, and governance expertise. His ability to lead large organizations through uncertainty, manage risk, and foster cross-sector collaboration, positions him as a valuable contributor.",
          "He earned a Bachelor of Science in Political Science/International Affairs with a minor in Japanese from the US Air Force Academy, and a Master of Science in Technology Management from the University of Maryland. Which is known as an MBA for the technology sector. He has also completed executive level courses at the Harvard Kennedy School of Government, UNC Kenan-Flagler Business School, Syracuse University and most recently “Leading Data and AI-Enabled Organizations,” at the Naval Postgraduate School in Monterey, CA.",
        ],
        photo: "/brand/principals/paul-knapp.jpg",
      },
      {
        name: "Román Jáquez",
        role: "Chief Operating Officer",
        bio: ["Executive leader, entrepreneur, and award winning producer with 20+ years of experience in business development, strategic partnerships, fundraising, diplomacy, media ventures, and organizational growth."],
        photo: "/brand/principals/roman-jaquez.jpg",
      },
      {
        name: "Kim Wells, CPA",
        role: "Chief Financial Officer",
        bio: ["Kim is a New York CPA and entrepreneur focused on financial consulting, contract drafting and advisory, strategic partnerships, and business development across startups, nonprofits, and emerging industries."],
        photo: "/brand/principals/kim-wells.jpg",
      },
    ],
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
        body: "Active throughout the transaction lifecycle to manage complexity, momentum, and relationships.",
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
