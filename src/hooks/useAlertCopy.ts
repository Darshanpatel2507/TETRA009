/**
 * useAlertCopy — fetch a localised alert one-liner from the
 * narrate-alert edge function. Used by the realtime dashboard hook
 * to give high/critical assessment toasts a personalised message
 * in the active language.
 *
 * Gracefully degrades to an empty string if the call fails; the
 * caller can then use a static fallback.
 */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLang } from "../context/LanguageContext";
import type { Assessment } from "../types";

export function useAlertCopy(assessment: Assessment | null) {
  const { locale } = useLang();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (!assessment) { setText(""); return; }
    setText("");
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("narrate-alert", {
          body: { assessment, lang: locale },
        });
        if (cancelled) return;
        if (!error && data?.text) setText(String(data.text));
      } catch {
        // silent — caller falls back
      }
    })();
    return () => { cancelled = true; };
  }, [assessment, locale]);

  return text;
}
