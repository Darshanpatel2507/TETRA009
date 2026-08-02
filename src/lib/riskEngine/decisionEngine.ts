/**
 * Decision engine — combines per-condition scores into a single
 * urgency band + action + rationale.
 *
 * Priority order (higher overrides lower):
 *   1. Acute/FAST positive → immediate
 *   2. Any condition "critical" → immediate
 *   3. Any condition "high"     → 48-hour referral
 *   4. Any condition "moderate" → routine, flagged
 *   5. Else                    → routine annual
 */
import type {
  ConditionKey,
  ConditionScore,
  DecisionOutput,
  IntakePayload,
  RiskBand,
} from "../../types";
import { scoreAbcd2, scoreBp, scoreCkd, scoreCvd, scoreFast, scoreIdrs } from "./";
import { pickSpecialist } from "./specialistMap";
import { analyzeGap } from "./gapAnalysis";
import { MASTER_SYMPTOM_TAXONOMY } from "../taxonomy/masterSymptomTaxonomy";
import { selectInputsForCondition } from "./isolate";
import { evaluateCondition } from "./evaluateCondition";
import { CONDITIONS } from "./taxonomy";

export interface RunResult {
  scores: Record<ConditionKey, ConditionScore>;
  decision: DecisionOutput;
  factors: import("../../types").FactorRow[];
  gap_labs: import("../../types").GapLab[];
  specialist: import("../../types").SpecialistRef;
  confidence: "lab-confirmed" | "screened";
}

export function runRiskEngine(p: IntakePayload): RunResult {
  const L = p.labs ?? {};

  // Per-condition scores
  const fast = scoreFast(p.symptoms);
  const bp = scoreBp({
    systolic: p.vitals.systolic_bp,
    diastolic: p.vitals.diastolic_bp,
    on_antihypertensive: p.history.on_antihypertensive,
  });
  const idrs = scoreIdrs({
    age: p.age,
    sex: p.sex,
    waist_cm: p.vitals.waist_cm,
    activityScore: p.history.smoking ? 20 : 10, // proxy
    family_diabetes: p.history.family_diabetes,
    fasting_glucose_mg_dl: L.fasting_glucose_mg_dl,
    hba1c_percent: L.hba1c_percent,
  });
  const cvd = scoreCvd({
    age: p.age,
    sex: p.sex,
    smoking: p.history.smoking,
    systolic_bp: p.vitals.systolic_bp,
    diabetes: (L.fasting_glucose_mg_dl ?? 0) >= 126 || (L.hba1c_percent ?? 0) >= 6.5,
  });
  const ckd = scoreCkd({
    age: p.age,
    sex: p.sex,
    serum_creatinine_mg_dl: L.serum_creatinine_mg_dl ?? 0,
  });

  const stroke = (() => {
    if (fast.band === "critical") return fast;
    const strokeClinical: 0 | 1 | 2 = p.symptoms.tia_episode_history ? 2 : 0;
    const strokeDuration: 0 | 1 | 2 = p.symptoms.tia_episode_history ? 1 : 0;
    return scoreAbcd2({
      age60: p.age >= 60,
      bp: p.vitals.systolic_bp >= 140 || p.vitals.diastolic_bp >= 90,
      clinical: strokeClinical,
      duration: strokeDuration,
      diabetes: (L.fasting_glucose_mg_dl ?? 0) >= 126 || (L.hba1c_percent ?? 0) >= 6.5,
    });
  })();

  const scores: Record<ConditionKey, ConditionScore> = {
    diabetes:      { band: idrs.band, stage: idrs.stage, value: idrs.value ?? null },
    hypertension:  { band: bp.band,   stage: bp.stage,   value: bp.value },
    cvd:           { band: cvd.band,  stage: cvd.stage,  value: cvd.value, ml_probability: cvd.ml_probability },
    ckd:           { band: ckd.band,  stage: ckd.stage,  value: ckd.value },
    stroke:        { band: stroke.band, stage: stroke.stage, value: stroke.value },
  };

  // Cross-Condition Isolation Guarantee & DWSCS Evaluation
  let hasEmergencySymptom = false;
  let emergencyRationale = "";

  for (const cond of CONDITIONS) {
    // Isolate form inputs at the boundary — physically cannot see fields outside cond's allow-list
    const scopedInputs = selectInputsForCondition(cond, {
      ...p.symptoms,
      systolic_bp: p.vitals.systolic_bp,
      diastolic_bp: p.vitals.diastolic_bp,
      fasting_glucose_mg_dl: L.fasting_glucose_mg_dl,
      hba1c_percent: L.hba1c_percent,
    });
    
    const res = evaluateCondition(cond, scopedInputs, (p as any).priorSubmissions || []);

    if (res.tier === "immediate" || res.basis === "hard-override") {
      hasEmergencySymptom = true;
      if (!emergencyRationale && res.matchedCriteria.length > 0) {
        emergencyRationale = `Acute alert (${cond.toUpperCase()}): ${res.matchedCriteria[0]}`;
      }
      scores[cond].band = "critical";
      scores[cond].stage = `Acute emergency — ${res.matchedCriteria[0]}`;
    } else if (res.tier === "firm" || res.tier === "advanced") {
      if (scores[cond].band === "low" || scores[cond].band === "moderate") {
        scores[cond].band = "high";
        scores[cond].stage = `Needs Attention · Matches: ${res.matchedCriteria.slice(0, 2).join(" ; ")}`;
      }
    } else if (res.tier === "moderate" || res.tier === "soft") {
      if (scores[cond].band === "low") {
        scores[cond].band = "moderate";
        scores[cond].stage = `Symptom markers noted · ${res.matchedCriteria[0]}`;
      }
    }
  }

  // Decision priority
  let decision: DecisionOutput;
  if (fast.band === "critical") {
    decision = {
      band: "critical",
      rationale: "FAST+ stroke screen positive — acute neurological emergency",
      action: "Immediate referral",
    };
  } else if (bp.band === "critical" as any) {
    decision = {
      band: "critical",
      rationale: "Hypertensive crisis (BP ≥180/120)",
      action: "Immediate referral",
    };
  } else if (hasEmergencySymptom || anyBand(scores, "critical")) {
    decision = {
      band: "critical",
      rationale: emergencyRationale || "Critical condition marker or acute emergency sign detected",
      action: "Immediate referral",
    };
  } else if (anyBand(scores, "high")) {
    decision = {
      band: "high",
      rationale: "One or more high-risk conditions",
      action: "48-hour referral",
    };
  } else if (anyBand(scores, "moderate")) {
    decision = {
      band: "moderate",
      rationale: "Elevated risk — flagged for follow-up",
      action: "Routine, flagged",
    };
  } else {
    decision = {
      band: "low",
      rationale: "No elevated risk markers",
      action: "Routine annual review",
    };
  }

  // Factor breakdown (cap weight 0..1)
  const factors = buildFactorRows(p, scores);

  // Specialist
  const active = (Object.keys(scores) as ConditionKey[]).filter(
    (k) => scores[k].band !== "low",
  );
  const specialist = pickSpecialist(active);

  // Confidence: any of the lab-backed engines (idrs, ckd, cvd) have labs
  const hasLabs = L.fasting_glucose_mg_dl != null || L.hba1c_percent != null || L.serum_creatinine_mg_dl != null;
  const confidence: "lab-confirmed" | "screened" = hasLabs ? "lab-confirmed" : "screened";

  const gap_labs = analyzeGap(p, scores);

  return {
    scores,
    decision,
    factors,
    gap_labs,
    specialist,
    confidence,
  };
}

function anyBand(scores: Record<ConditionKey, ConditionScore>, b: RiskBand): boolean {
  return (Object.keys(scores) as ConditionKey[]).some((k) => scores[k].band === b);
}

function buildFactorRows(
  p: IntakePayload,
  scores: Record<ConditionKey, ConditionScore>,
): import("../../types").FactorRow[] {
  const rows: import("../../types").FactorRow[] = [];

  if (p.vitals.systolic_bp > 0) {
    rows.push({
      condition: "hypertension",
      label: "Blood pressure",
      value: `${p.vitals.systolic_bp}/${p.vitals.diastolic_bp} mmHg`,
      weight: normalise(scores.hypertension.band),
      source: "jnc8",
    });
  }
  if (p.history.family_diabetes || (p.labs?.hba1c_percent != null) || (p.labs?.fasting_glucose_mg_dl != null)) {
    rows.push({
      condition: "diabetes",
      label: "Diabetes risk",
      value: scores.diabetes.stage,
      weight: normalise(scores.diabetes.band),
      source: "idrs",
    });
  }
  if (p.labs?.serum_creatinine_mg_dl != null) {
    rows.push({
      condition: "ckd",
      label: "Kidney function (eGFR)",
      value: `${scores.ckd.value} mL/min/1.73m²`,
      weight: normalise(scores.ckd.band),
      source: "ckd-epi",
    });
  }
  if (p.vitals.systolic_bp > 0) {
    rows.push({
      condition: "cvd",
      label: "10-year CVD risk",
      value: scores.cvd.value != null ? `${scores.cvd.value}%` : "—",
      weight: normalise(scores.cvd.band),
      source: "who-ish",
    });
  }
  
  // Dynamic Master Symptom Factor rows with Duration tracking
  for (const sym of MASTER_SYMPTOM_TAXONOMY) {
    if (p.symptoms[sym.id]) {
      const dur = p.symptoms.durations?.[sym.id] ? ` [Duration: ${p.symptoms.durations[sym.id]}]` : "";
      for (const cond of sym.conditions) {
        rows.push({
          condition: cond,
          label: sym.stageName,
          value: `${sym.question}${dur}`,
          weight: sym.isEmergency ? 1 : 0.65,
          source: (sym.conditions.includes("stroke") && sym.isEmergency) ? "fast" : "history",
        });
      }
    }
  }
  
  return rows;
}

function normalise(b: RiskBand): number {
  switch (b) {
    case "low": return 0.15;
    case "moderate": return 0.45;
    case "high": return 0.75;
    case "critical": return 1;
  }
}
