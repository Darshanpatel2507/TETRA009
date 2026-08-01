import type { Config } from "tailwindcss";

/**
 * Nirog design tokens — kept in lockstep with src/styles/tokens.css.
 * Tailwind reads the same custom properties, so tokens.css remains the
 * single source of truth for the entire color/type/motion system.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        "brand-primary": "var(--brand-primary)",
        "brand-dark": "var(--brand-dark)",
        "brand-accent": "var(--brand-accent)",
        // Surfaces
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-sidebar": "var(--surface-sidebar)",
        // Text
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-inverse": "var(--text-inverse)",
        "text-muted": "var(--text-muted)",
        // Borders
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        // Risk (urgency)
        "risk-low": "var(--risk-low)",
        "risk-mod": "var(--risk-mod)",
        "risk-high": "var(--risk-high)",
        "risk-crit": "var(--risk-crit)",
        // Conditions
        "condition-diabetes": "var(--condition-diabetes)",
        "condition-hypertension": "var(--condition-hypertension)",
        "condition-cvd": "var(--condition-cvd)",
        "condition-ckd": "var(--condition-ckd)",
        "condition-stroke": "var(--condition-stroke)",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Tight numeric scale
        "num-xs": ["0.6875rem", { lineHeight: "1rem" }],
        "num-sm": ["0.75rem", { lineHeight: "1.1rem" }],
        "num-base": ["0.875rem", { lineHeight: "1.25rem" }],
        "num-lg": ["1rem", { lineHeight: "1.5rem" }],
        "num-xl": ["1.25rem", { lineHeight: "1.75rem" }],
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
      },
      transitionTimingFunction: {
        "out-soft": "var(--ease-out-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
