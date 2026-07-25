/**
 * Single source of truth for site-wide content.
 * Real copy lands in a later round — keep placeholders neutral and factual.
 */
export const site = {
  name: "Melucci Enterprises",
  monogram: "M", // placeholder — final monogram asset to be supplied
  description: "A private intermediation firm.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Privacy", href: "/privacy" },
  ],
  inquiries: {
    label: "Private inquiries",
    href: "/#contact",
  },
  copy: {
    home: {
      heading: "Melucci Enterprises",
      line: "Private intermediation, conducted with discretion.",
    },
    privacy: {
      heading: "Privacy",
      line: "The privacy policy for Melucci Enterprises will appear here.",
    },
  },
} as const;

export type Site = typeof site;
