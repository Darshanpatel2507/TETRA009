import { motion, type HTMLMotionProps } from "framer-motion";
import { classNames } from "../../lib/utils/formatters";
import type { ReactNode } from "react";

interface Props extends HTMLMotionProps<"div"> {
  children: ReactNode;
  hover?: boolean;
  dark?: boolean; // constellation panel
}

export function Card({ children, hover, dark, className, ...rest }: Props) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={classNames(
        "rounded-card border",
        dark
          ? "bg-surface-sidebar border-brand-primary/30 text-text-inverse shadow-lift"
          : "bg-surface border-border text-text-primary shadow-card",
        className ?? "",
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
