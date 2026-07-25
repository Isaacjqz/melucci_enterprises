import Link from "next/link";
import { site } from "@/content/site";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center border border-current text-sm font-semibold"
          >
            {site.monogram}
          </span>
          <span className="text-sm font-medium tracking-widest uppercase">
            {site.name}
          </span>
        </Link>
      </div>
    </header>
  );
}
