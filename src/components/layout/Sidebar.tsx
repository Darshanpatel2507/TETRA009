/**
 * Desktop sidebar — dark navy-green, with a sliding indicator
 * that follows the active route. Collapses to icon-only.
 */
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { classNames } from "../../lib/utils/formatters";
import { LanguagePill } from "./LanguagePill";
import { useLang } from "../../context/LanguageContext";

const navItems = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: "▦" },
  { to: "/patient/intake", labelKey: "nav.intake", icon: "✚" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLang();
  const { pathname } = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="bg-surface-sidebar text-text-inverse h-screen sticky top-0 flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 h-16">
        <img src="/favicon.svg" alt="Nirog" className="h-9 w-9 rounded-lg shrink-0" />
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-display text-lg">{t("app.title")}</div>
            <div className="text-xs text-text-inverse/70">{t("app.tagline")}</div>
          </div>
        )}
      </div>

      <nav className="mt-2 px-2 relative flex-1">
        <ul className="flex flex-col gap-1 relative">
          {navItems.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <li key={n.to} className="relative">
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute inset-y-0 left-0 right-0 rounded-lg bg-brand-primary/15"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />
                )}
                <NavLink
                  to={n.to}
                  className={classNames(
                    "relative flex items-center gap-3 h-11 px-3 rounded-lg text-sm",
                    active ? "text-text-inverse" : "text-text-inverse/75 hover:text-text-inverse",
                  )}
                >
                  <span className="text-lg w-5 text-center">{n.icon}</span>
                  {!collapsed && <span>{t(n.labelKey)}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-brand-primary/20">
        {!collapsed && (
          <div className="mb-3">
            <LanguagePill />
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full text-xs text-text-inverse/70 hover:text-text-inverse h-9 rounded-md border border-brand-primary/20"
        >
          {collapsed ? "›" : "‹  collapse"}
        </button>
      </div>
    </motion.aside>
  );
}
