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
          card: "bg-gradient-to-br from-red-950/70 via-[#131118] to-[#120F1A] border-red-500/80 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40",
          pill: "bg-red-500/25 text-red-300 border-red-500/60 font-black",
          bar: "bg-red-500",
          text: "text-red-300 font-bold",
        };
      case "high":
        return {
          card: "bg-gradient-to-br from-amber-950/60 via-[#131318] to-[#111115] border-amber-500/70 shadow-md shadow-amber-950/30 ring-1 ring-amber-500/30",
          pill: "bg-amber-500/25 text-amber-300 border-amber-500/60 font-extrabold",
          bar: "bg-amber-500",
          text: "text-amber-300 font-semibold",
        };
      case "moderate":
      case "mod":
        return {
          card: "bg-gradient-to-br from-yellow-950/40 via-[#111620] to-[#0E141C] border-yellow-500/50 shadow-sm",
          pill: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold",
          bar: "bg-yellow-500",
          text: "text-yellow-300 font-medium",
        };
      default:
        return {
          card: "bg-[#0B131E] border-[#1A2A3E] shadow-sm hover:border-[#28405E]",
          pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold",
          bar: "bg-emerald-500",
          text: "text-emerald-400 font-medium",
        };
    }
  };

  const overallStyles = getBandStyles(derivedBand);

  const handleCardClick = (k: ConditionKey) => {
    setSelectedCondition(selectedCondition === k ? null : k);
    onSelect?.(k);
  };

  return (
    <div className="rounded-2xl bg-[#08101A] border border-[#162436] p-6 shadow-xl text-slate-100 overflow-hidden">
      {/* Top Header & Urgency Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#18273A]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
            <h2 className="font-display text-xl font-black tracking-tight text-white">
              Clinical Diagnostic Risk Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive multi-vector clinical staging without visual distortion or overlapping elements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#0D1826] px-4 py-2.5 rounded-xl border border-[#1E3046] shadow-inner">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Patient Urgency:</span>
          <span className={classNames(
            "px-3 py-1 rounded-full text-xs uppercase tracking-wide border shadow-md flex items-center gap-1.5",
            overallStyles.pill
          )}>
            <span className="h-2 w-2 rounded-full bg-current animate-ping" />
            {bandLabel(derivedBand)}
          </span>
        </div>
      </div>

      {/* 5-Condition Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
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
                "group cursor-pointer rounded-xl p-5 border transition-all duration-200 relative flex flex-col justify-between overflow-hidden",
                style.card,
                isSelected ? "ring-2 ring-cyan-400 border-cyan-400 scale-[1.01]" : "hover:translate-y-[-2px]"
              )}
            >
              {/* Top accent line representing urgency level */}
              <div className={classNames("absolute top-0 left-0 right-0 h-[3px]", style.bar)} />

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                      {cond.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight leading-snug">
                        {cond.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
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

                <div className="mt-4 pt-3.5 border-t border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between">
                    <span>Health Check Status / Result:</span>
                    {isCriticalOrHigh && <span className="text-red-400 flex items-center gap-1">⚠️ Urgent Action Required</span>}
                  </div>
                  <div className={classNames("text-xs leading-relaxed font-sans", style.text, isCriticalOrHigh ? "text-sm text-red-200 font-semibold" : "text-slate-200")}>
                    {scoreObj.stage || "Safe & healthy / normal results"}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Health Check Score / Value:</span>
                <span className="font-bold text-white bg-black/30 px-2.5 py-1 rounded border border-white/10">
                  {scoreObj.value ?? "Checked"}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Action Feature Box in 6th grid spot */}
        <div className="rounded-xl p-5 border border-[#1E2E42] bg-[#0A1420] flex flex-col justify-between text-slate-300 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
              <span>🛡️</span> Verified Health Rule Safety
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every health warning score above is calculated directly using validated World Health Organization community screening guidelines. Our AI helper turns these rules into readable guidance without making guesses or inventing numbers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>RULE SAFETY</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED_RULES_ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Tip */}
      <div className="mt-6 pt-4 border-t border-[#182637] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Click on any condition card above to highlight recommended wellness and hospital actions.</span>
        </span>
        <span className="font-mono text-slate-500 font-medium">Sahayak Health Guide · v1.0</span>
      </div>
    </div>
  );
}

export function ConstellationLegend() {
  const items = [
    { label: "Safe & Healthy (Low)", color: "#10B981", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { label: "Needs Monitoring (Moderate)", color: "#F59E0B", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { label: "High Alert (Urgent)", color: "#EF4444", bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    { label: "Critical Warning (Act Now)", color: "#DC2626", bg: "bg-red-500/20 text-red-400 border-red-500/40 font-bold" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {items.map((i) => (
        <span key={i.label} className={classNames("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono", i.bg)}>
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} />
          <span>{i.label}</span>
        </span>
      ))}
    </div>
  );
}
