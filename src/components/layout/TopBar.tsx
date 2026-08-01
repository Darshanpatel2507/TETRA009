import { useLang } from "../../context/LanguageContext";
import { SahayakLogo } from "../ui/SahayakIcons";

export function TopBar() {
  const { t } = useLang();
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-[100] shadow-sm">
      <div className="flex items-center gap-3">
        <SahayakLogo size={34} className="md:hidden shadow-sm" />
        <span className="text-sm font-semibold text-text-primary">{t("app.tagline")}</span>
      </div>
      <div className="text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary px-3.5 py-1 rounded-full border border-brand-primary/20 shadow-sm flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
        Sahayak · Verified Health Rules & AI
      </div>
    </header>
  );
}
