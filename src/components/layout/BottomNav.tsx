import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { classNames } from "../../lib/utils/formatters";
import { IconHome, IconUser, IconDoctor, IconClipboard, IconHomeWellness } from "../ui/SahayakIcons";

const items = [
  { to: "/", labelKey: "nav.home", icon: <IconHome size={22} />, exact: true },
  { to: "/personal-health", labelKey: "nav.personalHealth", icon: <IconUser size={22} />, exact: false },
  { to: "/family-health", labelKey: "nav.familyHealth", icon: <IconHomeWellness size={22} />, exact: false },
  { to: "/dashboard", labelKey: "nav.dashboard", icon: <IconDoctor size={22} />, exact: false },
  { to: "/patient/intake", labelKey: "nav.intake", icon: <IconClipboard size={22} />, exact: false },
];

export function BottomNav() {
  const { t } = useLang();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border grid grid-cols-5 z-[100] shadow-lg">
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
            <span className="leading-none flex items-center justify-center">{n.icon}</span>
            <span className="truncate max-w-[72px] text-[10px]">{t(n.labelKey)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
