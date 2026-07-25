import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.copy.privacy.heading} — ${site.name}`,
};

export default function Privacy() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-3xl font-medium tracking-tight">
        {site.copy.privacy.heading}
      </h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {site.copy.privacy.line}
      </p>
    </section>
  );
}
