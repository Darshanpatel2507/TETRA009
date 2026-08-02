/**
 * Lab gap analysis & diagnostic test recommendations — intelligent, disease-specific,
 * and deadline-enforced recommendations for any elevated condition.
 */
import type { ConditionKey, GapLab, IntakePayload, ConditionScore } from "../../types";

export function getAccurateTestRecommendations(
  scores?: Record<ConditionKey, ConditionScore>,
  fallbackGaps?: GapLab[]
): GapLab[] {
  if (!scores) {
    return fallbackGaps ?? [];
  }

  const out: GapLab[] = [];

  // Diabetes test recommendation
  const dia = scores.diabetes;
  if (dia && dia.band !== "low") {
    if (dia.band === "critical" || dia.band === ("immediate" as any)) {
      out.push({
        condition: "diabetes",
        test: "Emergency Blood Glucose & DKA Workup",
        reason: "Acute metabolic warning signs present; immediate hospital evaluation required (Deadline: now)",
      });
    } else if (dia.band === "high" || dia.band === ("firm" as any) || dia.band === ("advanced" as any)) {
      out.push({
        condition: "diabetes",
        test: "Fasting Blood Glucose & HbA1c Panel",
        reason: "High diabetes risk indicators identified; formal lab confirmation required (Deadline: within 2 weeks)",
      });
    } else {
      out.push({
        condition: "diabetes",
        test: "Fasting Blood Glucose or Oral Glucose Tolerance Check",
        reason: "Elevated diabetes risk markers observed; diagnostic baseline recommended (Deadline: within 4 weeks)",
      });
    }
  }

  // Hypertension test recommendation
  const hyp = scores.hypertension;
  if (hyp && hyp.band !== "low") {
    if (hyp.band === "critical" || hyp.band === ("immediate" as any)) {
      out.push({
        condition: "hypertension",
        test: "Emergency Blood Pressure Workup & Cardiac Evaluation",
        reason: "Acute blood pressure readings (≥180/120 mmHg or acute distress) require immediate hospital care (Deadline: now)",
      });
    } else if (hyp.band === "high" || hyp.band === ("firm" as any) || hyp.band === ("advanced" as any)) {
      out.push({
        condition: "hypertension",
        test: "Clinical BP Profiling & Electrolyte Panel (Serum Potassium/Sodium)",
        reason: "High hypertension risk identified; electrolyte baseline required before starting therapy (Deadline: within 3 days)",
      });
    } else {
      out.push({
        condition: "hypertension",
        test: "Home Blood Pressure Logging & Baseline Serum Potassium",
        reason: "Stage 1 blood pressure elevation detected; periodic tracking & vascular verification advised (Deadline: within 3 weeks)",
      });
    }
  }

  // CVD test recommendation
  const cvd = scores.cvd;
  if (cvd && cvd.band !== "low") {
    if (cvd.band === "critical" || cvd.band === ("immediate" as any)) {
      out.push({
        condition: "cvd",
        test: "Emergency Cardiac Diagnostic Panel (ECG, Troponin & Vitals)",
        reason: "Acute vascular symptoms detected; immediate emergency room evaluation mandatory (Deadline: now)",
      });
    } else if (cvd.band === "high" || cvd.band === ("firm" as any) || cvd.band === ("advanced" as any)) {
      out.push({
        condition: "cvd",
        test: "Complete Lipid Profile (Total Chol, HDL, LDL, Triglycerides) & 12-Lead ECG",
        reason: "High 10-year ASCVD cardiovascular risk; comprehensive lipid verification needed (Deadline: within 3 days)",
      });
    } else {
      out.push({
        condition: "cvd",
        test: "Standard Lipid Panel (Total Chol, HDL, LDL)",
        reason: "Moderate cardiovascular factors present; lipid panel enables refined preventive therapy (Deadline: within 3 weeks)",
      });
    }
  }

  // CKD test recommendation
  const ckd = scores.ckd;
  if (ckd && ckd.band !== "low") {
    if (ckd.band === "critical" || ckd.band === ("immediate" as any)) {
      out.push({
        condition: "ckd",
        test: "Emergency Renal Function & Acute Electrolyte Workup",
        reason: "Acute renal distress markers identified; urgent hospital nephrology triage required (Deadline: now)",
      });
    } else if (ckd.band === "high" || ckd.band === ("firm" as any) || ckd.band === ("advanced" as any)) {
      out.push({
        condition: "ckd",
        test: "Serum Creatinine (with race-free CKD-EPI eGFR) & Urine Albumin-to-Creatinine Ratio",
        reason: "Advanced renal symptom pattern detected; comprehensive laboratory eGFR staging advised (Deadline: within 1–2 weeks)",
      });
    } else {
      out.push({
        condition: "ckd",
        test: "Serum Creatinine & Routine Urine Protein Screen",
        reason: "Moderate kidney function markers observed; basic eGFR baseline confirmation recommended (Deadline: within 3–4 weeks)",
      });
    }
  }

  // Stroke test recommendation
  const stroke = scores.stroke;
  if (stroke && stroke.band !== "low") {
    if (stroke.band === "critical" || stroke.band === ("immediate" as any)) {
      out.push({
        condition: "stroke",
        test: "Emergency Stroke Neurological Workup (FAST Protocol & Brain Imaging)",
        reason: "Positive FAST stroke screening sign present; immediate emergency room activation mandatory (Deadline: now)",
      });
    } else {
      out.push({
        condition: "stroke",
        test: "Urgent Neurological & Vascular Examination (Carotid Doppler / ABCD² review)",
        reason: "Elevated cerebrovascular risk indicators detected; specialized neurological evaluation required (Deadline: within 24 hours to 3 days)",
      });
    }
  }

  return out;
}

export function analyzeGap(p: IntakePayload, scores?: Record<ConditionKey, ConditionScore>): GapLab[] {
  if (scores) {
    return getAccurateTestRecommendations(scores);
  }

  // Fallback legacy checks if scores are not provided
  const out: GapLab[] = [];
  const L = p.labs ?? {};

  if (L.fasting_glucose_mg_dl == null && L.hba1c_percent == null) {
    out.push({
      condition: "diabetes",
      test: "Fasting glucose / HbA1c",
      reason: "Required to confirm diabetes vs. screen-only (Deadline: within 4 weeks)",
    });
  }
  if (L.serum_creatinine_mg_dl == null) {
    out.push({
      condition: "ckd",
      test: "Serum creatinine",
      reason: "Required for CKD-EPI 2021 eGFR (Deadline: within 3–4 weeks)",
    });
  }
  if (L.total_cholesterol_mg_dl == null || L.hdl_mg_dl == null || L.ldl_mg_dl == null) {
    out.push({
      condition: "cvd",
      test: "Lipid panel (Total Chol, HDL, LDL)",
      reason: "Enables full ASCVD risk refinement (Deadline: within 3 weeks)",
    });
  }
  if (L.potassium_mmol_l == null) {
    out.push({
      condition: "hypertension",
      test: "Serum potassium",
      reason: "Baseline before starting antihypertensives (Deadline: within 3 weeks)",
    });
  }

  return out;
}

/** Required labs per condition, used by supabase/schema.sql RLS helper. */
export const REQUIRED_LABS_PER_CONDITION: Record<ConditionKey, string[]> = {
  diabetes: ["fasting_glucose", "hba1c"],
  hypertension: ["serum_potassium"],
  cvd: ["lipid_panel"],
  ckd: ["serum_creatinine"],
  stroke: [],
};
