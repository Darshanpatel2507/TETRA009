import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { classNames } from "../../lib/utils/formatters";

const items = [
  { to: "/", labelKey: "nav.home", icon: "🏠", exact: true },
  { to: "/my-health", labelKey: "nav.myHealth", icon: "👤", exact: false },
  { to: "/dashboard", labelKey: "nav.dashboard", icon: "🩺", exact: false },
  { to: "/patient/intake", labelKey: "nav.intake", icon: "✚", exact: false },
];

export function BottomNav() {
  const { t } = useLang();
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border grid grid-cols-4 z-[100] shadow-lg">
      {items.map((n) => {
        const active = n.exact ? pathname === n.to : (pathname === n.to || pathname.startsWith(n.to + "/"));
        return (
          <NavLink
            key={n.to}
            to={n.to}
            className={classNames(
              "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-all duration-200",
              active ? "text-brand-primary font-bold scale-105" : "text-text-secondary hover:text-text-primary",
            )}
          >
            <span className="text-xl leading-none">{n.icon}</span>
            <span className="truncate max-w-[72px] text-[10px]">{t(n.labelKey)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
