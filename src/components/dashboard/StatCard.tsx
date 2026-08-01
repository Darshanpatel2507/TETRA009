import { Card } from "../ui/Card";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "neutral" | "high" | "critical";
}

export function StatCard({ label, value, hint, tone = "neutral" }: Props) {
  const ring =
    tone === "high" ? "border-risk-high/30" :
    tone === "critical" ? "border-risk-crit/30" : "border-border";
  const valueColor =
    tone === "high" ? "text-risk-high" :
    tone === "critical" ? "text-risk-crit" : "text-text-primary";
  return (
    <Card className={`p-5 ${ring}`} hover>
      <div className="text-sm text-text-secondary">{label}</div>
      <div className={`mt-2 font-mono text-3xl ${valueColor}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </Card>
  );
}
