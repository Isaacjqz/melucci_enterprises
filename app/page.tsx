import { site } from "@/content/site";

export default function Home() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-3xl font-medium tracking-tight">
        {site.copy.home.heading}
      </h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {site.copy.home.line}
      </p>
    </section>
  );
}
