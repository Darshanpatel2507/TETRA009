/**
 * AIInsightCard — fetches Gemini narration + alert from narrate-risk.
 * The clinical band/action is set deterministically by the engine; Gemini
 * only rewrites the numbers into human-readable copy. Falls back to a
 * static local string if the call fails or no key is configured.
 */
import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";
import type { Assessment } from "../../types";

interface Props {
  assessment: Assessment;
}

interface NarrationResp {
  narration: string;
  alert: string;
  source: "gemini" | "fallback";
}

export function AIInsightCard({ assessment }: Props) {
  const { t, locale } = useLang();
  const [data, setData] = useState<NarrationResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrored(false);
    setData(null);
    (async () => {
      try {
        const { data: resp, error } = await supabase.functions.invoke("narrate-risk", {
          body: { assessment, lang: locale, apiKey: (import.meta as any).env?.GEMINI_API_KEY },
        });
        if (cancelled) return;
        if (error || !resp?.narration) {
          setErrored(true);
          setData({
            narration: t("ai.fallback"),
            alert: "",
            source: "fallback",
          });
        } else {
          setData(resp as NarrationResp);
        }
      } catch {
        if (!cancelled) {
          setErrored(true);
          setData({ narration: t("ai.fallback"), alert: "", source: "fallback" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [assessment, t, locale]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg">{t("breakdown.ai")}</h3>
        <span className="text-[10px] uppercase tracking-wide text-text-muted border border-border px-2 py-0.5 rounded-pill">
          AI-generated · band decided deterministically
        </span>
      </div>
      {loading && <p className="text-sm text-text-secondary">{t("ai.loading")}</p>}
      {!loading && data && (
        <>
          <p className="text-sm text-text-primary leading-relaxed">{data.narration}</p>
          {data.alert && (
            <p className="mt-3 text-sm font-medium text-brand-primary border-l-2 border-brand-primary pl-3">
              {data.alert}
            </p>
          )}
          {(errored || data.source === "fallback") && (
            <p className="mt-2 text-xs text-amber-500 font-medium">
              ⚠ Showing static fallback text (Gemini AI service unreachable or API key invalid).
            </p>
          )}
          <div className="mt-3">
            <Button size="sm" variant="ghost" onClick={() => {
              const text = `${data.narration}\n${data.alert}`.trim();
              navigator.clipboard?.writeText(text).catch(() => {});
            }}>Copy</Button>
          </div>
        </>
      )}
    </Card>
  );
}
