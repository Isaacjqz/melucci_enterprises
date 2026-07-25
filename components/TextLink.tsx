import Link from "next/link";

export default function TextLink({
  href,
  children,
  onDark = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-baseline gap-2 text-sm font-medium tracking-wide underline-offset-4 transition-colors hover:underline ${
        onDark ? "text-paper-on-dark" : "text-brass-ink"
      } ${className}`}
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
