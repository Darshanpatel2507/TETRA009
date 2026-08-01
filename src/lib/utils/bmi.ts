/**
 * BMI = kg / m². Returns null if inputs are missing/zero.
 * Categorisation per WHO Asia-Pacific thresholds (more relevant
 * for rural South Asian populations than the global cutoffs).
 */
export function bmi(weightKg: number | undefined, heightCm: number | undefined): number | null {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  if (m <= 0) return null;
  return weightKg / (m * m);
}

export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese-1"
  | "obese-2";

export function bmiCategory(b: number | null): BmiCategory | null {
  if (b == null) return null;
  if (b < 18.5) return "underweight";
  if (b < 23) return "normal";       // Asia-Pacific: 23 not 25
  if (b < 27.5) return "overweight";
  if (b < 32.5) return "obese-1";
  return "obese-2";
}

export const bmiLabel: Record<BmiCategory, string> = {
  underweight: "Underweight",
  normal: "Normal",
  overweight: "Overweight",
  "obese-1": "Obese class I",
  "obese-2": "Obese class II",
};
