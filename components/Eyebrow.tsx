export default function Eyebrow({
  children,
  numeral,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  numeral?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
        onDark ? "text-brass" : "text-brass-ink"
      } ${className}`}
    >
      {numeral ? <span className="mr-3">{numeral}</span> : null}
      {children}
    </p>
  );
}
