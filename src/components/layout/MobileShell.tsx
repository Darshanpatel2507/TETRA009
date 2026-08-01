import { useState } from "react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { LanguagePill } from "./LanguagePill";
import { useLang } from "../../context/LanguageContext";
import { SahayakLogo } from "../ui/SahayakIcons";

export function MobileShell({ children }: { children: ReactNode }) {
  const [showLang, setShowLang] = useState(false);
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-left">
      <header className="bg-surface-sidebar text-text-inverse px-4 pt-5 pb-6 rounded-b-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SahayakLogo size={40} className="shadow-md shrink-0" />
            <div>
              <div className="font-display text-xl font-bold">{t("app.title")}</div>
              <div className="text-xs text-text-inverse/70">{t("app.tagline")}</div>
            </div>
          </div>
          <button
            onClick={() => setShowLang((s) => !s)}
            className="h-9 px-3 rounded-pill bg-brand-primary/20 text-brand-primary text-xs font-mono font-bold border border-brand-primary/40 flex items-center gap-1"
            aria-label={t("lang.label")}
          >
            <span>LANG</span>
            <span>▾</span>
          </button>
        </div>
        {showLang && (
          <div className="mt-4">
            <LanguagePill />
          </div>
        )}
      </header>

      <main className="flex-1 px-4 py-4 pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
