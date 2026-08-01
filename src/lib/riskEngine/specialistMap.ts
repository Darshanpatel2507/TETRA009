/**
 * Condition → specialist referral map.
 * Priority is "primary" first; "secondary" is shown when both apply.
 */
import type { ConditionKey, SpecialistRef } from "../../types";

export function pickSpecialist(active: ConditionKey[]): SpecialistRef {
  // Order matters — CV overrides CKD as the more urgent specialist
  const order: ConditionKey[] = ["stroke", "cvd", "diabetes", "ckd", "hypertension"];
  const present = order.filter((c) => active.includes(c));
  if (present.length === 0) return { primary: "General physician", reason: "No elevated condition" };

  if (present.includes("stroke")) {
    return {
      primary: "Neurologist",
      secondary: present.includes("cvd") ? "Cardiologist" : undefined,
      reason: "FAST positive or high ABCD² — stroke protocol",
    };
  }
  if (present.includes("cvd")) {
    return {
      primary: "Cardiologist",
      secondary: present.includes("ckd") ? "Nephrologist" : undefined,
      reason: "≥20% 10-year CVD risk",
    };
  }
  if (present.includes("diabetes")) {
    return {
      primary: "Endocrinologist",
      secondary: present.includes("hypertension") ? "Cardiologist" : undefined,
      reason: "Confirmed diabetes or IDRS ≥60",
    };
  }
  if (present.includes("ckd")) {
    return {
      primary: "Nephrologist",
      reason: "eGFR <45",
    };
  }
  return {
    primary: "Internal medicine",
    reason: "Stage 1–2 hypertension",
  };
}
