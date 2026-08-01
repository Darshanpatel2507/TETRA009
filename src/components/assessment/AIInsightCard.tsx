import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";
import type { Assessment } from "../../types";
import { bandLabel, classNames } from "../../lib/utils/formatters";

interface Props {
  assessment: Assessment;
}

interface StructuredInsight {
  executiveSummary: string;
  riskDrivers: string[];
  escalationProtocol: string;
  patientCounseling: string;
  source: "gemini-edge" | "gemini-client" | "clinical-synthesis";
}

function generateLocalStructuredSummary(assessment: Assessment, lang: string): StructuredInsight {
  const band = assessment.band.toUpperCase();
  const action = assessment.decision.action;
  const rationale = assessment.decision.rationale;
  const primarySpec = assessment.specialist?.primary || "General Medical Specialist";
  const secondarySpec = assessment.specialist?.secondary;

  // Extract all significant clinical drivers from scores & factors in clear words
  const conditionDrivers: string[] = [];
  Object.entries(assessment.scores || {}).forEach(([k, s]) => {
    if (s && s.band !== "low") {
      const easyTitle = k === "cvd" ? "Heart & Blood Flow (CVD)" : k === "ckd" ? "Kidney Filtration (CKD)" : k.toUpperCase();
      conditionDrivers.push(`${easyTitle}: ${s.stage} (Score Value: ${s.value || "Checked"} | Status: ${bandLabel(s.band)})`);
    }
  });
  if (conditionDrivers.length === 0 && assessment.factors) {
    assessment.factors.forEach(f => {
      if (f.weight > 0.3) {
        conditionDrivers.push(`${f.label}: ${f.value} (Verified Factor)`);
      }
    });
  }
  if ((assessment.gap_labs ?? []).length > 0) {
    conditionDrivers.push(`RECOMMENDED EXTRA TESTS: A complete health diagnosis requires lab test results for: ${(assessment.gap_labs ?? []).join(", ")}`);
  }
  if (conditionDrivers.length === 0) {
    conditionDrivers.push("All physical vitals and body screening numbers are currently safe, healthy, and within normal limits.");
  }

  if (lang === "hi") {
    return {
      executiveSummary: `आपके स्वास्थ्य परीक्षण का स्तर '${band}' है। हमारी चिकित्सा नियमावली के अनुसार अनुशंसित कदम: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `कृपया ${primarySpec}${secondarySpec ? ` तथा ${secondarySpec}` : ""} डॉक्टर से जांच कराएं। मुख्य कारण: ${rationale}`,
      patientCounseling: "रोगी को आराम दें और घबराहट से बचाएं। यदि कोई भी लक्षण (जैसे सांस फूलना या चक्कर आना) बढ़े तो तुरंत नजदीकी स्वास्थ्य केंद्र या अस्पताल ले जाएं।",
      source: "clinical-synthesis"
    };
  }

  if (lang === "gu") {
    return {
      executiveSummary: `તમારી આરોગ્ય તપાસનું સ્તર '${band}' છે. અમારી મેડિકલ માર્ગદર્શિકા મુજબ સૂચવેલ પગલાં: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `કૃપા કરીને ${primarySpec}${secondarySpec ? ` અને ${secondarySpec}` : ""} ડોક્ટરની સલાહ લો. મુખ્ય કારણ: ${rationale}`,
      patientCounseling: "દર્દીને આરામ આપો અને શાંત રાખો. જો શ્વાસ લેવામાં તકલીફ અથવા ચક્કર આવે તો તાત્કાલિક નજીકની હોસ્પિટલ પહોંચાડો.",
      source: "clinical-synthesis"
    };
  }

  return {
    executiveSummary: `Our tested medical health rules place this checkup in the ${band} urgency status. Based on verified community health guidelines, our recommended next step is: ${action}.`,
    riskDrivers: conditionDrivers,
    escalationProtocol: `We recommend consulting a specialist or hospital doctor in: ${primarySpec}${secondarySpec ? ` and ${secondarySpec}` : ""}. Why this visit helps: ${rationale}.`,
    patientCounseling: `Keep the patient calm, comfortable, and well-rested. Ensure someone stays close to observe basic signs like normal breathing and pulse. If symptoms cause discomfort, proceed to a medical clinic without hesitation.`,
    source: "clinical-synthesis"
  };
}

export function AIInsightCard({ assessment }: Props) {
  const { t, locale } = useLang();
  const [data, setData] = useState<StructuredInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    (async () => {
      try {
        const apiKey = (import.meta as any).env?.GEMINI_API_KEY || "";

        // 1. Try Supabase Edge Function first
        const { data: resp, error } = await supabase.functions.invoke("narrate-risk", {
          body: { assessment, lang: locale, apiKey },
        });
        if (cancelled) return;
        if (!error && resp?.executiveSummary) {
          setData({
            executiveSummary: resp.executiveSummary || resp.narration,
            riskDrivers: resp.riskDrivers || [resp.alert],
            escalationProtocol: resp.escalationProtocol || `Refer to ${assessment.specialist.primary}`,
            patientCounseling: resp.patientCounseling || "Keep patient calm and comfortable during transport.",
            source: resp.source === "gemini" ? "gemini-edge" : "clinical-synthesis",
          });
          setLoading(false);
          return;
        }

        // 2. Client-Side Gemini 2.0 API Direct Fallback with structured schema request
        if (apiKey) {
          const prompt = `Act as an expert, friendly Community Chief Medical diagnostic officer analyzing an assessment in a community healthcare setting. Patient checkup data: ${JSON.stringify(assessment)}.
Produce a helpful, organized 4-part health advice report in language '${locale}'.
CRITICAL: Use CLEAR, EVERYDAY LAYMAN LANGUAGE that ordinary citizens and families can comfortably understand without confusing hospital vocabulary or scary medical jargon.
Return ONLY valid JSON with exactly these fields:
{
  "executiveSummary": "A reassuring 2-sentence summary explaining overall health status in everyday layman terms.",
  "riskDrivers": ["Clear explanation of vital finding 1 in simple words", "Clear explanation of symptom or finding 2 in simple words"],
  "escalationProtocol": "Recommended specialist doctor or hospital visit with a reassuring explanation of why it will help.",
  "patientCounseling": "Immediate home care advice, comfort steps, and clear warning signs to watch for."
}`;
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });
          if (res.ok) {
            const json = await res.json();
            const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText && !cancelled) {
              const cleaned = rawText.replace(/```json|```/g, "").trim();
              const parsed = JSON.parse(cleaned);
              setData({
                executiveSummary: parsed.executiveSummary || "Health checkup review completed.",
                riskDrivers: Array.isArray(parsed.riskDrivers) ? parsed.riskDrivers : [String(parsed.riskDrivers || "Multiple health vital markers identified")],
                escalationProtocol: parsed.escalationProtocol || assessment.decision.action,
                patientCounseling: parsed.patientCounseling || "Keep patient resting comfortably.",
                source: "gemini-client"
              });
              setLoading(false);
              return;
            }
          }
        }

        // 3. Fall back to our local structured synthesizer in everyday words
        if (!cancelled) {
          setData(generateLocalStructuredSummary(assessment, locale));
        }
      } catch {
        if (!cancelled) {
          setData(generateLocalStructuredSummary(assessment, locale));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [assessment, t, locale]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* High-Contrast Clinical Command Center Styling */}
      <div className="rounded-2xl bg-[#091422] border border-[#192D44] shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between h-full">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#102339] via-[#142E4C] to-[#102339] px-6 py-4 border-b border-[#1E3754] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/60" />
            <h3 className="font-display text-lg font-black tracking-tight text-white">
              Sahayak Smart AI Health Guide & Advice
            </h3>
          </div>
          <span className={classNames(
            "text-[11px] font-mono font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5",
            data?.source.includes("gemini") 
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          )}>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
            {data?.source.includes("gemini") ? "SAHAYAK GEMINI AI GUIDE" : "VERIFIED SAHAYAK RULES v1.0"}
          </span>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center gap-4 py-8 text-sm text-cyan-300 animate-pulse font-mono">
              <span className="animate-spin text-2xl">⚡</span>
              <span>Sahayak AI is translating your health signals into clear, easy-to-read everyday guidance...</span>
            </div>
          ) : (
            data && (
              <div className="space-y-6">
                {/* Section 1: Executive Summary */}
                <div className="bg-[#0D1E32] p-4.5 rounded-xl border border-[#1C334E] shadow-inner">
                  <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5 mb-2">
                    <span>📋</span> General Health Summary
                  </div>
                  <p className="text-sm font-sans font-medium text-white leading-relaxed">
                    {data.executiveSummary}
                  </p>
                </div>

                {/* Section 2: Critical Risk Drivers & Vitals */}
                <div>
                  <div className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5 mb-2.5">
                    <span>⚠️</span> Key Health Findings & Warning Signs
                  </div>
                  <div className="space-y-2">
                    {data.riskDrivers.map((item, index) => (
                      <div key={index} className="bg-[#0D1826] px-4 py-2.5 rounded-lg border border-[#1B2F46] flex items-start gap-3 text-xs text-slate-200 font-medium">
                        <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3 & 4 Grid: Escalation Protocol & Patient Counseling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Escalation */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/40 to-[#0F1B2B] border border-red-500/40 flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5 mb-2">
                        <span>🏥</span> Recommended Hospital or Specialist Visits
                      </div>
                      <p className="text-xs text-red-100 font-medium leading-relaxed">
                        {data.escalationProtocol}
                      </p>
                    </div>
                  </div>

                  {/* Counseling / Stabilize */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-[#0E1A29] border border-emerald-500/40 flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5 mb-2">
                        <span>🏡</span> Immediate Home Care & Safety Steps
                      </div>
                      <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                        {data.patientCounseling}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Toolbar */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#182C43] text-xs text-slate-400">
                  <span className="font-mono text-[11px] flex items-center gap-1.5">
                    <span className="text-cyan-400">ℹ️</span> Urgency status calculated using World Health Organization guidelines (No AI guessing)
                  </span>
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => {
                      const reportText = `[SAHAYAK AI HEALTH REPORT]\n\nGENERAL HEALTH SUMMARY:\n${data.executiveSummary}\n\nKEY HEALTH FINDINGS:\n${data.riskDrivers.map(d => `• ${d}`).join("\n")}\n\nRECOMMENDED HOSPITAL OR SPECIALIST VISITS:\n${data.escalationProtocol}\n\nIMMEDIATE HOME CARE & SAFETY STEPS:\n${data.patientCounseling}`.trim();
                      navigator.clipboard?.writeText(reportText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }).catch(() => {});
                    }}
                    className="text-xs bg-[#162940] hover:bg-[#203957] text-cyan-300 border border-cyan-500/30 font-bold px-3 py-1.5"
                  >
                    {copied ? "✓ Copied Easy Health Report!" : "📋 Copy Sahayak Health Report"}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
