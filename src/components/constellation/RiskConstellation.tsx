/**
 * Risk Constellation — five-node visualisation in a dark, immersive
 * panel. The fastest pulse is on the highest-urgency node.
 *
 * Layout: five nodes laid out radially with SVG. Each node is a
 * labelled circle coloured by condition. The pulse is implemented
 * with framer-motion's animate prop on a ring behind the node.
 */
import { motion } from "framer-motion";
import type { ConditionKey, ConditionScore, RiskBand } from "../../types";
import { classNames } from "../../lib/utils/formatters";

const NODES: { key: ConditionKey; label: string; short: string }[] = [
  { key: "diabetes",     label: "Diabetes",     short: "D" },
  { key: "hypertension", label: "Hypertension", short: "H" },
  { key: "cvd",          label: "CVD",          short: "C" },
  { key: "ckd",          label: "Kidney",       short: "K" },
  { key: "stroke",       label: "Stroke",       short: "S" },
];

const SIZE = 320;
const R = 110;
const CENTER = SIZE / 2;

function position(i: number) {
  const angle = (Math.PI * 2 * i) / NODES.length - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * R,
    y: CENTER + Math.sin(angle) * R,
  };
}

const pulseSpeed: Record<RiskBand, number> = {
  low: 4.0,
  moderate: 3.0,
  high: 1.6,
  critical: 0.8,
};

const bandRing: Record<RiskBand, string> = {
  low: "var(--risk-low)",
  moderate: "var(--risk-mod)",
  high: "var(--risk-high)",
  critical: "var(--risk-crit)",
};

interface Props {
  scores: Record<ConditionKey, ConditionScore>;
  onSelect?: (k: ConditionKey) => void;
}

export function RiskConstellation({ scores, onSelect }: Props) {
  return (
    <div className="rounded-card bg-surface-sidebar border border-brand-primary/30 p-5 shadow-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-text-inverse">Risk Constellation</h3>
        <ConstellationLegend />
      </div>
      <div className="grid place-items-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-md h-auto">
          {/* connecting lines */}
          {NODES.map((n, i) => {
            const p = position(i);
            return (
              <line
                key={`l-${n.key}`}
                x1={CENTER} y1={CENTER} x2={p.x} y2={p.y}
                stroke="var(--brand-primary)" strokeOpacity={0.25} strokeWidth={1.5}
              />
            );
          })}
          {/* center label */}
          <circle cx={CENTER} cy={CENTER} r={26} fill="var(--brand-dark)" stroke="var(--brand-primary)" strokeOpacity={0.4} />
          <text x={CENTER} y={CENTER + 4} textAnchor="middle" className="font-mono" fill="var(--text-inverse)" fontSize="11">Nirog</text>

          {NODES.map((n, i) => {
            const s = scores[n.key];
            const p = position(i);
            const band = s?.band ?? "low";
            const speed = pulseSpeed[band];
            const color = `var(--condition-${n.key})`;
            return (
              <g
                key={n.key}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => onSelect?.(n.key)}
                style={{ cursor: onSelect ? "pointer" : "default" }}
              >
                <motion.circle
                  r={28}
                  fill="none"
                  stroke={bandRing[band]}
                  strokeWidth={2}
                  initial={{ opacity: 0.6, scale: 0.9 }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                  transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <circle r={22} fill={color} />
                <text textAnchor="middle" y={5} className="font-mono" fill="white" fontSize="14" fontWeight="600">
                  {n.short}
                </text>
                <text textAnchor="middle" y={48} className="font-display" fill="var(--text-inverse)" fontSize="11">
                  {n.label}
                </text>
                <text textAnchor="middle" y={62} className="font-mono" fill="var(--text-inverse)" opacity={0.7} fontSize="9">
                  {s?.stage ?? "—"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function ConstellationLegend() {
  const items: { label: string; var: string }[] = [
    { label: "low", var: "var(--risk-low)" },
    { label: "moderate", var: "var(--risk-mod)" },
    { label: "high", var: "var(--risk-high)" },
    { label: "critical", var: "var(--risk-crit)" },
  ];
  return (
    <div className="flex items-center gap-3 text-xs text-text-inverse/80">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: i.var }} />
          <span className={classNames("font-mono")}>{i.label}</span>
        </span>
      ))}
    </div>
  );
}
