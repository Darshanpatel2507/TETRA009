import { useLang } from "../../context/LanguageContext";
import { classNames } from "../../lib/utils/formatters";

const locales = [
  { id: "en", label: "EN" },
  { id: "hi", label: "हि" },
  { id: "gu", label: "ગુ" },
] as const;

export function LanguagePill() {
  const { locale, setLocale, t } = useLang();
  return (
    <div className="flex items-center gap-1 p-1 rounded-pill bg-brand-dark/40 border border-brand-primary/20">
      <span className="text-[10px] uppercase tracking-wide text-text-inverse/60 px-2">{t("lang.label")}</span>
      {locales.map((l) => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          className={classNames(
            "h-7 px-2.5 rounded-pill text-xs font-medium",
            locale === l.id ? "bg-brand-primary text-text-inverse" : "text-text-inverse/70 hover:text-text-inverse",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
