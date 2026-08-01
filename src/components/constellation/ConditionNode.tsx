/**
 * Single condition node — clickable, used inside the constellation
 * tick list. Lightweight duplicate of the SVG node for a11y.
 */
import { motion } from "framer-motion";
import { classNames } from "../../lib/utils/formatters";
import type { ConditionKey, ConditionScore } from "../../types";

const labelOf: Record<ConditionKey, string> = {
  diabetes: "Diabetes",
  hypertension: "Hypertension",
  cvd: "Cardiovascular",
  ckd: "Kidney",
  stroke: "Stroke",
};

interface Props {
  k: ConditionKey;
  s: ConditionScore;
  active?: boolean;
  onClick?: () => void;
}

export function ConditionNode({ k, s, active, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={classNames(
        "w-full text-left rounded-card border p-4 transition-colors",
        active
          ? "bg-brand-primary/5 border-brand-primary"
          : "bg-surface border-border hover:border-border-strong",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-9 w-9 rounded-lg grid place-items-center text-text-inverse font-mono text-sm"
            style={{ background: `var(--condition-${k})` }}
          >
            {labelOf[k][0]}
          </span>
          <div>
            <div className="font-medium text-text-primary">{labelOf[k]}</div>
            <div className="text-xs text-text-secondary">{s.stage}</div>
          </div>
        </div>
        <div className="text-right">
          {s.value != null && (
            <div className="font-mono text-lg text-text-primary">{s.value}</div>
          )}
          <div className="text-[10px] uppercase tracking-wide text-text-muted">{s.band}</div>
        </div>
      </div>
    </motion.button>
  );
}
