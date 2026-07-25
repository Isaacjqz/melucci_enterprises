/**
 * The firm's hand-drawn "MD" monogram — a vectorized (SVG) mark so the strokes
 * stay perfectly smooth at any size. Rendered via CSS mask so it inherits the
 * current text color (brass / ink / ivory). This is the ONLY place the mark is defined.
 */
const TONE = {
  brass: "text-brass",
  ink: "text-ink",
  paper: "text-paper-on-dark",
} as const;

// Height per size; width follows the monogram's aspect ratio.
const HEIGHT = { sm: "h-5", md: "h-8", lg: "h-44 sm:h-56" } as const;

export default function Monogram({
  size = "md",
  tone = "brass",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "brass" | "ink" | "paper";
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Melucci Enterprises"
      className={`inline-block ${HEIGHT[size]} ${TONE[tone]} ${className}`}
      style={{
        aspectRatio: "1888 / 1650",
        backgroundColor: "currentColor",
        WebkitMaskImage: "url(/brand/monogram.svg)",
        maskImage: "url(/brand/monogram.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
