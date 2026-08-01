import { classNames } from "../../lib/utils/formatters";
import type { ReactNode } from "react";

type Tone = "neutral" | "low" | "moderate" | "high" | "critical" | "brand";

interface Props {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  title?: string;
}

const toneClass: Record<Tone, string> = {
  neutral:  "bg-surface-muted text-text-secondary border border-border",
  low:      "bg-risk-low/10 text-risk-low border border-risk-low/30",
  moderate: "bg-risk-mod/10 text-risk-mod border border-risk-mod/30",
  high:     "bg-risk-high/10 text-risk-high border border-risk-high/30",
  critical: "bg-risk-crit/10 text-risk-crit border border-risk-crit/30",
  brand:    "bg-brand-primary/10 text-brand-primary border border-brand-primary/30",
};

export function Badge({ tone = "neutral", children, className, title }: Props) {
  return (
    <span
      title={title}
      className={classNames(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium",
        toneClass[tone],
        className ?? "",
      )}
    >
      {children}
    </span>
  );
}
