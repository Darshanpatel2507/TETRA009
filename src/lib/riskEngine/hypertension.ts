/**
 * JNC8 staging for adults ≥18. Adapted for the rural clinic context.
 *   Normal:        <120 / <80
 *   Elevated:      120–129 / <80
 *   Stage 1:       130–139 / 80–89
 *   Stage 2:       ≥140 / ≥90
 *   Crisis:        >180 / >120
 *
 * Hypertensive urgency / emergency is critical band.
 */
export interface BpInput {
  systolic: number;
  diastolic: number;
  on_antihypertensive: boolean;
}

export interface BpOutput {
  band: "low" | "moderate" | "high" | "critical";
  stage: string;
  value: number; // map
}

export function scoreBp(i: BpInput): BpOutput {
  const s = i.systolic, d = i.diastolic;
  if (!s || !d) return { band: "low", stage: "Unknown", value: 0 };

  if (s >= 180 || d >= 120) {
    return { band: "critical", stage: "Hypertensive crisis", value: mapBp(s, d) };
  }
  if (s >= 160 || d >= 100) {
    return { band: "high", stage: "Stage 2 hypertension", value: mapBp(s, d) };
  }
  if (s >= 140 || d >= 90) {
    return { band: "high", stage: "Stage 2 hypertension", value: mapBp(s, d) };
  }
  if (s >= 130 || d >= 80) {
    return { band: "moderate", stage: "Stage 1 hypertension", value: mapBp(s, d) };
  }
  if (s >= 120) {
    return { band: "low", stage: "Elevated", value: mapBp(s, d) };
  }
  return { band: "low", stage: "Normal", value: mapBp(s, d) };
}

function mapBp(s: number, d: number) {
  // MAP for pulse-pressure less relevant for staging, but used downstream
  return Math.round((s + 2 * d) / 3);
}

export const bpLabel = (s: number, d: number) => `${s}/${d} mmHg`;
