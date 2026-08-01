import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { classNames } from "../../lib/utils/formatters";
import { LanguagePill } from "./LanguagePill";
import { useLang } from "../../context/LanguageContext";
import { SahayakLogo, IconHome, IconUser, IconDoctor, IconClipboard, IconHomeWellness } from "../ui/SahayakIcons";

const navItems = [
  { to: "/", labelKey: "nav.home", icon: <IconHome size={20} />, exact: true },
  { to: "/personal-health", labelKey: "nav.personalHealth", icon: <IconUser size={20} />, exact: false },
  { to: "/family-health", labelKey: "nav.familyHealth", icon: <IconHomeWellness size={20} />, exact: false },
  { to: "/dashboard", labelKey: "nav.dashboard", icon: <IconDoctor size={20} />, exact: false },
  { to: "/patient/intake", labelKey: "nav.intake", icon: <IconClipboard size={20} />, exact: false },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLang();
  const { pathname } = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="bg-surface-sidebar text-text-inverse h-screen sticky top-0 flex flex-col z-[200] shadow-xl text-left"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <SahayakLogo size={36} className="shrink-0 shadow-sm" />
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-display text-lg font-black tracking-tight">{t("app.title")}</div>
            <div className="text-[11px] text-text-inverse/70 line-clamp-1">{t("app.tagline")}</div>
          </div>
        )}
      </div>

      <nav className="mt-4 px-2.5 relative flex-1">
        <div className="text-[10px] font-bold tracking-wider text-text-inverse/50 uppercase px-3 mb-2">
          {!collapsed && "Portal Navigation"}
        </div>
        <ul className="flex flex-col gap-1.5 relative">
          {navItems.map((n) => {
            const active = n.exact ? pathname === n.to : (pathname === n.to || pathname.startsWith(n.to + "/"));
            return (
              <li key={n.to} className="relative">
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute inset-y-0 left-0 right-0 rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/30"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />
                )}
                <NavLink
                  to={n.to}
                  className={classNames(
                    "relative flex items-center gap-3.5 h-11 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    active ? "text-white font-bold" : "text-text-inverse/80 hover:text-white hover:bg-white/5",
                  )}
                >
                  <span className="w-6 text-center shrink-0 flex items-center justify-center">{n.icon}</span>
                  {!collapsed && <span className="truncate">{t(n.labelKey)}</span>}
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
