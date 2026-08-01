import { Badge } from "../ui/Badge";
import type { RiskBand } from "../../types";
import { bandLabel } from "../../lib/utils/formatters";

export function RiskDotsBadge({ band }: { band: RiskBand }) {
  const map = { low: 1, moderate: 2, high: 3, critical: 4 } as const;
  const n = map[band];
  const dots = Array.from({ length: 4 }, (_, i) => i < n);
  return (
    <Badge tone={band} title={bandLabel(band)}>
      <span className="flex gap-0.5">
        {dots.map((d, i) => (
          <span
            key={i}
            className={`inline-block h-1.5 w-1.5 rounded-full ${d ? "bg-current" : "bg-border-strong"}`}
          />
        ))}
      </span>
      <span className="font-mono">{bandLabel(band)}</span>
    </Badge>
  );
}
