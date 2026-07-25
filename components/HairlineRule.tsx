export default function HairlineRule({
  soft = false,
  className = "",
}: {
  soft?: boolean;
  className?: string;
}) {
  return (
    <hr
      className={`border-0 border-t ${
        soft ? "border-hairline-soft" : "border-hairline"
      } ${className}`}
    />
  );
}
