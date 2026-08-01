import { useState, type ReactNode } from "react";
import { classNames } from "../../lib/utils/formatters";

interface Props {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={classNames(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md",
            "bg-brand-dark text-text-inverse text-xs whitespace-nowrap shadow-card z-20",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
