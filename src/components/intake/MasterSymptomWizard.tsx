import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MASTER_SYMPTOM_TAXONOMY, 
  DURATION_OPTIONS, 
  type SymptomDuration 
} from "../../lib/taxonomy/masterSymptomTaxonomy";
import { 
  IconBrain, 
  IconDiabetes, 
  IconKidney, 
  IconHeart, 
  IconCheck, 
  IconUrgencyImmediate, 
  IconUrgencyAttention,
  IconSparkles
} from "../ui/SahayakIcons";
import { FreeTextSymptomInput } from "./FreeTextSymptomInput";
import { classNames } from "../../lib/utils/formatters";

interface Props {
  symptoms: Record<string, any>;
  onChange: (updatedSymptoms: Record<string, any>) => void;
  onFinish?: () => void;
  isEmbedded?: boolean;
}

export function MasterSymptomWizard({ symptoms, onChange, onFinish, isEmbedded = false }: Props) {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  const stages = [
    { id: 1 as const, title: "Step 1: Sudden Alert & Vitals", icon: <IconUrgencyImmediate size={18} className="text-emerald-500" />, subtitle: "Neurological & respiratory screening" },
    { id: 2 as const, title: "Step 2: Energy & Sugar", icon: <IconDiabetes size={18} className="text-amber-500" />, subtitle: "Fatigue, thirst, & metabolic balance" },
    { id: 3 as const, title: "Step 3: Kidney & Fluids", icon: <IconKidney size={18} className="text-cyan-500" />, subtitle: "Swelling, urine changes, & cramps" },
    { id: 4 as const, title: "Step 4: Heart & Circulation", icon: <IconHeart size={18} className="text-blue-500" />, subtitle: "Chest rhythm, BP & sleep habits" },
    { id: 5 as const, title: "Step 5: Open Voice Notes", icon: <IconSparkles size={18} className="text-indigo-500" />, subtitle: "Describe any unlisted thoughts" },
  ];

  function toggleSymptom(id: string) {
    const isNowActive = !symptoms[id];
    const newDurations = { ...(symptoms.durations || {}) };
    if (!isNowActive) {
      delete newDurations[id];
    } else if (!newDurations[id]) {
      newDurations[id] = "Started today"; // default duration
    }
    onChange({
      ...symptoms,
      [id]: isNowActive,
      durations: newDurations,
    });
  }

  function setDuration(id: string, duration: SymptomDuration) {
    onChange({
      ...symptoms,
      durations: {
        ...(symptoms.durations || {}),
        [id]: duration,
      },
    });
  }

  function handleAddFreeTextSymptom(id: string, duration = "Started today") {
    onChange({
      ...symptoms,
      [id]: true,
      durations: {
        ...(symptoms.durations || {}),
        [id]: duration,
      },
    });
  }

  function handleAddUnclassified(verbatim: string) {
    const existing = symptoms.unclassified_notes || [];
    onChange({
      ...symptoms,
      unclassified_notes: [...existing, verbatim],
    });
  }

  const currentSymptoms = MASTER_SYMPTOM_TAXONOMY.filter((s) => s.stage === activeStage);

  return (
    <div className={classNames(
      "rounded-3xl border border-border bg-surface shadow-md text-text-primary transition-all font-sans text-left",
      isEmbedded ? "p-4 md:p-6" : "p-6 md:p-8"
    )}>
      {/* Stage Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border/60">
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          const stageSymptoms = MASTER_SYMPTOM_TAXONOMY.filter((s) => s.stage === stage.id);
          const activeCount = stageSymptoms.filter((s) => symptoms[s.id]).length + (stage.id === 5 ? (symptoms.unclassified_notes?.length || 0) : 0);

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={classNames(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs md:text-sm font-bold transition-all shadow-sm cursor-pointer",
                isActive
                  ? "bg-brand-primary/15 text-brand-primary border-brand-primary shadow-sm font-black ring-1 ring-brand-primary/30"
                  : "bg-surface-elevated text-text-secondary border-border/80 hover:bg-surface hover:text-text-primary hover:border-brand-primary/40"
              )}
            >
              <span>{stage.icon}</span>
              <span className="truncate max-w-[140px] sm:max-w-none">{stage.title}</span>
              {activeCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black font-mono">
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stage Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-extrabold text-text-primary flex items-center gap-2 tracking-tight">
            <span>{stages[activeStage - 1].icon}</span>
            <span>{stages[activeStage - 1].title} — {stages[activeStage - 1].subtitle}</span>
          </h3>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            {activeStage === 5 
              ? "Speak or type any uncommon feelings or concerns in your own words. Our AI will align them or highlight them directly for doctor review." 
              : "Select any symptoms experienced by this member, then choose how long it has been noticeable to calibrate health guidance."}
          </p>
        </div>
      </div>

      {/* Stage Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="space-y-4"
        >
          {activeStage <= 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentSymptoms.map((sym) => {
                const isChecked = !!symptoms[sym.id];
                const selectedDuration = (symptoms.durations?.[sym.id] || "Started today") as SymptomDuration;

                return (
                  <div
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    className={classNames(
                      "rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between shadow-sm",
                      isChecked
                        ? "bg-brand-primary/10 border-brand-primary shadow-sm ring-1 ring-brand-primary/20"
                        : "bg-surface-elevated/70 border-border hover:border-brand-primary/50 hover:bg-surface"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {sym.conditionNames.map((cond, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-surface border border-border text-text-secondary shadow-2xs"
                            >
                              {cond}
                            </span>
                          ))}
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSymptom(sym.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 rounded border-border bg-surface text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                        />
                      </div>
                      <p className="text-sm md:text-base font-bold text-text-primary leading-relaxed">
                        {sym.question}
                      </p>
                    </div>

                    {/* Duration Picker when Checked */}
                    {isChecked && (
                      <div 
                        className="mt-5 pt-3 border-t border-border/70 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-xs font-bold text-text-primary mb-2 flex items-center gap-1.5">
                          <IconCheck size={14} className="text-brand-primary" />
                          <span>How long has this been occurring?</span>
                        </p>
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                          {DURATION_OPTIONS.map((dur) => {
                            const isDurSelected = selectedDuration === dur;
                            return (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setDuration(sym.id, dur)}
                                className={classNames(
                                  "px-2.5 py-2 rounded-xl text-[11px] md:text-xs font-bold text-center border transition-all cursor-pointer leading-tight break-words flex items-center justify-center min-h-[38px] shadow-2xs",
                                  isDurSelected
                                    ? "bg-brand-primary text-white border-brand-primary shadow-sm font-black"
                                    : "bg-surface text-text-secondary border-border hover:bg-surface-elevated hover:text-text-primary"
                                )}
                              >
                                {dur}
                              </button>
                            );
                          })}
                        </div>
                        {sym.isEmergency && (
                          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-3 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-center gap-2">
                            <IconUrgencyAttention size={16} className="shrink-0 text-amber-500" />
                            <span>Note: Positive response here will prompt priority diagnostic guidance in your checkup report.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeStage === 5 && (
            <div className="space-y-6">
              <FreeTextSymptomInput
                onSymptomAdd={handleAddFreeTextSymptom}
                onUnclassifiedAdd={handleAddUnclassified}
              />

              {symptoms.unclassified_notes && symptoms.unclassified_notes.length > 0 && (
                <div className="p-5 rounded-2xl bg-surface-elevated border border-border text-text-primary shadow-inner">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 mb-2">
                    <IconUrgencyAttention size={16} className="text-brand-primary" />
                    <span>Noted For Healthcare Worker & Doctor Review ({symptoms.unclassified_notes.length})</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-text-secondary">
                    {symptoms.unclassified_notes.map((note: string, idx: number) => (
                      <li key={idx} className="font-medium text-text-primary">"{note}"</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-text-muted mt-3 font-medium">
                    * These descriptions are included in your referral documentation so your consulting specialist or doctor can review them during your visit.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
        <button
          type="button"
          disabled={activeStage === 1}
          onClick={() => setActiveStage((prev) => (Math.max(1, prev - 1) as any))}
          className="px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold bg-surface-elevated hover:bg-surface text-text-primary border border-border transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shadow-sm"
        >
          ← Previous Step
        </button>

        <div className="flex items-center gap-3">
          {activeStage < 5 ? (
            <button
              type="button"
              onClick={() => setActiveStage((prev) => (Math.min(5, prev + 1) as any))}
              className="px-6 py-2.5 rounded-2xl text-xs md:text-sm font-extrabold bg-brand-primary hover:opacity-90 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next Step →</span>
            </button>
          ) : (
            onFinish && (
              <button
                type="button"
                onClick={onFinish}
                className="px-6 py-2.5 rounded-2xl text-xs md:text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <IconCheck size={18} />
                <span>Complete Symptom Screening</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
