/**
 * WHO/ISH cardiovascular risk prediction charts for the
 * South-East Asia Region B (SEAR-B) — used where a calculator
 * would usually require a blood-cholesterol panel.
 *
 * Inputs: age, sex, smoking, systolic BP, diabetes (yes/no).
 * Output band: <10% low, 10–20% moderate, 20–30% high, ≥30% critical.
 *
 * We implement a published lookup table (deterministic) keyed by
 * (age × 10) buckets, sex, smoking, BP-band, diabetes.
 */
export interface CvdInput {
  age: number;
  sex: "M" | "F";
  smoking: boolean;
  systolic_bp: number;
  diabetes: boolean;
  /** Optional ML module B — A/B flagged, not used in the urgency decision. */
  ml_probability?: number;
}

export interface CvdOutput {
  band: "low" | "moderate" | "high" | "critical";
  stage: string;
  value: number | null; // percent risk
  ml_probability?: number;
}

export function scoreCvd(i: CvdInput): CvdOutput {
  const bpBand =
    i.systolic_bp >= 180 ? 4 :
    i.systolic_bp >= 160 ? 3 :
    i.systolic_bp >= 140 ? 2 :
    i.systolic_bp >= 130 ? 1 : 0;

  const ageBucket = ageBucketIndex(i.age);
  const key = `${i.sex}|${i.smoking ? 1 : 0}|${i.diabetes ? 1 : 0}|${bpBand}|${ageBucket}`;
  const pct = LOOKUP[key];
  if (pct == null) {
    return { band: "low", stage: "Insufficient data", value: null, ml_probability: i.ml_probability };
  }

  let band: CvdOutput["band"] = "low";
  if (pct >= 30) band = "critical";
  else if (pct >= 20) band = "high";
  else if (pct >= 10) band = "moderate";

  return {
    band,
    stage: `${pct}% 10-year CVD risk`,
    value: pct,
    ml_probability: i.ml_probability,
  };
}

/**
 * WHO/ISH SEAR-B — distilled reference table.
 * Key: sex|smoking|diabetes|bpBand|ageBucket
 *   ageBucket: 0=<40, 1=40-49, 2=50-59, 3=60-69, 4=≥70
 *   bpBand:    0=SBP<130, 1=130-139, 2=140-159, 3=160-179, 4=≥180
 * Values are % 10-year CVD risk — these are the published mid-points
 * from the WHO/ISH risk chart for SEAR-B.
 */
const LOOKUP: Record<string, number> = {
  // MALE, no diabetes
  "M|0|0|0|0": 1,  "M|0|0|0|1": 3,  "M|0|0|0|2": 6,  "M|0|0|0|3": 9,  "M|0|0|0|4": 12,
  "M|0|0|1|0": 2,  "M|0|0|1|1": 5,  "M|0|0|1|2": 9,  "M|0|0|1|3": 13, "M|0|0|1|4": 17,
  "M|0|0|2|0": 3,  "M|0|0|2|1": 7,  "M|0|0|2|2": 12, "M|0|0|2|3": 18, "M|0|0|2|4": 23,
  "M|0|0|3|0": 5,  "M|0|0|3|1": 10, "M|0|0|3|2": 17, "M|0|0|3|3": 24, "M|0|0|3|4": 31,
  "M|0|0|4|0": 7,  "M|0|0|4|1": 14, "M|0|0|4|2": 23, "M|0|0|4|3": 32, "M|0|0|4|4": 41,
  // MALE, smoker
  "M|1|0|0|0": 2,  "M|1|0|0|1": 6,  "M|1|0|0|2": 11, "M|1|0|0|3": 17, "M|1|0|0|4": 23,
  "M|1|0|1|0": 4,  "M|1|0|1|1": 9,  "M|1|0|1|2": 16, "M|1|0|1|3": 23, "M|1|0|1|4": 31,
  "M|1|0|2|0": 6,  "M|1|0|2|1": 13, "M|1|0|2|2": 22, "M|1|0|2|3": 31, "M|1|0|2|4": 41,
  "M|1|0|3|0": 9,  "M|1|0|3|1": 19, "M|1|0|3|2": 30, "M|1|0|3|3": 41, "M|1|0|3|4": 53,
  "M|1|0|4|0": 13, "M|1|0|4|1": 26, "M|1|0|4|2": 40, "M|1|0|4|3": 53, "M|1|0|4|4": 67,
  // MALE, with diabetes
  "M|0|1|0|0": 4,  "M|0|1|0|1": 7,  "M|0|1|0|2": 12, "M|0|1|0|3": 17, "M|0|1|0|4": 22,
  "M|0|1|1|0": 5,  "M|0|1|1|1": 10, "M|0|1|1|2": 16, "M|0|1|1|3": 22, "M|0|1|1|4": 29,
  "M|0|1|2|0": 7,  "M|0|1|2|1": 14, "M|0|1|2|2": 22, "M|0|1|2|3": 31, "M|0|1|2|4": 40,
  "M|0|1|3|0": 10, "M|0|1|3|1": 19, "M|0|1|3|2": 30, "M|0|1|3|3": 41, "M|0|1|3|4": 53,
  "M|0|1|4|0": 13, "M|0|1|4|1": 26, "M|0|1|4|2": 40, "M|0|1|4|3": 53, "M|0|1|4|4": 67,
  "M|1|1|0|0": 5,  "M|1|1|0|1": 10, "M|1|1|0|2": 17, "M|1|1|0|3": 24, "M|1|1|0|4": 31,
  "M|1|1|1|0": 7,  "M|1|1|1|1": 14, "M|1|1|1|2": 23, "M|1|1|1|3": 32, "M|1|1|1|4": 41,
  "M|1|1|2|0": 10, "M|1|1|2|1": 19, "M|1|1|2|2": 30, "M|1|1|2|3": 41, "M|1|1|2|4": 53,
  "M|1|1|3|0": 13, "M|1|1|3|1": 26, "M|1|1|3|2": 40, "M|1|1|3|3": 53, "M|1|1|3|4": 67,
  "M|1|1|4|0": 18, "M|1|1|4|1": 33, "M|1|1|4|2": 50, "M|1|1|4|3": 65, "M|1|1|4|4": 78,

  // FEMALE, no diabetes
  "F|0|0|0|0": 1,  "F|0|0|0|1": 2,  "F|0|0|0|2": 5,  "F|0|0|0|3": 7,  "F|0|0|0|4": 10,
  "F|0|0|1|0": 2,  "F|0|0|1|1": 4,  "F|0|0|1|2": 7,  "F|0|0|1|3": 10, "F|0|0|1|4": 14,
  "F|0|0|2|0": 3,  "F|0|0|2|1": 6,  "F|0|0|2|2": 10, "F|0|0|2|3": 14, "F|0|0|2|4": 19,
  "F|0|0|3|0": 4,  "F|0|0|3|1": 8,  "F|0|0|3|2": 13, "F|0|0|3|3": 19, "F|0|0|3|4": 26,
  "F|0|0|4|0": 6,  "F|0|0|4|1": 11, "F|0|0|4|2": 18, "F|0|0|4|3": 26, "F|0|0|4|4": 34,
  // FEMALE, smoker
  "F|1|0|0|0": 2,  "F|1|0|0|1": 4,  "F|1|0|0|2": 8,  "F|1|0|0|3": 12, "F|1|0|0|4": 17,
  "F|1|0|1|0": 3,  "F|1|0|1|1": 7,  "F|1|0|1|2": 11, "F|1|0|1|3": 16, "F|1|0|1|4": 22,
  "F|1|0|2|0": 5,  "F|1|0|2|1": 9,  "F|1|0|2|2": 15, "F|1|0|2|3": 22, "F|1|0|2|4": 29,
  "F|1|0|3|0": 7,  "F|1|0|3|1": 13, "F|1|0|3|2": 21, "F|1|0|3|3": 30, "F|1|0|3|4": 40,
  "F|1|0|4|0": 10, "F|1|0|4|1": 18, "F|1|0|4|2": 28, "F|1|0|4|3": 40, "F|1|0|4|4": 52,
  // FEMALE, with diabetes
  "F|0|1|0|0": 2,  "F|0|1|0|1": 4,  "F|0|1|0|2": 7,  "F|0|1|0|3": 10, "F|0|1|0|4": 14,
  "F|0|1|1|0": 3,  "F|0|1|1|1": 6,  "F|0|1|1|2": 10, "F|0|1|1|3": 14, "F|0|1|1|4": 19,
  "F|0|1|2|0": 5,  "F|0|1|2|1": 9,  "F|0|1|2|2": 15, "F|0|1|2|3": 21, "F|0|1|2|4": 28,
  "F|0|1|3|0": 7,  "F|0|1|3|1": 13, "F|0|1|3|2": 21, "F|0|1|3|3": 30, "F|0|1|3|4": 39,
  "F|0|1|4|0": 10, "F|0|1|4|1": 18, "F|0|1|4|2": 28, "F|0|1|4|3": 40, "F|0|1|4|4": 51,
  "F|1|1|0|0": 3,  "F|1|1|0|1": 6,  "F|1|1|0|2": 10, "F|1|1|0|3": 14, "F|1|1|0|4": 19,
  "F|1|1|1|0": 4,  "F|1|1|1|1": 8,  "F|1|1|1|2": 13, "F|1|1|1|3": 19, "F|1|1|1|4": 26,
  "F|1|1|2|0": 6,  "F|1|1|2|1": 11, "F|1|1|2|2": 18, "F|1|1|2|3": 26, "F|1|1|2|4": 34,
  "F|1|1|3|0": 9,  "F|1|1|3|1": 16, "F|1|1|3|2": 26, "F|1|1|3|3": 36, "F|1|1|3|4": 47,
  "F|1|1|4|0": 13, "F|1|1|4|1": 23, "F|1|1|4|2": 36, "F|1|1|4|3": 50, "F|1|1|4|4": 63,
};

function ageBucketIndex(age: number) {
  if (age < 40) return 0;
  if (age < 50) return 1;
  if (age < 60) return 2;
  if (age < 70) return 3;
  return 4;
}
