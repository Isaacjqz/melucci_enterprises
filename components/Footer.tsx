import Link from "next/link";
import { site } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-neutral-500 dark:text-neutral-400">
        <span>{site.name}</span>
        <Link href={site.inquiries.href} className="underline underline-offset-4">
          {site.inquiries.label}
        </Link>
        <span>
          © {year} {site.name}
        </span>
      </div>
    </footer>
  );
}
