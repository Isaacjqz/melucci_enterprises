import Link from "next/link";
import Container from "@/components/Container";
import HairlineRule from "@/components/HairlineRule";
import Monogram from "@/components/Monogram";
import { site } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto">
      <HairlineRule />
      <Container className="flex flex-col items-center gap-6 py-12 text-center">
        <Monogram size="md" />
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
          {site.name}
        </p>
        <nav aria-label="Footer" className="flex items-center gap-8 text-sm">
          <Link
            href={site.inquiries.href}
            className="text-brass-ink underline-offset-4 hover:underline"
          >
            {site.inquiries.label}
          </Link>
          <Link
            href="/privacy"
            className="text-brass-ink underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
        </nav>
        <p className="text-sm text-ink-muted">
          © {year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
