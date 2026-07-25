/**
 * The firm's "M" monogram. Placeholder: refined serif "M" in brass.
 * The real hand-drawn asset (transparent recolor variants) will replace the
 * glyph here — this is the ONLY place the mark is defined.
 */
export default function Monogram({
  size = "md",
  tone = "brass",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "brass" | "ink" | "paper";
  className?: string;
}) {
  const sizes = { sm: "text-xl", md: "text-3xl", lg: "text-6xl" } as const;
  const tones = {
    brass: "text-brass",
    ink: "text-ink",
    paper: "text-paper-on-dark",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={`font-serif font-medium leading-none select-none ${sizes[size]} ${tones[tone]} ${className}`}
    >
      M
    </span>
  );
}
