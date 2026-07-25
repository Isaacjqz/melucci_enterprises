import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import HairlineRule from "@/components/HairlineRule";
import InquiryForm from "@/components/InquiryForm";
import Monogram from "@/components/Monogram";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* 1 · Masthead / Hero */}
      <section aria-label="Introduction">
        <Container className="py-24 text-center sm:py-32">
          <Reveal>
            <Eyebrow className="!text-brass-ink">{site.masthead}</Eyebrow>
            <Monogram size="lg" className="mt-10 block" />
            <h1 className="mx-auto mt-10 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-tight tracking-tight text-ink">
              {site.hero.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] leading-[1.75] text-ink-muted">
              {site.hero.intro}
            </p>
            <div className="mt-10">
              <TextLink href="#contact">{site.inquiries.label}</TextLink>
            </div>
          </Reveal>
        </Container>
        <HairlineRule />
      </section>

      {/* 2 · Principal-level engagement + The bridge */}
      <section aria-labelledby="principal-heading">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-16 sm:grid-cols-2">
            <Reveal>
              <SectionHeading eyebrow={site.principal.eyebrow} numeral="I">
                <span id="principal-heading">Clarity and continuity.</span>
              </SectionHeading>
              <p className="mt-6 max-w-[62ch] leading-[1.75] text-ink-muted">
                {site.principal.body}
              </p>
            </Reveal>
            <Reveal>
              <SectionHeading eyebrow={site.bridge.eyebrow} numeral="II">
                Trust, while enabling progress.
              </SectionHeading>
              <p className="mt-6 max-w-[62ch] leading-[1.75] text-ink-muted">
                {site.bridge.body}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 3 · Mandates */}
      <section aria-labelledby="mandates-heading" className="bg-paper-alt">
        <HairlineRule soft />
        <Container className="py-20 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={site.mandates.eyebrow} numeral="III">
              <span id="mandates-heading">{site.mandates.heading}</span>
            </SectionHeading>
            <ul className="mt-10 grid gap-x-16 gap-y-5 sm:grid-cols-2">
              {site.mandates.items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-hairline pb-5 text-ink"
                >
                  <span aria-hidden="true" className="text-brass">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
        <HairlineRule soft />
      </section>

      {/* 4 · About the firm */}
      <section aria-labelledby="about-heading">
        <Container className="py-20 sm:py-28">
          <Reveal className="max-w-[70ch]">
            <SectionHeading eyebrow={site.about.eyebrow} numeral="IV">
              <span id="about-heading">{site.about.heading}</span>
            </SectionHeading>
            <p className="mt-6 leading-[1.75] text-ink-muted">{site.about.body}</p>
          </Reveal>
        </Container>
      </section>

      {/* 5 · Approach & reputation */}
      <section aria-labelledby="approach-heading">
        <HairlineRule />
        <Container className="py-20 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={site.approach.eyebrow} numeral="V">
              <span id="approach-heading">{site.approach.heading}</span>
            </SectionHeading>
            <div className="mt-8 grid gap-12 sm:grid-cols-2">
              <p className="max-w-[62ch] leading-[1.75] text-ink-muted">
                {site.approach.approach}
              </p>
              <p className="max-w-[62ch] leading-[1.75] text-ink-muted">
                {site.approach.reputation}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 6 · Services */}
      <section aria-labelledby="services-heading" className="bg-paper-alt">
        <HairlineRule soft />
        <Container className="py-20 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={site.services.eyebrow} numeral="VI">
              <span id="services-heading">{site.services.heading}</span>
            </SectionHeading>
          </Reveal>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            {site.services.items.map((service) => (
              <Reveal key={service.title}>
                <h3 className="font-serif text-xl font-medium text-ink">
                  {service.title}
                </h3>
                <HairlineRule className="my-4 w-10 !border-brass" />
                <p className="leading-[1.75] text-ink-muted">{service.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
        <HairlineRule soft />
      </section>

      {/* 7 · Confidential engagement — the one inverted band */}
      <section aria-labelledby="confidential-heading" className="bg-ink-panel">
        <Container className="py-20 text-center sm:py-24">
          <Reveal>
            <Eyebrow onDark>{site.confidential.eyebrow}</Eyebrow>
            <p
              id="confidential-heading"
              className="mx-auto mt-8 max-w-[46ch] font-serif text-xl font-normal leading-relaxed text-paper-on-dark sm:text-2xl"
            >
              {site.confidential.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 8 · Private inquiry */}
      <section id="contact" aria-labelledby="inquiry-heading" className="scroll-mt-8">
        <Container className="py-20 sm:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <SectionHeading eyebrow={site.inquiry.eyebrow} numeral="VII">
              <span id="inquiry-heading">{site.inquiry.heading}</span>
            </SectionHeading>
            <div className="mt-10">
              <InquiryForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
