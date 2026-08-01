/**
 * Tabs — segmented control style. No Radix needed; one piece of state.
 */
import { classNames } from "../../lib/utils/formatters";

interface Tab {
  id: string;
  label: string;
}
interface Props {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: Props) {
  return (
    <div
      role="tablist"
      className={classNames(
        "inline-flex p-1 bg-surface-muted rounded-pill",
        className ?? "",
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={classNames(
              "px-3.5 h-9 rounded-pill text-sm transition-colors",
              active
                ? "bg-surface text-text-primary shadow-card"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
