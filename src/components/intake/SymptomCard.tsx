import { ReactNode } from "react";
import { motion } from "framer-motion";
import { DurationPicker } from "./DurationPicker";
import { IconCheck, IconSparkles } from "../ui/SahayakIcons";
import { classNames } from "../../lib/utils/formatters";

export interface SymptomItem {
  id: string;
  label: string;
  subLabel?: string;
  icon: ReactNode;
}

interface Props {
  title: string;
  description: string;
  items: SymptomItem[];
  values: Record<string, boolean>;
  durations: Record<string, string>;
  onToggle: (id: string, nextState: boolean) => void;
  onDurationChange: (id: string, duration: string) => void;
  isUrgentCard?: boolean;
  encouragingMessage?: string;
}

export function SymptomCard({
  title,
  description,
  items,
  values,
  durations,
  onToggle,
  onDurationChange,
  isUrgentCard = false,
  encouragingMessage,
}: Props) {
  const hasSelectedAny = items.some((item) => values[item.id]);

  return (
    <div className={classNames(
      "p-6 md:p-8 rounded-3xl border shadow-lg transition-all duration-300 relative overflow-hidden text-left bg-surface",
      isUrgentCard
        ? "border-amber-500/40 shadow-sm"
        : "border-border shadow-sm"
    )}>
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className={classNames(
              "font-display text-xl md:text-2xl font-bold tracking-tight text-text-primary"
            )}>
              {title}
            </h3>
            {hasSelectedAny && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={classNames(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border",
                  isUrgentCard ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" : "bg-brand-primary/15 text-brand-primary border-brand-primary/30"
                )}
              >
                <IconCheck size={13} className="text-current shrink-0" />
                Noted
              </motion.span>
            )}
          </div>
          <p className="text-xs md:text-sm text-text-secondary font-medium mt-1 font-sans">
            {description}
          </p>
        </div>
        {encouragingMessage && (
          <div className="bg-surface-elevated border border-border px-3.5 py-1.5 rounded-2xl text-[11px] font-semibold text-brand-primary flex items-center gap-1.5 shadow-2xs">
            <IconSparkles size={14} className="text-brand-primary shrink-0" />
            <span>{encouragingMessage}</span>
          </div>
        )}
      </div>

      {/* Question Items Flow */}
      <div className="space-y-4">
        {items.map((item) => {
          const isYes = Boolean(values[item.id]);
          const durationVal = durations[item.id] || "Started today";

          return (
            <motion.div
              key={item.id}
              layout
              className={classNames(
                "p-4 md:p-5 rounded-2xl border transition-all duration-200",
                isYes
                  ? isUrgentCard
                    ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
                    : "bg-brand-primary/10 border-brand-primary/40 shadow-sm"
                  : "bg-surface-elevated border-border hover:border-border/80"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1">
                  <div className={classNames(
                    "p-3 rounded-xl shrink-0 border transition-colors",
                    isYes
                      ? isUrgentCard ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-brand-primary/20 text-brand-primary border-brand-primary/30"
                      : "bg-surface text-text-secondary border-border"
                  )}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-extrabold text-text-primary leading-snug font-sans">
                      {item.label}
                    </h4>
                    {item.subLabel && (
                      <p className="text-xs text-text-secondary font-medium mt-0.5 font-sans">
                        {item.subLabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gentle scale-down/up toggle switch micro-interaction */}
                <div className="flex items-center gap-1.5 bg-surface p-1.5 rounded-2xl border border-border shrink-0 shadow-inner">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onToggle(item.id, false)}
                    className={classNames(
                      "px-4 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer",
                      !isYes
                        ? "bg-surface-elevated text-text-primary font-black shadow-sm border border-border"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    No
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onToggle(item.id, true)}
                    className={classNames(
                      "px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer",
                      isYes
                        ? isUrgentCard
                          ? "bg-amber-600 hover:bg-amber-500 text-white shadow-sm font-black"
                          : "bg-brand-primary text-white shadow-sm font-black hover:opacity-90"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    Yes
                  </motion.button>
                </div>
              </div>

              {/* Animated Duration Expansion */}
              <DurationPicker
                visible={isYes}
                value={durationVal}
                onChange={(d) => onDurationChange(item.id, d)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
