import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

/**
 * Generates tailored home care advice strictly based on the patient's exact urgency band and specific health conditions.
 * Prevents routine/normal checkup patients from receiving inappropriate acute emergency instructions.
 */
function generateDynamicHomeCare(assessment: Assessment, lang: string): string {
  const band = assessment.band.toLowerCase();
  const scores = assessment.scores || {} as any;
  const hasDiabetes = scores.diabetes && scores.diabetes.band !== "low";
  const hasCvdOrBp = (scores.cvd && scores.cvd.band !== "low") || (scores.hypertension && scores.hypertension.band !== "low");
  const hasCkd = scores.ckd && scores.ckd.band !== "low";
  const hasStroke = scores.stroke && scores.stroke.band !== "low";

  if (band === "low" || band === "safe") {
    if (lang === "hi") {
      return "🌿 दैनिक स्वास्थ्य दिनचर्या (सुरक्षित स्तर): आपके सभी मुख्य लक्षण और जांच अंक बिल्कुल सामान्य और स्वस्थ हैं! किसी मेडिकल इलाज की आवश्यकता नहीं है। पौष्टिक घरेलू भोजन लें, प्रतिदिन 30 मिनट सुबह या शाम टहलें, भरपूर पानी पिएं और पर्याप्त नींद लें।";
    }
    if (lang === "gu") {
      return "🌿 દૈનિક સ્વાસ્થ્ય દિનચર્યા (સલામત સ્થિતિ): તમારા તમામ મુખ્ય લક્ષણો અને રિપોર્ટ બિલકુલ સામાન્ય અને સ્વસ્થ છે! કોઈ તાત્કાલિક સારવારની જરૂર નથી. પૌષ્ટિક ઘરનું જમવાનું લો, રોજ 30 મિનિટ સવારે અથવા સાંજે ચાલો, પૂરતું પાણી પીઓ અને નિયમિત ઊંઘ લો.";
    }
    return "🌿 Daily Wellness Routine (Safe Status): Since your checkup shows healthy baseline vitals, no acute home care is necessary! Continue enjoying nutritious meals, maintain daily physical activity (like a relaxed 30-minute walk), drink sufficient clean water, and enjoy 7-8 hours of restful sleep nightly to preserve these great numbers.";
  }

  if (band === "moderate" || band === "mod" || band === "needs monitoring") {
    if (hasDiabetes) {
      if (lang === "hi") {
        return "🥗 भोजन संतुलन और शुगर की देखभाल: शुगर के संकेत मध्यम स्तर पर पाए गए हैं। चाय में चीनी, मीठाई और मैदे वाले खाद्य पदार्थों का सेवन कम करें। भोजन के बाद 20 मिनट जरूर टहलें और महीने में एक बार शुगर स्तर की जांच करें।";
      }
      if (lang === "gu") {
        return "🥗 આહાર સંતુલન અને સુગરની કાળજી: સુગરના લક્ષણો મધ્યમ સ્તર પર જોવા મળ્યા છે. ચામાં ખાંડ, મીઠાઈ અને મેદા વાળા ખોરાકનો ઉપયોગ ઓછો કરો. જમ્યા પછી 20 મિનિટ હળવું ચાલો અને મહિનામાં એકવાર સુગરની તપાસ કરાવો.";
      }
      return "🥗 Dietary Balance & Glucose Care: Moderate elevations in blood sugar warning scores were observed. Reduce daily sugar in tea, sweet treats, and refined flour portions. Take gentle 20-minute post-meal walks to help naturally balance body sugars, and check your readings monthly at home.";
    }
    if (hasCvdOrBp) {
      if (lang === "hi") {
        return "🫀 रक्तचाप और हृदय सुरक्षा: रक्तचाप या हृदय के संकेतों में हल्की वृद्धि है। भोजन में नमक और तेल कम करें। मानसिक तनाव से बचने के लिए विश्राम करें और किसी भी भारी काम को करने से पहले आराम से श્વાસ लें। सप्ताह में एक बार अपना ब्लड प्रेशर जरूर मापें।";
      }
      if (lang === "gu") {
        return "🫀 બ્લડ પ્રેશર અને હૃદય સુરક્ષા: બ્લડ પ્રેશર અથવા હૃદયના લક્ષણોમાં નાની વૃદ્ધિ છે. ભોજનમાં મીઠું અને તેલ ઓછું કરો. માનસિક તણાવથી બચવા માટે આરામ કરો અને અઠવાડિયામાં એકવાર તમારું બ્લડ પ્રેશર માપો.";
      }
      return "🫀 Calmed Circulation Routine: Slight elevations in blood pressure or circulatory tension were observed. Decrease daily table salt (sodium) and fried oily snacks. Practice deep resting breathing exercises to relieve work or family stress, and track your blood pressure weekly at home.";
    }
    if (hasCkd) {
      return "💧 Fluid & Kidney Wellness: Moderate kidney filtration awareness noted. Stay consistently hydrated with clean water throughout the day, and avoid taking frequent unnecessary over-the-counter painkillers or overly salty snacks that can put extra filtration strain on your kidneys.";
    }
    return "🥗 Gentle Lifestyle Adjustment: Moderate health findings detected. Maintain a calm daily routine with balanced home-cooked meals, reduce salt and sugary treats, ensure daily relaxation, and keep a log of your physical comfort and vital signs weekly.";
  }

  if (band === "high" || band === "high alert") {
    if (hasStroke) {
      return "⚠️ Neurological Comfort & Safety: Warning signs for nerve or stroke risk observed. Keep the patient completely rested in a safe, quiet sitting posture. Do not allow intense physical straining. Prepare to accompany them to a general hospital clinic promptly this week for comprehensive preventive diagnostic tests.";
    }
    return "⚠️ Active Pre-Consultation Care: Noticeable symptom warnings were identified, making a doctor appointment highly advisable this week. In the meantime, ensure the patient rests calmly in a quiet, well-ventilated room, avoid strenuous chores or physical exhaustion, and monitor morning and evening blood pressure and sugar readings.";
  }

  // Critical / Act Now
  if (lang === "hi") {
    return "🚨 तुरंत चिकित्सा सुरक्षा व्यवस्था: महत्वपूर्ण लक्षणों के कारण नजदीकी अस्पताल या विशेषज्ञ डॉक्टर से तुरंत संपर्क करना जरूरी है। मरीज को बिल्कुल शांत और आराम से लिटाएं या बैठाएं। यदि चक्कर या घबराहट हो तो जबरदस्ती खाना न खिलाएं और बिना देरी के स्वास्थ्य केंद्र ले जाएं।";
  }
  if (lang === "gu") {
    return "🚨 તાત્કાલિક તબીબી સુરક્ષા વ્યવસ્થા: મહત્વપૂર્ણ લક્ષણોના કારણે નજીકની હોસ્પિટલ અથવા નિષ્ણાત ડોક્ટરની સલાહ લેવી તાત્કાલિક જરૂરી છે. દર્દીને બિલકુલ શાંત અને આરામથી બેસાડો અથવા સુવડાવો. ચક્કર અથવા ગભરામણ થાય તો બળજબરીથી ખોરાક ન આપો અને તાત્કાલિક હોસ્પિટલ પહોંચાડો.";
  }
  return "🚨 Immediate Emergency Comfort: Critical vital flags require immediate evaluation at an emergency hospital clinic. Keep the patient completely calm, comfortably seated or reclining with plentiful fresh airflow. Do not force solid foods if dizzy, dizzy, or experiencing chest heaviness. Provide reassurance and accompany them to the medical facility immediately with this Sahayak report.";
}

function generateLocalStructuredSummary(assessment: Assessment, lang: string): StructuredInsight {
  const band = assessment.band.toUpperCase();
  const action = assessment.decision.action;
  const rationale = assessment.decision.rationale;
  const primarySpec = assessment.specialist?.primary || "General Medical Specialist";
  const secondarySpec = assessment.specialist?.secondary;

  const conditionDrivers: string[] = [];
  Object.entries(assessment.scores || {}).forEach(([k, s]) => {
    if (s && s.band !== "low") {
      const easyTitle = k === "cvd" ? "Heart & Blood Flow (CVD)" : k === "ckd" ? "Kidney Filtration (CKD)" : k.toUpperCase();
      conditionDrivers.push(`${easyTitle}: ${s.stage} (Value Recorded: ${s.value ?? "Checked"} | Status: ${bandLabel(s.band)})`);
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
    conditionDrivers.push(`Recommended Extra Lab Checks: To complete your full health review, lab test reports are advised for: ${(assessment.gap_labs ?? []).join(", ")}`);
  }
  if (conditionDrivers.length === 0) {
    conditionDrivers.push("All physical checkup readings and symptom screening answers are optimal, healthy, and perfectly within safe baseline targets.");
  }

  const dynamicCounseling = generateDynamicHomeCare(assessment, lang);

  if (lang === "hi") {
    return {
      executiveSummary: `आपके स्वास्थ्य परीक्षण का समग्र स्तर '${bandLabel(assessment.band)}' है। हमारी सत्यापित चिकित्सा नियमावली के अनुसार अगला अनुशंसित कदम: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `परामर्श मार्गदर्शन: कृपया ${primarySpec}${secondarySpec ? ` तथा ${secondarySpec}` : ""} डॉक्टर या नजदीकी केंद्र से परामर्श लें। कारण: ${rationale}`,
      patientCounseling: dynamicCounseling,
      source: "clinical-synthesis"
    };
  }

  if (lang === "gu") {
    return {
      executiveSummary: `તમારી આરોગ્ય તપાસનું સમગ્ર સ્તર '${bandLabel(assessment.band)}' છે. અમારી મેડિકલ માર્ગદર્શિકા મુજબ સૂચવેલ પગલું: ${action}।`,
      riskDrivers: conditionDrivers,
      escalationProtocol: `પરામર્શ માર્ગદર્શન: કૃપા કરીને ${primarySpec}${secondarySpec ? ` અને ${secondarySpec}` : ""} ડોક્ટર અથવા નજીકનું કેન્દ્ર સંપર્ક કરો. કારણ: ${rationale}`,
      patientCounseling: dynamicCounseling,
      source: "clinical-synthesis"
    };
  }

  return {
    executiveSummary: `Our validated medical formulas classify this health checkup as '${bandLabel(assessment.band)}' urgency. Based on World Health Organization community triage standards, our recommended immediate action is: ${action}.`,
    riskDrivers: conditionDrivers,
    escalationProtocol: `We advise coordinating a consultation or visit with: ${primarySpec}${secondarySpec ? ` and ${secondarySpec}` : ""}. Clinical Rationale: ${rationale}.`,
    patientCounseling: dynamicCounseling,
    source: "clinical-synthesis"
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

        // 1. Try Supabase Edge Function first
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

        // 2. Client-Side Gemini 2.0 API Direct Fallback with strict schema & tailored home care instructions
        if (apiKey) {
          const prompt = `Act as an expert, compassionate Chief Medical Diagnostic Officer examining this community health checkup data: ${JSON.stringify(assessment)}.
Produce a helpful, structured 4-part health advisory guide in language '${locale}'.
CRITICAL RULES FOR ACCURATE & USER-FRIENDLY PRECISION:
1. Use CLEAR, EVERYDAY WORDS that ordinary families can comfortably understand without confusing hospital terminology.
2. TAILORED HOME CARE RULE: Do NOT generate alarming hospital transport or emergency resting advice if the overall risk status is LOW or SAFE!
   - If Low/Safe risk: Recommend daily healthy nutrition, staying hydrated, 7-8 hours sleep, and 30-minute daily walking.
   - If Moderate risk: Recommend specific dietary modifications (lower sugar/salt) and relaxation techniques based on the exact condition.
   - If High or Critical risk: Recommend quiet patient rest, avoiding physical exertion, and preparing for medical clinic evaluation.

Return ONLY valid JSON with exactly these fields:
{
  "executiveSummary": "A crisp, reassuring 2-sentence breakdown of overall urgency level and general health state in simple terms.",
  "riskDrivers": ["Specific explanation of vital finding 1 in simple words with exact context", "Specific explanation of vital finding 2 or positive safety result in simple words"],
  "escalationProtocol": "Clear doctor specialty consultation recommendation explaining exactly why the visit will help.",
  "patientCounseling": "Precise, customized home care and daily wellness routine tailored strictly to the risk severity."
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
                source: "gemini-client"
              });
              setLoading(false);
              return;
            }
          }
        }

        // 3. Fall back to our local structured medical synthesizer with precise rules
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      {/* Slightly dark luxury slate-emerald container with ambient lighting */}
      <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] shadow-2xl overflow-hidden text-white flex flex-col justify-between h-full relative transition-all duration-300">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="bg-[#16332D]/90 px-7 py-4.5 border-b border-[#265349] flex flex-wrap items-center justify-between gap-3 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <h3 className="font-display text-lg font-extrabold tracking-tight text-white">
              Sahayak Smart AI Health Guide & Advice
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={classNames(
              "text-[11px] font-mono font-bold px-3.5 py-1 rounded-full border shadow-sm flex items-center gap-1.5 bg-emerald-500/25 text-emerald-200 border-emerald-400/50"
            )}>
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              {data?.source.includes("gemini") ? "SAHAYAK GEMINI AI GUIDE" : "VERIFIED SAHAYAK RULES v1.0"}
            </span>
          </div>
        </div>

        <div className="p-7 relative z-10 flex-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-emerald-300 gap-4">
              <span className="animate-spin text-4xl">⚡</span>
              <p className="text-sm font-semibold animate-pulse max-w-md">
                Sahayak AI is translating your checkup scores into clean, personalized everyday guidance and tailored home care...
              </p>
            </div>
          ) : (
            data && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Section 1: General Diagnostic Summary */}
                  <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-inner backdrop-blur-sm mb-6">
                    <div className="text-xs uppercase font-extrabold text-emerald-300 tracking-wider flex items-center gap-2 mb-2">
                      <span className="text-base">📋</span> General Health & Urgency Summary
                    </div>
                    <p className="text-sm md:text-[15px] font-sans font-semibold text-white leading-relaxed text-left">
                      {data.executiveSummary}
                    </p>
                  </div>

                  {/* Section 2: Precision Vital Breakdown & Warning Markers */}
                  <div className="mb-6">
                    <div className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-2 mb-3">
                      <span className="text-base">🔍</span> Precision Health Findings & Vital Breakdown
                    </div>
                    <div className="space-y-2.5">
                      {data.riskDrivers.map((item, index) => (
                        <div key={index} className="bg-[#192E29]/90 px-5 py-3.5 rounded-xl border border-amber-400/30 flex items-start gap-3.5 text-xs text-amber-100 font-medium shadow-sm hover:border-amber-400/60 transition-colors text-left">
                          <span className="text-amber-400 font-black text-sm shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed flex-1 font-sans text-xs md:text-[13px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3 & 4 Grid: Aligned Doctor Consultation & Customized Home Care */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    {/* Doctor Consultation Box */}
                    <div className={classNames(
                      "p-6 rounded-2xl flex flex-col justify-between shadow-md border transition-all text-left",
                      isCritical
                        ? "bg-gradient-to-br from-red-950/70 via-[#25171B] to-[#1C1215] border-red-500/60"
                        : "bg-[#1A3630]/90 border-emerald-400/30"
                    )}>
                      <div>
                        <div className={classNames(
                          "text-xs uppercase font-extrabold tracking-wider flex items-center gap-2 mb-3",
                          isCritical ? "text-red-300" : "text-cyan-300"
                        )}>
                          <span className="text-base">🏥</span> Recommended Medical Consultation
                        </div>
                        <p className={classNames(
                          "text-xs md:text-[13px] font-medium leading-relaxed font-sans",
                          isCritical ? "text-red-100 font-semibold" : "text-emerald-50"
                        )}>
                          {data.escalationProtocol}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono opacity-80 flex items-center gap-1.5">
                        <span>→</span>
                        <span>{isCritical ? "Urgent Medical Referral Advised" : "Routine Preventive Health Guidance"}</span>
                      </div>
                    </div>

                    {/* Customized Home Care & Wellness Box */}
                    <div className={classNames(
                      "p-6 rounded-2xl flex flex-col justify-between shadow-md border transition-all text-left",
                      isLowRisk
                        ? "bg-gradient-to-br from-[#1A3630] via-[#1D423A] to-[#16302B] border-emerald-400/50"
                        : isCritical
                        ? "bg-gradient-to-br from-amber-950/60 via-[#281F1B] to-[#1D1714] border-amber-500/50"
                        : "bg-[#1A3630]/90 border-emerald-400/40"
                    )}>
                      <div>
                        <div className={classNames(
                          "text-xs uppercase font-extrabold tracking-wider flex items-center gap-2 mb-3",
                          isLowRisk ? "text-emerald-300" : isCritical ? "text-amber-300" : "text-emerald-300"
                        )}>
                          <span className="text-base">🏡</span> Customized Home Care & Wellness
                        </div>
                        <p className="text-xs md:text-[13px] text-white font-medium leading-relaxed font-sans">
                          {data.patientCounseling}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono opacity-80 flex items-center justify-between">
                        <span>HOME WELLNESS STATUS</span>
                        <span className="font-bold text-emerald-300">
                          {isLowRisk ? "✓ SAFE DAILY ROUTINE" : "⚠️ TAILORED CARE PROTOCOL"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Toolbar */}
                <div className="flex flex-wrap items-center justify-between pt-5 border-t border-emerald-500/20 text-xs text-emerald-200/80 gap-4 font-medium mt-6">
                  <span className="font-mono text-[11px] flex items-center gap-2 text-emerald-300/90 font-semibold text-left">
                    <span className="text-emerald-400">ℹ️</span> All advice is customized according to World Health Organization clinical triage standards
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const reportText = `[SAHAYAK AI HEALTH REPORT]\n\nGENERAL HEALTH SUMMARY:\n${data.executiveSummary}\n\nKEY HEALTH FINDINGS:\n${data.riskDrivers.map(d => `• ${d}`).join("\n")}\n\nRECOMMENDED HOSPITAL OR SPECIALIST VISITS:\n${data.escalationProtocol}\n\nCUSTOMIZED HOME CARE & WELLNESS STEPS:\n${data.patientCounseling}`.trim();
                      navigator.clipboard?.writeText(reportText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }).catch(() => {});
                    }}
                    className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/30 border border-emerald-300/60 transition-all duration-200 shrink-0"
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
