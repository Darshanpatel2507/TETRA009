import { motion } from "framer-motion";
import { useState, ReactNode } from "react";
import { bandLabel, classNames } from "../../lib/utils/formatters";
import { getRecommendation } from "../../lib/riskEngine/recommendations";
import type { ConditionKey, ConditionScore, RiskBand } from "../../types";
import {
  IconBrain,
  IconHeart,
  IconBP,
  IconDiabetes,
  IconKidney,
  IconShield,
  IconUrgencyImmediate,
  IconInfo,
} from "../ui/SahayakIcons";

interface Props {
  scores: Record<ConditionKey, ConditionScore>;
  overallBand?: RiskBand;
  onSelect?: (k: ConditionKey) => void;
}

interface ConditionMeta {
  key: ConditionKey;
  title: string;
  icon: ReactNode;
  description: string;
  conditionName: string;
}

const CONDITIONS: ConditionMeta[] = [
  { key: "stroke", conditionName: "Stroke", title: "Brain & Stroke Alert (Cerebrovascular)", icon: <IconBrain size={24} />, description: "Checking nerve communication & facial symmetry" },
  { key: "cvd", conditionName: "CVD", title: "Heart & Blood Flow (CVD)", icon: <IconHeart size={24} />, description: "Checking circulatory resilience & cardiac workload" },
  { key: "hypertension", conditionName: "Hypertension", title: "Blood Pressure Strength (Hypertension)", icon: <IconBP size={24} />, description: "Checking vessel elasticity & resting pulse calmness" },
  { key: "diabetes", conditionName: "Diabetes", title: "Blood Sugar Balance (Diabetes)", icon: <IconDiabetes size={24} />, description: "Checking baseline energy & glucose regulation" },
  { key: "ckd", conditionName: "CKD", title: "Kidney Filtration Health (CKD)", icon: <IconKidney size={24} />, description: "Checking kidney waste filtration stability" },
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
      case "immediate":
        return {
          card: "bg-gradient-to-br from-red-950/85 via-[#291419] to-[#1C1014] border-red-500/70 hover:border-red-400 shadow-xl ring-1 ring-red-500/40",
          pill: "bg-red-500/30 text-red-200 border border-red-400/70 font-extrabold shadow-sm",
          bar: "bg-red-500",
          text: "text-red-200 font-bold",
        };
      case "high":
      case "firm":
      case "advanced":
        return {
          card: "bg-gradient-to-br from-amber-950/80 via-[#2A1F18] to-[#1E1612] border-amber-500/70 hover:border-amber-400 shadow-lg ring-1 ring-amber-500/40",
          pill: "bg-amber-500/30 text-amber-200 border border-amber-400/70 font-extrabold shadow-sm",
          bar: "bg-amber-400",
          text: "text-amber-200 font-semibold",
        };
      case "moderate":
      case "soft":
      case "mod":
        return {
          card: "bg-gradient-to-br from-amber-950/45 via-[#1E2D27] to-[#16231E] border-amber-400/50 hover:border-amber-400/80 shadow-md",
          pill: "bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold shadow-sm",
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
    <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] p-7 shadow-2xl text-white relative overflow-hidden transition-all duration-300 text-left">
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
            Comprehensive multi-vector clinical staging with concrete test deadlines and exact symptom proof matching
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#183630] px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-inner">
          <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">Patient Urgency:</span>
          <span className={classNames(
            "px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wide border shadow-md flex items-center gap-1.5 font-black",
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
          const scoreObj = scores[cond.key] || { band: "low", value: 0, stage: "No concerning readings or symptoms today" };
          const style = getBandStyles(scoreObj.band);
          const isSelected = selectedCondition === cond.key;
          const isCriticalOrHigh = scoreObj.band === "critical" || scoreObj.band === "high";
          const isLow = scoreObj.band === "low" || (scoreObj.band as string) === "none";

          // Calculate concrete deadline using recommendation engine
          const rec = getRecommendation(cond.conditionName, scoreObj.band);
          const displayStatus = bandLabel(scoreObj.band);

          // Build precision copy string with mandatory deadline & matched proofs
          const precisionCopy = isLow
            ? (scoreObj.stage && !scoreObj.stage.toLowerCase().includes("no concerning") ? `All Clear · ${scoreObj.stage}` : "No concerning readings or symptoms observed today")
            : `${rec.action} recommended ${rec.deadline} · Matches: ${scoreObj.stage || "Elevated clinical risk factors identified"}`;

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
              <div className={classNames("absolute top-0 left-0 right-0 h-[4px]", style.bar)} />

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#122622] border border-emerald-400/30 shadow-inner text-center text-emerald-300 shrink-0">
                      {cond.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white tracking-tight leading-snug font-sans">
                        {cond.title}
                      </h3>
                      <p className="text-[11px] text-emerald-200/70 mt-0.5 line-clamp-1 font-sans">
                        {cond.description}
                      </p>
                    </div>
                  </div>

                  <span className={classNames(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase border shrink-0 tracking-wider shadow-sm",
                    style.pill
                  )}>
                    {displayStatus}
                  </span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-emerald-500/20">
                  <div className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Clinical Action & Proof:</span>
                    {isCriticalOrHigh && (
                      <span className="text-red-300 flex items-center gap-1 font-extrabold">
                        <IconUrgencyImmediate size={14} className="text-red-400" /> Action: {rec.deadline}
                      </span>
                    )}
                  </div>
                  <div className={classNames("text-xs leading-relaxed font-sans", style.text, isCriticalOrHigh ? "text-xs font-bold text-amber-100" : "text-emerald-100 font-medium")}>
                    {cond.conditionName} — <strong className="underline text-white font-black">{displayStatus}</strong> · {precisionCopy}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-200/80 font-mono">
                <span>Diagnostic Metric Value:</span>
                <span className="font-bold text-white bg-[#122622] px-3 py-1 rounded-xl border border-emerald-400/40 shadow-sm">
                  {scoreObj.value ?? "Optimal"}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Action Feature Box in 6th grid spot */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1B3A33] via-[#1E433B] to-[#15302A] border border-emerald-400/40 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm mb-2 font-display">
              <IconShield size={20} className="text-emerald-400 shrink-0" />
              <span>Verified Health Rule Safety</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium font-sans">
              Every diagnostic warning score above is calculated directly using validated medical guidelines with concrete deadlines. Our AI assistant extracts structured descriptions without altering scores or setting tiers on its own.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-400/30 text-[11px] font-mono text-emerald-300 flex items-center justify-between font-extrabold">
            <span>RULE SAFETY</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono font-black">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED_RULES_ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Required Medical Screening Disclaimer & Tip */}
      <div className="mt-7 pt-5 border-t border-emerald-500/25 flex flex-col gap-2 relative z-10">
        <p className="text-[11px] font-sans font-semibold text-emerald-200/90 leading-relaxed flex items-start gap-2 bg-[#102420] p-3.5 rounded-xl border border-[#265349]">
          <IconInfo size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300 font-bold">Important Medical Disclaimer:</strong> Sahayak is a screening and referral-support tool designed to assist community health workers and households. It does not provide definitive medical diagnoses and does not predict exact dates of clinical events. Always seek accredited professional consultation for diagnostic testing.
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-between text-xs text-emerald-300/80 gap-2 font-mono pt-1">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Click any condition card above to view dedicated wellness guidance.</span>
          </span>
          <span className="font-semibold">Sahayak Clinical Engine · v2.1 (Precision Tiers)</span>
        </div>
      </div>
    </div>
  );
}

export function ConstellationLegend() {
  const items = [
    { label: "All Clear (Routine Safety)", bg: "bg-[#183630] text-emerald-200 border-emerald-400/40 font-semibold" },
    { label: "Needs Attention (Monitor)", bg: "bg-amber-500/20 text-amber-200 border-amber-400/50 font-semibold" },
    { label: "48 Hours (Priority Checkup)", bg: "bg-orange-500/20 text-orange-200 border-orange-400/50 font-bold" },
    { label: "Immediate (Emergency Action)", bg: "bg-red-500/25 text-red-200 border-red-400/60 font-extrabold" },
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
