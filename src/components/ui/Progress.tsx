import { classNames } from "../../lib/utils/formatters";

interface Props {
  value: number; // 0..100
  className?: string;
  tone?: "brand" | "risk";
}

export function Progress({ value, className, tone = "brand" }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const colorClass = tone === "risk" ? "bg-risk-high" : "bg-brand-primary";
  return (
    <div className={classNames("h-2 w-full bg-surface-muted rounded-pill overflow-hidden", className ?? "")}>
      <div className={classNames("h-full transition-[width] duration-300", colorClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}
