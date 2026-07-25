import Link from "next/link";
import Container from "@/components/Container";
import Monogram from "@/components/Monogram";
import TextLink from "@/components/TextLink";
import { site } from "@/content/site";

export default function Masthead() {
  return (
    <header className="border-t-2 border-b border-t-ink border-b-hairline">
      <Container className="flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <Monogram size="sm" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em]">
            {site.name}
          </span>
        </Link>
        <TextLink href={site.inquiries.href}>{site.inquiries.label}</TextLink>
      </Container>
    </header>
  );
}
