import { classNames } from "../../lib/utils/formatters";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: Props) {
  return (
    <label className="inline-flex items-center gap-3 select-none cursor-pointer">
      <span
        onClick={() => onChange(!checked)}
        className={classNames(
          "relative inline-block h-6 w-11 rounded-pill transition-colors",
          checked ? "bg-brand-primary" : "bg-border-strong",
        )}
      >
        <span
          className={classNames(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
