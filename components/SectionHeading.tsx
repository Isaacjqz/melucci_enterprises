import Eyebrow from "@/components/Eyebrow";

export default function SectionHeading({
  eyebrow,
  numeral,
  children,
  onDark = false,
  className = "",
}: {
  eyebrow: string;
  numeral?: string;
  children?: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow numeral={numeral} onDark={onDark}>
        {eyebrow}
      </Eyebrow>
      {children ? (
        <h2
          className={`mt-4 font-serif text-2xl font-medium tracking-tight sm:text-3xl ${
            onDark ? "text-paper-on-dark" : "text-ink"
          }`}
        >
          {children}
        </h2>
      ) : null}
    </div>
  );
}
