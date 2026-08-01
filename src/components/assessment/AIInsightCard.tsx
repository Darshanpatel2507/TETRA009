import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";
import type { Assessment } from "../../types";
import { bandLabel, classNames } from "../../lib/utils/formatters";
import { getRecommendation } from "../../lib/riskEngine/recommendations";
import {
  IconHospital,
  IconHomeWellness,
  IconSparkles,
  IconInfo,
  IconCheck,
  IconClipboard,
  IconUrgencyImmediate,
  IconUrgencyAttention,
  IconShield,
} from "../ui/SahayakIcons";

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

function generateDynamicHomeCare(assessment: Assessment, lang: string): string {
  const band = assessment.band.toLowerCase();
  const scores = assessment.scores || ({} as any);
  const hasDiabetes = scores.diabetes && scores.diabetes.band !== "low";
  const hasCvdOrBp = (scores.cvd && scores.cvd.band !== "low") || (scores.hypertension && scores.hypertension.band !== "low");
  const hasCkd = scores.ckd && scores.ckd.band !== "low";
  const hasStroke = scores.stroke && scores.stroke.band !== "low";

  if (band === "low" || band === "safe" || band === "none" || band === "routine") {
    if (lang === "hi") {
      return "[दैनिक स्वास्थ्य दिनचर्या]: आपके सभी मुख्य लक्षण और जांच अंक बिल्कुल सामान्य हैं! किसी अस्पताल उपचार की आवश्यकता नहीं है। पौष्टिक घरेलू भोजन लें, प्रतिदिन 30 मिनट टहलें, भरपूर पानी पिएं और 7-8 घंटे की पर्याप्त नींद लें।";
    }
    if (lang === "gu") {
      return "[દૈનિક સ્વાસ્થ્ય દინચર્યા]: તમારા તમામ મુખ્ય લક્ષણો અને રિપોર્ટ બિલકુલ સામાન્ય છે! કોઈ તાત્કાલિક સારવારની જરૂર નથી. પૌષ્ટિક ઘરનું જમવાનું લો, રોજ 30 મિનિટ ચાલો, પૂરતું પાણી પીઓ અને નિયમિત ઊંઘ લો.";
    }
    return "[Daily Wellness Routine — All Clear]: Since your checkup shows healthy baseline vitals, no acute home medical therapy is required. Continue enjoying balanced nutritious meals, maintain daily physical movement (such as a pleasant 30-minute walk), drink sufficient clean water, and secure 7–8 hours of restorative nightly sleep.";
  }

  if (band === "moderate" || band === "mod" || band === "soft") {
    if (hasDiabetes) {
      const rec = getRecommendation("Diabetes", band);
      return `[Dietary Balance & Glucose Care]: Moderate elevation in blood sugar markers noted. Reduce table sugar, sweets, and refined grains. Take gentle 20-minute post-meal walks to assist glucose absorption, and undergo a diagnostic ${rec.action} ${rec.deadline}.`;
    }
    if (hasCvdOrBp) {
      const rec = getRecommendation("Hypertension", band);
      return `[Calmed Circulation Protocol]: Slight blood pressure or heart workload elevation noted. Decrease table salt (sodium) and fried oily snacks. Practice relaxing deep-breathing exercises, and schedule a diagnostic ${rec.action} ${rec.deadline}.`;
    }
    if (hasCkd) {
      const rec = getRecommendation("CKD", band);
      return `[Fluid & Kidney Wellness]: Moderate kidney filtration alertness noted. Stay consistently hydrated with clean water and minimize unnecessary over-the-counter painkillers or overly salty snacks. Schedule a diagnostic ${rec.action} ${rec.deadline}.`;
    }
    return "[Gentle Lifestyle Adjustment]: Moderate health findings identified. Maintain a calm daily routine with home-cooked meals, reduce sodium and sugary treats, and book a general doctor check-up within 3 weeks.";
  }

  if (band === "high" || band === "firm" || band === "advanced" || band === "high alert") {
    if (hasStroke) {
      const rec = getRecommendation("Stroke", "firm");
      return `[Neurological Safety Protocol]: Warning markers for cerebrovascular strain observed. Keep the patient completely calm and comfortably seated in a safe posture. Do not allow intense physical lifting, and accompany them for a doctor vascular evaluation ${rec.deadline}.`;
    }
    return "[Active Pre-Consultation Care]: Noticeable symptom warning scores require proactive attention. Ensure the patient rests quietly in a clean, well-ventilated room, avoid laborious physical exhaustion, and coordinate a priority doctor consultation within 3 days.";
  }

  // Immediate / Critical
  return "[Immediate Emergency Comfort Protocol]: Acute vital warning flags require immediate hospital evaluation. Keep the patient completely calm and seated upright with plentiful fresh airflow. Do not force solid meals or fluids if experiencing dizziness or breathing effort. Provide constant reassurance while transporting immediately to the nearest medical emergency center.";
}

function generateLocalStructuredSummary(assessment: Assessment, lang: string): StructuredInsight {
  const action = assessment.decision.action;
  const rationale = assessment.decision.rationale;
  const primarySpec = assessment.specialist?.primary || "General Medical Specialist";
  const secondarySpec = assessment.specialist?.secondary;

  const conditionDrivers: string[] = [];
  Object.entries(assessment.scores || {}).forEach(([k, s]) => {
    if (s && s.band !== "low") {
      const conditionName = k === "cvd" ? "CVD" : k === "ckd" ? "CKD" : k.charAt(0).toUpperCase() + k.slice(1);
      const rec = getRecommendation(conditionName, s.band);
      conditionDrivers.push(`${conditionName}: ${s.stage} (Status: ${bandLabel(s.band)} | Required action: ${rec.action} recommended ${rec.deadline})`);
    }
  });
  if (conditionDrivers.length === 0 && assessment.factors) {
    assessment.factors.forEach(f => {
      if (f.weight > 0.3) {
        conditionDrivers.push(`${f.label}: ${f.value} (Verified Symptom Factor)`);
      }
    });
  }
  if ((assessment.gap_labs ?? []).length > 0) {
    conditionDrivers.push(`Recommended Diagnostic Testing: To complete your full health review, lab test screenings are advised for ${(assessment.gap_labs ?? []).join(", ")} within 3 weeks.`);
  }
  if (conditionDrivers.length === 0) {
    conditionDrivers.push("All physical checkup readings and symptom screening answers are optimal, healthy, and within safe baseline targets today.");
  }

  const dynamicCounseling = generateDynamicHomeCare(assessment, lang);

  if (lang === "hi") {
    return {
      executiveSummary: `आपके स्वास्थ्य परीक्षण का समग्र स्तर '${bandLabel(assessment.band)}' है। हमारी सत्यापित चिकित्सा नियमावली के अनुसार अगला अनुशंसित कदम: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `परामर्श मार्गदर्शन: कृपया ${primarySpec}${secondarySpec ? ` तथा ${secondarySpec}` : ""} डॉक्टर या नजदीकी केंद्र से तुरंत परामर्श लें। कारण: ${rationale}`,
      patientCounseling: dynamicCounseling,
      source: "clinical-synthesis",
    };
  }

  if (lang === "gu") {
    return {
      executiveSummary: `તમારી આરોગ્ય તપાસનું સમગ્ર સ્તર '${bandLabel(assessment.band)}' છે. અમારી મેડિકલ માર્ગદર્શિકા મુજબ સૂચવેલ પગલું: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `પરામર્શ માર્ગદર્શન: કૃપા કરીને ${primarySpec}${secondarySpec ? ` અને ${secondarySpec}` : ""} ડોક્ટર અથવા નજીકનું કેન્દ્ર સંપર્ક કરો. કારણ: ${rationale}`,
      patientCounseling: dynamicCounseling,
      source: "clinical-synthesis",
    };
  }

  return {
    executiveSummary: `Our validated medical equations classify this health checkup as '${bandLabel(assessment.band)}' status. Based on verified clinical triage protocols, our recommended immediate instruction is: ${action}.`,
    riskDrivers: conditionDrivers,
    escalationProtocol: `We advise coordinating a diagnostic examination with: ${primarySpec}${secondarySpec ? ` and ${secondarySpec}` : ""}. Clinical Rationale: ${rationale}.`,
    patientCounseling: dynamicCounseling,
    source: "clinical-synthesis",
  };
}

export function AIInsightCard({ assessment }: Props) {
  const { locale } = useLang();
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
        const localSummary = generateLocalStructuredSummary(assessment, locale);

        const { data: resp, error } = await supabase.functions.invoke("narrate-risk", {
          body: { assessment, lang: locale, apiKey },
        });
        if (cancelled) return;
        if (!error && resp?.executiveSummary) {
          setData({
            executiveSummary: resp.executiveSummary || resp.narration,
            riskDrivers: resp.riskDrivers || localSummary.riskDrivers,
            escalationProtocol: resp.escalationProtocol || localSummary.escalationProtocol,
            patientCounseling: resp.patientCounseling || localSummary.patientCounseling,
            source: resp.source === "gemini" ? "gemini-edge" : "clinical-synthesis",
          });
          setLoading(false);
          return;
        }

        if (apiKey) {
          const prompt = `Act as an expert, compassionate Chief Medical Diagnostic Officer examining this health checkup data: ${JSON.stringify(assessment)}.
Produce a helpful, structured 4-part health advisory guide in language '${locale}'.
CRITICAL RULES FOR ACCURACY AND TIMELINE PRECISION:
1. Use CLEAR EVERYDAY WORDS without confusing hospital terms. DO NOT use emojis anywhere in your response.
2. TIMELINE PRECISION: Every medical test or doctor visit recommendation MUST state a concrete deadline (for example 'within 2 weeks', 'within 3 days', or 'now'). Never use vague words like 'soon', 'when convenient', or 'sometime'.
3. TAILORED HOME CARE RULE: Do NOT generate alarming hospital transport advice if the status is All Clear / routine!
   - If All Clear / Safe: Recommend daily healthy nutrition, staying hydrated, 7-8 hours sleep, and 30-minute daily walking.
   - If Needs Attention: Recommend specific dietary modifications (lower sugar/salt) and relaxation techniques with concrete deadlines for checkups.
   - If 48 Hours or Immediate: Recommend quiet resting and immediate hospital evaluation.

Return ONLY valid JSON with exactly these fields:
{
  "executiveSummary": "A crisp, reassuring 2-sentence breakdown of overall urgency status and general health state in simple words without emojis.",
  "riskDrivers": ["Specific explanation of vital finding 1 in simple words with concrete testing deadlines", "Specific explanation of vital finding 2 or normal results"],
  "escalationProtocol": "Clear doctor specialty consultation recommendation explaining why the visit helps, including exact deadlines.",
  "patientCounseling": "Precise, customized home care and daily wellness routine tailored strictly to risk severity without emojis."
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
                executiveSummary: parsed.executiveSummary || localSummary.executiveSummary,
                riskDrivers: Array.isArray(parsed.riskDrivers) && parsed.riskDrivers.length > 0 ? parsed.riskDrivers : localSummary.riskDrivers,
                escalationProtocol: parsed.escalationProtocol || localSummary.escalationProtocol,
                patientCounseling: parsed.patientCounseling || localSummary.patientCounseling,
                source: "gemini-client",
              });
              setLoading(false);
              return;
            }
          }
        }

        if (!cancelled) {
          setData(localSummary);
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
  }, [assessment, locale]);

  const isLowRisk = assessment.band === "low";
  const isCritical = assessment.band === "critical" || assessment.band === "high";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="h-full">
      <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] shadow-2xl overflow-hidden text-white flex flex-col justify-between h-full relative transition-all duration-300">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="bg-[#16332D]/90 px-7 py-4.5 border-b border-[#265349] flex flex-wrap items-center justify-between gap-3 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <h3 className="font-display text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              <IconSparkles size={22} className="text-emerald-300" />
              <span>Sahayak Smart AI Health Guide & Advice</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-3.5 py-1 rounded-full border shadow-sm flex items-center gap-1.5 bg-emerald-500/25 text-emerald-200 border-emerald-400/50">
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              {data?.source.includes("gemini") ? "SAHAYAK GEMINI AI GUIDE" : "VERIFIED SAHAYAK RULES v2.1"}
            </span>
          </div>
        </div>

        <div className="p-7 relative z-10 flex-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-emerald-300 gap-4">
              <span className="animate-spin text-4xl font-mono">◎</span>
              <p className="text-sm font-semibold animate-pulse max-w-md">
                Sahayak AI is translating checkup scores into clean, everyday guidance with concrete timelines...
              </p>
            </div>
          ) : (
            data && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Section 1: General Diagnostic Summary */}
                  <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-inner backdrop-blur-sm mb-6">
                    <div className="text-xs uppercase font-extrabold text-emerald-300 tracking-wider flex items-center gap-2 mb-2 font-display">
                      <IconClipboard size={18} className="text-emerald-400 shrink-0" />
                      <span>General Health & Urgency Summary</span>
                    </div>
                    <p className="text-sm md:text-[15px] font-sans font-semibold text-white leading-relaxed text-left">
                      {data.executiveSummary}
                    </p>
                  </div>

                  {/* Section 2: Precision Vital Breakdown & Warning Markers */}
                  <div className="mb-6">
                    <div className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-2 mb-3 font-display">
                      <IconUrgencyAttention size={18} className="text-amber-400 shrink-0" />
                      <span>Precision Health Findings & Testing Deadlines</span>
                    </div>
                    <div className="space-y-2.5">
                      {data.riskDrivers.map((item, index) => (
                        <div key={index} className="bg-[#192E29]/90 px-5 py-3.5 rounded-xl border border-amber-400/30 flex items-start gap-3.5 text-xs text-amber-100 font-medium shadow-sm hover:border-amber-400/60 transition-colors text-left">
                          <span className="text-amber-400 font-black text-sm shrink-0 mt-0.5 font-mono">▪</span>
                          <span className="leading-relaxed flex-1 font-sans text-xs md:text-[13px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3 & 4 Grid: Aligned Doctor Consultation & Customized Home Care */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    <div className={classNames(
                      "p-6 rounded-2xl flex flex-col justify-between shadow-md border transition-all text-left",
                      isCritical ? "bg-gradient-to-br from-red-950/70 via-[#25171B] to-[#1C1215] border-red-500/60" : "bg-[#1A3630]/90 border-emerald-400/30"
                    )}>
                      <div>
                        <div className={classNames("text-xs uppercase font-extrabold tracking-wider flex items-center gap-2 mb-3 font-display", isCritical ? "text-red-300" : "text-cyan-300")}>
                          <IconHospital size={20} className="shrink-0" />
                          <span>Recommended Medical Consultation</span>
                        </div>
                        <p className={classNames("text-xs md:text-[13px] font-medium leading-relaxed font-sans", isCritical ? "text-red-100 font-semibold" : "text-emerald-50")}>
                          {data.escalationProtocol}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono opacity-80 flex items-center gap-1.5">
                        <span className="font-black">→</span>
                        <span>{isCritical ? "Urgent Medical Referral Advised" : "Routine Preventive Health Guidance"}</span>
                      </div>
                    </div>

                    <div className={classNames(
                      "p-6 rounded-2xl flex flex-col justify-between shadow-md border transition-all text-left",
                      isLowRisk ? "bg-gradient-to-br from-[#1A3630] via-[#1D423A] to-[#16302B] border-emerald-400/50" : isCritical ? "bg-gradient-to-br from-amber-950/60 via-[#281F1B] to-[#1D1714] border-amber-500/50" : "bg-[#1A3630]/90 border-emerald-400/40"
                    )}>
                      <div>
                        <div className={classNames("text-xs uppercase font-extrabold tracking-wider flex items-center gap-2 mb-3 font-display", isLowRisk ? "text-emerald-300" : isCritical ? "text-amber-300" : "text-emerald-300")}>
                          <IconHomeWellness size={20} className="shrink-0" />
                          <span>Customized Home Care & Wellness</span>
                        </div>
                        <p className="text-xs md:text-[13px] text-white font-medium leading-relaxed font-sans">
                          {data.patientCounseling}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono opacity-80 flex items-center justify-between">
                        <span>WELLNESS PROTOCOL STATUS</span>
                        <span className="font-bold text-emerald-300 flex items-center gap-1">
                          <IconCheck size={14} className="text-emerald-400" />
                          <span>{isLowRisk ? "SAFE DAILY ROUTINE" : "TAILORED TIMELINED CARE"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Toolbar */}
                <div className="flex flex-wrap items-center justify-between pt-5 border-t border-emerald-500/20 text-xs text-emerald-200/80 gap-4 font-medium mt-6">
                  <span className="font-mono text-[11px] flex items-center gap-2 text-emerald-300/90 font-semibold text-left">
                    <IconInfo size={16} className="text-emerald-400 shrink-0" />
                    <span>All recommendations enforce concrete testing deadlines without vague timing language.</span>
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const reportText = `[SAHAYAK AI HEALTH REPORT]\n\nGENERAL HEALTH SUMMARY:\n${data.executiveSummary}\n\nKEY HEALTH FINDINGS & DEADLINES:\n${data.riskDrivers.map(d => `• ${d}`).join("\n")}\n\nRECOMMENDED HOSPITAL VISITS & TIMELINE:\n${data.escalationProtocol}\n\nCUSTOMIZED HOME CARE & WELLNESS STEPS:\n${data.patientCounseling}`.trim();
                      navigator.clipboard?.writeText(reportText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }).catch(() => {});
                    }}
                    className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/30 border border-emerald-300/60 transition-all duration-200 shrink-0 flex items-center gap-2"
                  >
                    <IconClipboard size={16} />
                    <span>{copied ? "Copied Easy Health Report!" : "Copy Sahayak Health Report"}</span>
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
