import { motion } from "framer-motion";
import { classNames } from "../../lib/utils/formatters";
import type { ReactNode } from "react";

interface Step {
  id: string;
  label: string;
}

interface Props {
  steps: Step[];
  current: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
}

export function Stepper({ steps, current, children }: Props) {
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <div>
      <ol className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={s.id} className="flex items-center gap-2 flex-1">
              <motion.div
                layout
                className={classNames(
                  "h-8 w-8 rounded-full grid place-items-center text-sm font-mono",
                  done && "bg-brand-primary text-text-inverse",
                  active && "bg-brand-dark text-text-inverse",
                  !done && !active && "bg-surface-muted text-text-muted",
                )}
              >
                {i + 1}
              </motion.div>
              <span className={classNames(
                "text-sm",
                active ? "text-text-primary font-medium" : "text-text-secondary",
              )}>{s.label}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-border ml-2" />
              )}
            </li>
          );
        })}
      </ol>
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
