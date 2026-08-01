import { forwardRef } from "react";
import { classNames } from "../../lib/utils/formatters";
import type { SelectHTMLAttributes, ReactNode } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, hint, className, id, children, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="block mb-1.5 text-sm font-medium text-text-secondary">{label}</span>
      )}
      <select
        id={id ?? rest.name}
        ref={ref}
        className={classNames(
          "block w-full h-11 px-3 rounded-lg bg-surface border border-border text-text-primary",
          "focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30 outline-none",
          className ?? "",
        )}
        {...rest}
      >
        {children}
      </select>
      {hint && <span className="block mt-1 text-xs text-text-muted">{hint}</span>}
    </label>
  );
});
