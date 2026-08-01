import { Card } from "../ui/Card";
import { Progress } from "../ui/Progress";
import { Tooltip } from "../ui/Tooltip";
import type { ConditionKey, FactorRow } from "../../types";

const labelOf: Record<ConditionKey, string> = {
  diabetes: "Diabetes",
  hypertension: "Hypertension",
  cvd: "CVD",
  ckd: "Kidney",
  stroke: "Stroke",
};

export function FactorBreakdownTable({ rows }: { rows: FactorRow[] }) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-lg mb-3">Contributing factors</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-text-secondary">No major factors captured.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center gap-4">
              <span
                className="h-7 w-7 rounded-md grid place-items-center text-[10px] font-mono text-text-inverse"
                style={{ background: `var(--condition-${r.condition})` }}
              >
                {labelOf[r.condition][0]}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    <Tooltip label={r.source.toUpperCase()}>{r.label}</Tooltip>
                  </div>
                  <div className="font-mono text-sm text-text-secondary">{r.value}</div>
                </div>
                <Progress value={r.weight * 100} className="mt-1" tone="risk" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
