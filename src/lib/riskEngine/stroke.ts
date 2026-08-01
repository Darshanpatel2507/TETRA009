/**
 * Stroke risk — two layers.
 *  1. FAST acute screen: any of Face/Arm/Speech positive → immediate.
 *  2. TIA probability based on ABCD² score (age, BP, clinical features,
 *     duration, diabetes). 0-3 low, 4-5 moderate, 6-7 high.
 */
export interface FastInput {
  face_droop: boolean;
  arm_weakness: boolean;
  speech_difficulty: boolean;
  sudden_balance_loss?: boolean;
  thunderclap_headache?: boolean;
  time_of_onset?: string;
}

export interface StrokeOutput {
  band: "low" | "moderate" | "high" | "critical";
  stage: string;
  value: number | null;
}

export function scoreFast(i: FastInput): StrokeOutput {
  if (i.face_droop || i.arm_weakness || i.speech_difficulty || i.sudden_balance_loss || i.thunderclap_headache) {
    return {
      band: "critical",
      stage: "FAST+ acute screen positive — neurological emergency",
      value: 1,
    };
  }
  return { band: "low", stage: "FAST negative", value: 0 };
}

/** ABCD² — used to estimate TIA risk when FAST is negative. */
export interface Abcd2Input {
  age60: boolean;     // ≥60 → 1
  bp: boolean;       // SBP ≥140 or DBP ≥90 → 1
  clinical: 0 | 1 | 2; // unilateral weakness=2, speech=1, other=0
  duration: 0 | 1 | 2; // ≥60min=2, 10-59min=1, <10min=0
  diabetes: boolean;
}

export function scoreAbcd2(i: Abcd2Input): StrokeOutput {
  const s =
    (i.age60 ? 1 : 0) +
    (i.bp ? 1 : 0) +
    i.clinical +
    i.duration +
    (i.diabetes ? 1 : 0);

  let band: StrokeOutput["band"];
  let stage: string;
  if (s >= 6) { band = "critical"; stage = `TIA ABCD² ${s} — high 2-day stroke risk`; }
  else if (s >= 4) { band = "high"; stage = `TIA ABCD² ${s} — moderate risk`; }
  else if (s >= 2) { band = "moderate"; stage = `TIA ABCD² ${s} — low risk`; }
  else { band = "low"; stage = `TIA ABCD² ${s} — very low risk`; }

  return { band, stage, value: s };
}
