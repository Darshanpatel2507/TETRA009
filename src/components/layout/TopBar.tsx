import { useLang } from "../../context/LanguageContext";

export function TopBar() {
  const { t } = useLang();
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" alt="Nirog" className="h-9 w-9 rounded-lg md:hidden" />
        <span className="text-sm text-text-secondary">{t("app.tagline")}</span>
      </div>
      <div className="text-xs text-text-muted">v0.1 · Deterministic engine</div>
    </header>
  );
}
