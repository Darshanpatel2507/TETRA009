/**
 * Language context — drives all UI copy. Three locales: en, hi, gu.
 * Falls back to the key if a translation is missing.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "../types";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import gu from "../i18n/gu.json";

type Dict = Record<string, string>;
const DICTS: Record<Locale, Dict> = { en, hi, gu };

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = typeof window !== "undefined" ? (window.localStorage.getItem("sahayak.locale") || window.localStorage.getItem("nirog.locale")) : null;
    return (saved as Locale) || "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { window.localStorage.setItem("sahayak.locale", l); } catch {}
  }, []);

  const t = useCallback((key: string, fallback?: string) => {
    return DICTS[locale][key] ?? DICTS.en[key] ?? fallback ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageCtx);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}
