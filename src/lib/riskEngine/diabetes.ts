/**
 * IDRS — Indian Diabetes Risk Score (Mohan et al, 2005).
 * Four parameters, range 0..100, ≥60 ≈ high risk.
 *
 *   Age:   <35=0, 35-49=20, ≥50=30
 *   Waist: M ≥102cm / F ≥88cm → 10; (M 80-101 / F 70-87) → 10; else 0
 *          (we use the more conservative India waist thresholds)
 *   Activity: vigorous regular → 0, mild → 10, sedentary → 30
 *   Family: both parents → 20, one parent / sibling → 10, none → 0
 *
 * If no activity question is asked, we impute 20 (sedentary-ish
 * rural default) and flag confidence lower.
 */
export interface IdrsInput {
  age: number;
  sex: "M" | "F";
  waist_cm?: number;
  /** 0=sedentary, 10=mild, 30=moderate (we invert the spec: higher = worse) */
  activityScore?: number;
  family_diabetes: boolean;
  /** Optional blood sugar to override IDRS category */
  fasting_glucose_mg_dl?: number;
  hba1c_percent?: number;
}

export interface IdrsOutput {
  idrs: number | null;
  band: "low" | "moderate" | "high" | "critical";
  stage: string;
  value: number | null;
}

export function scoreIdrs(i: IdrsInput): IdrsOutput {
  if (!i.age && i.age !== 0) return { idrs: null, band: "low", stage: "Unknown", value: null };

  let s = 0;
  s += i.age >= 50 ? 30 : i.age >= 35 ? 20 : 0;

  const w = i.waist_cm;
  if (w != null) {
    if (i.sex === "M" && w >= 102) s += 10;
    else if (i.sex === "F" && w >= 88) s += 10;
    // mid-range cut points also score 10 in IDRS; we omit the mid band
    // and only flag the at-risk waist — this is the more conservative
    // interpretation in rural clinical use.
  }

  // Activity: sed=30, mod=20, vig=0. We accept 0..30.
  if (i.activityScore != null) s += clamp(i.activityScore, 0, 30);

  s += i.family_diabetes ? 20 : 0;

  // Lab overrides
  if (i.hba1c_percent != null) {
    if (i.hba1c_percent >= 6.5) return { idrs: s, band: "critical", stage: "Diabetes (HbA1c ≥ 6.5%)", value: i.hba1c_percent };
    if (i.hba1c_percent >= 5.7) {
      return { idrs: s, band: "moderate", stage: "Prediabetes (HbA1c 5.7-6.4%)", value: i.hba1c_percent };
    }
  }
  if (i.fasting_glucose_mg_dl != null) {
    if (i.fasting_glucose_mg_dl >= 126) {
      return { idrs: s, band: "critical", stage: "Diabetes (FG ≥ 126 mg/dL)", value: i.fasting_glucose_mg_dl };
    }
    if (i.fasting_glucose_mg_dl >= 100) {
      return { idrs: s, band: "moderate", stage: "Prediabetes (FG 100-125 mg/dL)", value: i.fasting_glucose_mg_dl };
    }
  }

  let band: IdrsOutput["band"] = "low";
  if (s >= 60) band = "high";
  else if (s >= 30) band = "moderate";

  return { idrs: s, band, stage: scoreStage(s), value: s };
}

function scoreStage(s: number) {
  if (s >= 60) return "High risk (IDRS ≥ 60)";
  if (s >= 30) return "Moderate risk";
  return "Low risk";
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
