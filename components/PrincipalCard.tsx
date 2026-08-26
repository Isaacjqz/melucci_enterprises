"use client";

import Image from "next/image";
import { useId, useState } from "react";

/**
 * A principal's card: photo, name, title, and a collapsible biography behind
 * a "Biography" toggle. Accessible (button + aria-expanded/aria-controls,
 * 44px+ touch target) and mobile-first; the expand animation uses the CSS
 * grid-rows 0fr→1fr technique (works on iOS Safari, Android Chrome, etc.)
 * and is disabled under prefers-reduced-motion.
 */
export default function PrincipalCard({
  name,
  role,
  bio,
  photo,
}: {
  name: string;
  role: string | null;
  bio: readonly string[];
  photo: string;
}) {
  const [open, setOpen] = useState(false);
  const bioId = useId();

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-paper-alt">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-6 font-serif text-xl font-medium leading-snug text-ink">
        {name}
      </h3>
      {role && (
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-brass-ink">
          {role}
        </p>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bioId}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brass-ink transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-ink"
      >
        Biography
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`h-4 w-4 shrink-0 motion-safe:transition-transform motion-safe:duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6l5 5 5-5" />
        </svg>
      </button>
      <div
        id={bioId}
        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div aria-hidden={!open} className="space-y-3 pt-1 pb-2">
            {bio.map((para) => (
              <p key={para} className="text-sm leading-[1.75] text-ink-muted">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
