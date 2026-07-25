import type { Metadata } from "next";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import HairlineRule from "@/components/HairlineRule";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy — ${site.name}`,
  description: `Privacy and confidentiality statement for ${site.name}.`,
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Scope",
    body: [
      "This statement describes how Melucci Enterprises handles information received through this website, including the Private Inquiry form. By using this site, you acknowledge the practices described here.",
    ],
  },
  {
    heading: "Information we receive",
    body: [
      "If you submit an inquiry, we receive the information you choose to provide: your name, email address, telephone number (if given), and the contents of your message. This site does not use advertising trackers or analytics that profile visitors.",
    ],
  },
  {
    heading: "Use of information",
    body: [
      "Information you submit is used solely to review and respond to your inquiry. We do not sell, rent, or trade personal information. We do not add you to marketing lists.",
    ],
  },
  {
    heading: "Confidentiality",
    body: [
      "Submissions are treated as confidential and are reviewed only by persons authorized by the firm. Consistent with our practice, correspondence is handled with discretion.",
      "Submitting an inquiry does not create an engagement, client relationship, or obligation on the part of Melucci Enterprises. All engagements are private and subject to qualification, legal review, and mutual alignment.",
    ],
  },
  {
    heading: "Service providers",
    body: [
      "Inquiry submissions are delivered to the firm by a third-party email delivery service acting on our instructions. We do not store form submissions in a database on this site.",
    ],
  },
  {
    heading: "Retention",
    body: [
      "Correspondence is retained only as long as reasonably necessary to evaluate and respond to the matter raised, or as required by law.",
    ],
  },
  {
    heading: "Security",
    body: [
      "This site is served over HTTPS and applies industry-standard security headers. No method of transmission is completely secure; please limit the sensitivity of details shared through the form and reserve particulars for direct correspondence.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "Questions regarding this statement may be directed to the firm through the Private Inquiry form.",
    ],
  },
];

export default function Privacy() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-[70ch]">
        <Eyebrow>Privacy &amp; confidentiality</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Privacy
        </h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: July 25, 2026</p>
        <HairlineRule className="mt-10" />
        {sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-serif text-xl font-medium text-ink">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-4 leading-[1.75] text-ink-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
