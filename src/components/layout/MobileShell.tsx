import { useState } from "react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { LanguagePill } from "./LanguagePill";
import { useLang } from "../../context/LanguageContext";

/**
 * Mobile shell — purpose-built, not a shrunk desktop layout.
 *   - Top splash header with logo + language
 *   - Single stacked main column
 *   - Bottom navigation bar (44px+ targets)
 *   - Safe-area insets for notched devices
 */
export function MobileShell({ children }: { children: ReactNode }) {
  const [showLang, setShowLang] = useState(false);
  const { t } = useLang();
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="bg-surface-sidebar text-text-inverse px-4 pt-5 pb-6 rounded-b-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Nirog" className="h-10 w-10 rounded-lg" />
            <div>
              <div className="font-display text-xl">{t("app.title")}</div>
              <div className="text-xs text-text-inverse/70">{t("app.tagline")}</div>
            </div>
          </div>
          <button
            onClick={() => setShowLang((s) => !s)}
            className="h-10 px-3 rounded-pill bg-brand-primary text-text-inverse text-sm"
            aria-label={t("lang.label")}
          >
            🌐
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
