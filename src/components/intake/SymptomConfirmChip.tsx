import { motion } from "framer-motion";
import { IconCheck, IconUrgencyAttention, IconUrgencyImmediate } from "../ui/SahayakIcons";

interface Props {
  symptomLabel: string;
  isEmergency?: boolean;
  matchedPhrase?: string;
  onConfirm: () => void;
  onReject: () => void;
}

export function SymptomConfirmChip({ symptomLabel, isEmergency = false, matchedPhrase, onConfirm, onReject }: Props) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 5 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`p-5 rounded-3xl border shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left ${
        isEmergency
          ? "bg-amber-500/10 border-amber-500/40 text-text-primary"
          : "bg-surface-elevated border-border text-text-primary"
      }`}
    >
      <div className="flex items-start md:items-center gap-3.5 flex-1">
        <div className={`p-2.5 rounded-2xl shrink-0 border ${
          isEmergency ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-brand-primary/20 text-brand-primary border-brand-primary/30"
        }`}>
          {isEmergency ? <IconUrgencyImmediate size={24} /> : <IconUrgencyAttention size={24} className="text-amber-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isEmergency ? "bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-brand-primary/20 text-brand-primary"
            }`}>
              {isEmergency ? "Acute Symptom Confirmation Required" : "AI Symptom Match Suggestion"}
            </span>
          </div>
          <p className="text-sm md:text-base font-sans font-bold text-text-primary leading-snug">
            It sounds like you might be describing <span className={isEmergency ? "text-amber-600 dark:text-amber-400 underline font-black" : "text-brand-primary underline font-black"}>{symptomLabel}</span> — is that right?
          </p>
          {matchedPhrase && (
            <p className="text-xs text-text-secondary font-sans italic mt-1">
              Based on what you told us: "{matchedPhrase}"
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-0 border-border">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-surface hover:bg-surface-elevated text-text-secondary border border-border transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>✕</span> No, disagree
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 md:flex-initial px-5 py-2 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
            isEmergency
              ? "bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 font-black"
              : "bg-brand-primary hover:opacity-90 text-white border border-brand-primary font-black"
          }`}
        >
          <IconCheck size={16} className="text-current" /> Yes, add this
        </button>
      </div>
    </motion.div>
  );
}
