/**
 * Lightweight Tailwind-only Button. No 21st.dev runtime copy needed —
 * the look is local and tokens-driven. Three variants + three sizes.
 */
import { motion, type HTMLMotionProps } from "framer-motion";
import { classNames } from "../../lib/utils/formatters";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-brand-primary text-text-inverse hover:bg-brand-accent",
  ghost:   "bg-transparent text-text-primary hover:bg-surface-muted border border-border",
  danger:  "bg-risk-crit text-text-inverse hover:opacity-90",
  subtle:  "bg-surface-muted text-text-primary hover:bg-border",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-11 px-4 text-base rounded-lg",
  lg: "h-12 px-5 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  loading,
  ...rest
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
      className={classNames(
        "inline-flex items-center justify-center gap-2 font-medium select-none",
        "min-h-[44px] focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className ?? "",
      )}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
      )}
      {icon}
      {children}
    </motion.button>
  );
}
