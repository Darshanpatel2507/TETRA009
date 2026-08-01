import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "../../lib/utils/formatters";

interface Props {
  visible: boolean;
  value?: string;
  onChange: (duration: string) => void;
  options?: string[];
}

const DEFAULT_DURATIONS = [
  "Started today",
  "Last few days",
  "About 1–4 weeks",
  "About 1–3 months",
  "Longer than 3 months",
  "Comes and goes"
];

export function DurationPicker({ visible, value = "Started today", onChange, options = DEFAULT_DURATIONS }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden w-full pt-1"
        >
          <div className="bg-surface p-3 rounded-2xl border border-border flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-primary">
              When did you first notice this?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {options.map((opt) => {
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={classNames(
                      "px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 border text-center shadow-2xs leading-tight break-words flex items-center justify-center min-h-[38px] cursor-pointer",
                      isSelected
                        ? "bg-brand-primary text-white font-black border-brand-primary shadow-sm"
                        : "bg-surface-elevated text-text-secondary border-border hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
