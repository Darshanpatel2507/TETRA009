import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { classNames } from "../../lib/utils/formatters";

const items = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: "▦" },
  { to: "/patient/intake", labelKey: "nav.intake", icon: "✚" },
];

export function BottomNav() {
  const { t } = useLang();
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border grid grid-cols-2 z-30">
      {items.map((n) => {
        const active = pathname === n.to || pathname.startsWith(n.to + "/");
        return (
          <NavLink
            key={n.to}
            to={n.to}
            className={classNames(
              "flex flex-col items-center justify-center gap-0.5 text-xs",
              active ? "text-brand-primary" : "text-text-secondary",
            )}
          >
            <span className="text-xl">{n.icon}</span>
            <span>{t(n.labelKey)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
