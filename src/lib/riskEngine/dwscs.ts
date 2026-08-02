/**
 * Duration-Weighted Symptom Cluster Score (DWSCS)
 *
 * IMPORTANT NOTE:
 * Every weight and multiplier introduced here is a constructed, transparent heuristic —
 * not an independently validated clinical score. ABCD2, the ADA glucose criteria, and the
 * ACC/AHA BP categories are validated instruments; DWSCS is not.
 * It is ALWAYS labeled as "symptom pattern score", never "clinical score".
 * It operates only inside STEP 3 (snapshot fallback) when trend data or hard overrides are absent.
 */
import type { ConditionKey } from "../../types";

export type DurationValue = string;

export interface DWSCSMatch {
  symptom: string;
  duration: DurationValue;
  contribution: number;
  formatted: string;
}

export interface DWSCSResult {
  score: number;
  matched: DWSCSMatch[];
}

/**
 * Duration multiplier heuristic scale
 */
export function getDurationMultiplier(val?: string): number {
  if (!val) return 1.0;
  const clean = val.toLowerCase().replace(/[\s–—\-]/g, "");
  if (clean.includes("today") || clean === "startedtoday") return 1.0;
  if (clean.includes("fewdays") || clean === "lastfewdays") return 1.0;
  if (clean.includes("1to4weeks") || clean.includes("14weeks") || clean.includes("about14weeks") || clean === "about1to4weeks") return 1.25;
  if (clean.includes("1to3months") || clean.includes("13months") || clean.includes("about13months") || clean === "about1to3months") return 1.5;
  if (clean.includes("longer") || clean.includes("morethan3") || clean === "longerthan3months") return 1.75;
  if (clean.includes("comesandgoes") || clean === "comesandgoes") return 1.4;
  return 1.0;
}

/**
 * Base symptom weights per condition (only non-emergency, non-hard-threshold items get a weight).
 * Stroke is deliberately excluded from DWSCS (uses ABCD2 and FAST/BE-FAST only).
 */
export const DWSCS_WEIGHTS: Record<ConditionKey, Record<string, number>> = {
  diabetes: {
    polydipsia: 3,
    thirst: 3,
    polyuria: 3,
    frequentUrination: 3,
    weight_loss_unintentional: 2,
    weightLoss: 2,
    hunger_increased: 2,
    hunger: 2,
    poor_appetite_nausea: 1,
    poorAppetite: 1,
    fatigue: 1,
  },
  cvd: {
    heart_palpitations: 3,
    palpitations: 3,
    chest_pain: 3,
    chestDiscomfort: 3,
    fatigue: 2,
    trouble_sleeping: 2,
    sleepTrouble: 2,
    shortness_of_breath: 2,
    shortnessOfBreath: 2,
    anxious_restless: 1,
    anxious: 1,
  },
  hypertension: {
    headache_new_worse: 2,
    headache: 2,
    blurred_vision: 1.5,
    blurredVision: 1.5,
    mild_dizzy_lightheaded: 1.5,
    dizziness: 1.5,
  },
  ckd: {
    swelling_legs: 2,
    swelling: 2,
    urine_foamy: 2,
    foamyUrine: 2,
    nocturia: 1.5,
    nightUrination: 1.5,
    skin_itching_unusual: 1.5,
    itching: 1.5,
    muscle_cramps_unusual: 1.5,
    muscleCramps: 1.5,
    joint_pain: 1.5,
    jointPain: 1.5, // Added heuristic extension for CKD uremic symptom picture
    fatigue: 1,
    poor_appetite_nausea: 1,
    poorAppetite: 1,
  },
  stroke: {}, // Deliberately empty per spec
};

export function computeDWSCS(
  condition: ConditionKey | string,
  scopedInputs: Record<string, any> = {}
): DWSCSResult {
  const cond = condition as ConditionKey;
  const weights = DWSCS_WEIGHTS[cond] || {};
  const matched: DWSCSMatch[] = [];
  let score = 0;

  const handledBaseKeys = new Set<string>();

  for (const [fieldId, weight] of Object.entries(weights)) {
    const isPresent =
      scopedInputs[fieldId] === "yes" ||
      scopedInputs[fieldId] === true ||
      scopedInputs[fieldId] === 1;

    if (isPresent) {
      // Prevent double counting if both canonical ID and alias were provided in payload
      const canonKey = getCanonicalSymptomKey(fieldId);
      if (handledBaseKeys.has(canonKey)) continue;
      handledBaseKeys.add(canonKey);

      const durationStr =
        scopedInputs[`${fieldId}_duration`] ||
        (scopedInputs.durations ? scopedInputs.durations[fieldId] : undefined) ||
        "Started today";
      
      const durationVal = String(durationStr);
      const mult = getDurationMultiplier(durationVal);
      const contribution = weight * mult;
      score += contribution;

      matched.push({
        symptom: fieldId,
        duration: durationVal,
        contribution,
        formatted: `${fieldId} (${durationVal}) — symptom pattern score contribution: ${contribution.toFixed(1)}`,
      });
    }
  }

  return { score, matched };
}

function getCanonicalSymptomKey(key: string): string {
  if (key === "thirst") return "polydipsia";
  if (key === "frequentUrination") return "polyuria";
  if (key === "weightLoss") return "weight_loss_unintentional";
  if (key === "hunger") return "hunger_increased";
  if (key === "poorAppetite") return "poor_appetite_nausea";
  if (key === "palpitations") return "heart_palpitations";
  if (key === "chestDiscomfort") return "chest_pain";
  if (key === "sleepTrouble") return "trouble_sleeping";
  if (key === "shortnessOfBreath") return "shortness_of_breath";
  if (key === "anxious") return "anxious_restless";
  if (key === "headache") return "headache_new_worse";
  if (key === "blurredVision") return "blurred_vision";
  if (key === "dizziness") return "mild_dizzy_lightheaded";
  if (key === "swelling") return "swelling_legs";
  if (key === "foamyUrine") return "urine_foamy";
  if (key === "nightUrination") return "nocturia";
  if (key === "itching") return "skin_itching_unusual";
  if (key === "muscleCramps") return "muscle_cramps_unusual";
  if (key === "jointPain") return "joint_pain";
  return key;
}

// ============================================================================
// Threshold evaluators for each condition
// ============================================================================

export function mapDiabetesDWSCS(score: number): "routine" | "soft" | "firm" {
  if (score >= 8) return "firm";
  if (score >= 4) return "soft";
  return "routine";
}

export function mapCvdDWSCS(
  score: number,
  restingPulse: number = 0,
  hasPalpitations: boolean = false
): "routine" | "soft" | "moderate" | "firm" {
  if (score >= 9) {
    if (restingPulse >= 100 || hasPalpitations) {
      return "firm";
    }
    return "moderate"; // Capped without corroborating signal
  }
  if (score >= 6) return "moderate";
  if (score >= 3) return "soft";
  return "routine";
}

/**
 * Hypertension DWSCS acts strictly as an escalator on top of existing BP tier.
 * Ceiling Rule: cannot reach 'firm' or 'immediate' on symptoms alone without elevated BP reading.
 */
export function mapHypertensionDWSCS(score: number, currentTier: string): string {
  if (score < 3) return currentTier || "routine";
  // Escalate by one step, capped at 'moderate'
  if (currentTier === "routine" || !currentTier || currentTier === "low") return "soft";
  if (currentTier === "soft") return "moderate";
  // If already at moderate or higher from BP reading, keep it as is (capped at moderate for symptoms alone)
  return currentTier;
}

/**
 * CKD DWSCS combines with existing raw symptom counts as an OR condition.
 */
export function mapCkdDWSCS(
  score: number,
  rawCount: number
): "routine" | "moderate" | "advanced" | "immediate" {
  if (rawCount >= 3 || score >= 9) return "advanced";
  if (rawCount >= 2 || score >= 5) return "moderate";
  return "routine";
}
