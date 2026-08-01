import { forwardRef } from "react";
import { classNames } from "../../lib/utils/formatters";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <label className="block">
      {label && (
        <span className="block mb-1.5 text-sm font-medium text-text-secondary">{label}</span>
      )}
      <input
        id={inputId}
        ref={ref}
        className={classNames(
          "block w-full h-11 px-3 rounded-lg bg-surface border border-border text-text-primary",
          "placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30",
          "outline-none transition-colors",
          className ?? "",
        )}
        {...rest}
      />
      {hint && <span className="block mt-1 text-xs text-text-muted">{hint}</span>}
      {error && <span className="block mt-1 text-xs text-risk-crit">{error}</span>}
    </label>
  );
});
