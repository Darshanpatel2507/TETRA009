/**
 * CKD-EPI 2021 (race-free) creatinine equation.
 *   eGFR = 142 × min(κ, 1)^α × max(κ, 1)^-1.200 × 0.9938^age × sex_factor
 *   Female: × 1.012
 *
 *   κ = 0.7 (F) / 0.9 (M);  α = -0.241 (F) / -0.302 (M)
 */
export interface CkdInput {
  age: number;
  sex: "M" | "F";
  serum_creatinine_mg_dl: number;
}

export interface CkdOutput {
  band: "low" | "moderate" | "high" | "critical";
  stage: string;
  value: number | null; // eGFR
}

export function scoreCkd(i: CkdInput): CkdOutput {
  const cr = i.serum_creatinine_mg_dl;
  if (!cr || cr <= 0) return { band: "low", stage: "Unknown — creatinine missing", value: null };

  const kappa = i.sex === "F" ? 0.7 : 0.9;
  const alpha = i.sex === "F" ? -0.241 : -0.302;
  const sexFactor = i.sex === "F" ? 1.012 : 1;
  const min = Math.min(cr / kappa, 1);
  const max = Math.max(cr / kappa, 1);

  const egfr =
    142 *
    Math.pow(min, alpha) *
    Math.pow(max, -1.2) *
    Math.pow(0.9938, i.age) *
    sexFactor;

  const rounded = Math.round(egfr);

  let band: CkdOutput["band"];
  let stage: string;
  if (rounded >= 90) { band = "low"; stage = "G1 (≥90)"; }
  else if (rounded >= 60) { band = "low"; stage = "G2 (60-89)"; }
  else if (rounded >= 45) { band = "moderate"; stage = "G3a (45-59)"; }
  else if (rounded >= 30) { band = "high"; stage = "G3b (30-44)"; }
  else if (rounded >= 15) { band = "high"; stage = "G4 (15-29)"; }
  else { band = "critical"; stage = "G5 (<15) — Kidney failure"; }

  return { band, stage, value: rounded };
}
