/**
 * Lab gap analysis — which investigations are missing for a
 * confident assessment per condition.
 */
import type { ConditionKey, GapLab, IntakePayload } from "../../types";

export function analyzeGap(p: IntakePayload): GapLab[] {
  const out: GapLab[] = [];
  const L = p.labs ?? {};

  // Diabetes
  if (L.fasting_glucose_mg_dl == null && L.hba1c_percent == null) {
    out.push({
      condition: "diabetes",
      test: "Fasting glucose / HbA1c",
      reason: "Required to confirm diabetes vs. screen-only",
    });
  }

  // CKD
  if (L.serum_creatinine_mg_dl == null) {
    out.push({
      condition: "ckd",
      test: "Serum creatinine",
      reason: "Required for CKD-EPI 2021 eGFR",
    });
  }

  // CVD — full lipid panel preferred
  if (
    L.total_cholesterol_mg_dl == null ||
    L.hdl_mg_dl == null ||
    L.ldl_mg_dl == null
  ) {
    const missing = [
      L.total_cholesterol_mg_dl == null ? "total chol" : null,
      L.hdl_mg_dl == null ? "HDL" : null,
      L.ldl_mg_dl == null ? "LDL" : null,
    ].filter(Boolean).join(", ");
    out.push({
      condition: "cvd",
      test: `Lipid panel (${missing})`,
      reason: "Enables full ASCVD risk refinement",
    });
  }

  // Hypertension baseline labs
  if (L.potassium_mmol_l == null) {
    out.push({
      condition: "hypertension",
      test: "Serum potassium",
      reason: "Baseline before starting antihypertensives",
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
