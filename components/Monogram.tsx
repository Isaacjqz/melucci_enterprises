import Image from "next/image";

/**
 * The firm's hand-drawn "MD" monogram — a vectorized SVG (per-color variants),
 * served unoptimized so the browser renders it as true vector and keeps it razor
 * sharp at any size/zoom. This is the ONLY place the mark is defined.
 */
const SRC = {
  brass: "/brand/monogram-brass.svg", // primary, on ivory
  ink: "/brand/monogram-ink.svg", // small / on light
  paper: "/brand/monogram-ivory.svg", // on the dark Confidential band
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
    <Image
      src={SRC[tone]}
      alt="Melucci Enterprises"
      width={3582}
      height={3024}
      unoptimized
      priority={size === "lg"}
      className={`w-auto select-none ${HEIGHT[size]} ${className}`}
    />
  );
}
