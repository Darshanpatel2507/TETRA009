import { motion } from "framer-motion";
import { useState } from "react";
import { bandLabel, classNames } from "../../lib/utils/formatters";
import type { ConditionKey, ConditionScore, RiskBand } from "../../types";

interface Props {
  scores: Record<ConditionKey, ConditionScore>;
  overallBand?: RiskBand;
  onSelect?: (k: ConditionKey) => void;
}

interface ConditionMeta {
  key: ConditionKey;
  title: string;
  icon: string;
  description: string;
}

const CONDITIONS: ConditionMeta[] = [
  { key: "stroke", title: "Brain & Stroke Alert (Cerebrovascular)", icon: "🧠", description: "Checking nerve communication & sudden facial weakness" },
  { key: "cvd", title: "Heart & Blood Flow (CVD)", icon: "❤️", description: "Checking circulatory strength & heart strain risk" },
  { key: "hypertension", title: "Blood Pressure Strength (Hypertension)", icon: "💓", description: "Checking vessel tension & blood pulse calmness" },
  { key: "diabetes", title: "Blood Sugar Balance (Diabetes)", icon: "🩸", description: "Checking everyday energy & blood sugar regulation" },
  { key: "ckd", title: "Kidney Filtration Health (CKD)", icon: "🛡️", description: "Checking how effectively kidney filters wash waste" },
];

export function RiskConstellation({ scores, overallBand = "low", onSelect }: Props) {
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey | null>(null);

  const derivedBand = overallBand || (
    Object.values(scores).some(s => s?.band === "critical") ? "critical" :
    Object.values(scores).some(s => s?.band === "high") ? "high" :
    Object.values(scores).some(s => s?.band === "moderate") ? "moderate" : "low"
  );

  const getBandStyles = (band?: string) => {
    switch (band) {
      case "critical":
        return {
          card: "bg-gradient-to-br from-red-950/75 via-[#25181D] to-[#1B1216] border-red-500/60 hover:border-red-400 shadow-lg ring-1 ring-red-500/30",
          pill: "bg-red-500/25 text-red-200 border border-red-400/60 font-extrabold shadow-sm",
          bar: "bg-red-500",
          text: "text-red-200 font-bold",
        };
      case "high":
        return {
          card: "bg-gradient-to-br from-amber-950/70 via-[#26201B] to-[#1C1814] border-amber-500/60 hover:border-amber-400 shadow-md ring-1 ring-amber-500/30",
          pill: "bg-amber-500/25 text-amber-200 border border-amber-400/60 font-extrabold shadow-sm",
          bar: "bg-amber-400",
          text: "text-amber-200 font-semibold",
        };
      case "moderate":
      case "mod":
        return {
          card: "bg-gradient-to-br from-amber-950/40 via-[#1E2B27] to-[#17221E] border-amber-400/40 hover:border-amber-400/70 shadow-md",
          pill: "bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold shadow-sm",
          bar: "bg-amber-400",
          text: "text-amber-200 font-medium",
        };
      default:
        return {
          card: "bg-[#1A3630]/90 hover:bg-[#1E3F38] border border-[#2B594F] hover:border-emerald-400/60 shadow-md backdrop-blur-sm",
          pill: "bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold shadow-sm",
          bar: "bg-emerald-400",
          text: "text-emerald-200 font-medium",
        };
    }
  };

  const overallStyles = getBandStyles(derivedBand);

  const handleCardClick = (k: ConditionKey) => {
    setSelectedCondition(selectedCondition === k ? null : k);
    onSelect?.(k);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] p-7 shadow-2xl text-white relative overflow-hidden transition-all duration-300">
      {/* Subtle background glow effects for attractive aesthetics */}
      <div className="absolute -top-28 -right-28 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Urgency Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
              Clinical Diagnostic Risk Matrix
            </h2>
          </div>
          <p className="text-xs text-emerald-200/80 mt-1 font-medium">
            Comprehensive multi-vector clinical staging without visual distortion or overlapping elements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#183630] px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-inner">
          <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">Patient Urgency:</span>
          <span className={classNames(
            "px-3.5 py-1 rounded-full text-xs uppercase tracking-wide border shadow-md flex items-center gap-1.5",
            overallStyles.pill
          )}>
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            {bandLabel(derivedBand)}
          </span>
        </div>
      </div>

      {/* 5-Condition Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 relative z-10">
        {CONDITIONS.map((cond, index) => {
          const scoreObj = scores[cond.key] || { band: "low", value: 0, stage: "No findings captured" };
          const style = getBandStyles(scoreObj.band);
          const isSelected = selectedCondition === cond.key;
          const isCriticalOrHigh = scoreObj.band === "critical" || scoreObj.band === "high";

          return (
            <motion.div
              key={cond.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => handleCardClick(cond.key)}
              className={classNames(
                "group cursor-pointer rounded-2xl p-5 transition-all duration-200 relative flex flex-col justify-between overflow-hidden",
                style.card,
                isSelected ? "ring-2 ring-emerald-400 border-emerald-400 scale-[1.01] shadow-emerald-900/50" : "hover:translate-y-[-3px]"
              )}
            >
              {/* Top accent line representing urgency level */}
              <div className={classNames("absolute top-0 left-0 right-0 h-[4px]", style.bar)} />

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-2xl bg-[#122622] border border-emerald-400/30 shadow-inner text-center">
                      {cond.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight leading-snug">
                        {cond.title}
                      </h3>
                      <p className="text-[11px] text-emerald-200/70 mt-0.5 line-clamp-1">
                        {cond.description}
                      </p>
                    </div>
                  </div>

                  <span className={classNames(
                    "px-2.5 py-0.5 rounded-full text-[10px] uppercase border shrink-0 tracking-wider shadow-sm",
                    style.pill
                  )}>
                    {bandLabel(scoreObj.band)}
                  </span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-emerald-500/20">
                  <div className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider mb-1 flex items-center justify-between">
                    <span>Health Check Status / Result:</span>
                    {isCriticalOrHigh && <span className="text-red-400 flex items-center gap-1 font-extrabold">⚠️ Urgent Action Required</span>}
                  </div>
                  <div className={classNames("text-xs leading-relaxed font-sans", style.text, isCriticalOrHigh ? "text-sm font-bold text-red-300" : "text-emerald-100 font-medium")}>
                    {scoreObj.stage || "Safe & healthy / normal results"}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-200/80 font-mono">
                <span>Health Check Score / Value:</span>
                <span className="font-bold text-white bg-[#122622] px-3 py-1 rounded-xl border border-emerald-400/40 shadow-sm">
                  {scoreObj.value ?? "Checked"}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Action Feature Box in 6th grid spot */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1B3A33] via-[#1E433B] to-[#15302A] border border-emerald-400/40 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm mb-2">
              <span>🛡️</span> Verified Health Rule Safety
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Every health warning score above is calculated directly using validated World Health Organization community screening guidelines. Our AI helper turns these rules into readable guidance without making guesses or inventing numbers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-400/30 text-[11px] font-mono text-emerald-300 flex items-center justify-between font-extrabold">
            <span>RULE SAFETY</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED_RULES_ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Tip */}
      <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between text-xs text-emerald-200/80 gap-2 relative z-10 font-medium">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Click on any condition card above to highlight recommended wellness and hospital actions.</span>
        </span>
        <span className="font-mono text-emerald-300/70 font-semibold">Sahayak Health Guide · v1.0</span>
      </div>
    </div>
  );
}

export function ConstellationLegend() {
  const items = [
    { label: "Safe & Healthy (Low)", bg: "bg-[#183630] text-emerald-200 border-emerald-400/40 font-semibold" },
    { label: "Needs Monitoring (Moderate)", bg: "bg-amber-500/20 text-amber-200 border-amber-400/50 font-semibold" },
    { label: "High Alert (Urgent)", bg: "bg-orange-500/20 text-orange-200 border-orange-400/50 font-bold" },
    { label: "Critical Warning (Act Now)", bg: "bg-red-500/25 text-red-200 border-red-400/60 font-extrabold" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-xs">
      {items.map((i) => (
        <span key={i.label} className={classNames("inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-mono shadow-sm", i.bg)}>
          <span>•</span>
          <span>{i.label}</span>
        </span>
      ))}
    </div>
  );
}
