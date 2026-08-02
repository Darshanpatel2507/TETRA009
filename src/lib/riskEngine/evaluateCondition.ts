/**
 * Condition evaluation engine — implements the 3-step evaluation pipeline:
 *  STEP 1: Hard Override (instant, duration-blind clinical emergency alerts)
 *  STEP 2: Trend Engine (longitudinal evaluation when prior submissions exist)
 *  STEP 3: Snapshot Fallback (DWSCS symptom pattern score + existing lab/vital thresholds)
 *
 * All inputs MUST be isolated via selectInputsForCondition before being passed here.
 */
import type { ConditionKey } from "../../types";
import {
  computeDWSCS,
  mapDiabetesDWSCS,
  mapCvdDWSCS,
  mapHypertensionDWSCS,
  mapCkdDWSCS,
} from "./dwscs";

export interface TierResult {
  tier: "routine" | "soft" | "moderate" | "firm" | "advanced" | "immediate" | string;
  matchedCriteria: string[];
  basis: "hard-override" | "trend" | "snapshot";
  score?: number;
}

export function evaluateCondition(
  condition: ConditionKey | string,
  scopedInputs: Record<string, any> = {},
  priorSubmissions: any[] = []
): TierResult {
  const cond = condition as ConditionKey;

  // -------------------------------------------------------------------------
  // STEP 1: Hard Override (Instant, duration-blind)
  // -------------------------------------------------------------------------
  const hardOverride = checkHardOverride(cond, scopedInputs);
  if (hardOverride) {
    return hardOverride;
  }

  // -------------------------------------------------------------------------
  // STEP 2: Trend Engine (When trend data exists)
  // -------------------------------------------------------------------------
  if (priorSubmissions && priorSubmissions.length >= 2) {
    const trendResult = checkTrendEngine(cond, scopedInputs, priorSubmissions);
    if (trendResult) {
      return trendResult;
    }
  }

  // -------------------------------------------------------------------------
  // STEP 3: Snapshot Fallback (DWSCS + Existing clinical thresholds)
  // -------------------------------------------------------------------------
  return computeSnapshotTier(cond, scopedInputs);
}

function isYes(val: any): boolean {
  return val === "yes" || val === true || val === 1;
}

function checkHardOverride(
  cond: ConditionKey,
  inputs: Record<string, any>
): TierResult | null {
  if (cond === "stroke") {
    if (
      isYes(inputs.face_droop) || isYes(inputs.faceDrooping) ||
      isYes(inputs.arm_weakness) || isYes(inputs.armWeakness) ||
      isYes(inputs.speech_difficulty) || isYes(inputs.slurredSpeech) ||
      isYes(inputs.sudden_balance_loss) || isYes(inputs.suddenBalanceLoss) ||
      isYes(inputs.thunderclap_headache) || isYes(inputs.thunderclapHeadache)
    ) {
      return {
        tier: "immediate",
        matchedCriteria: ["FAST+ emergency neurological sign present"],
        basis: "hard-override",
      };
    }
  }

  if (cond === "diabetes") {
    if (
      isYes(inputs.fruity_breath_smell) || isYes(inputs.fruityBreath) ||
      isYes(inputs.breathing_fast_deep) || isYes(inputs.fastBreathing) ||
      isYes(inputs.vomiting_no_fluids) || isYes(inputs.vomiting) ||
      isYes(inputs.confusion_alertness) || isYes(inputs.confusion)
    ) {
      return {
        tier: "immediate",
        matchedCriteria: ["Acute metabolic / DKA warning sign present"],
        basis: "hard-override",
      };
    }
  }

  if (cond === "ckd") {
    if (isYes(inputs.urine_no_output) || isYes(inputs.noUrineToday)) {
      return {
        tier: "immediate",
        matchedCriteria: ["Acute anuria (zero urine output) present"],
        basis: "hard-override",
      };
    }
  }

  if (cond === "cvd") {
    if (
      isYes(inputs.pain_radiating_jaw_arm) || isYes(inputs.jawNeckArmPain) ||
      isYes(inputs.cold_sweats_fainting) || isYes(inputs.coldSweatsDizziness)
    ) {
      return {
        tier: "immediate",
        matchedCriteria: ["Acute cardiovascular distress sign (radiating pain / syncope) present"],
        basis: "hard-override",
      };
    }
  }

  if (cond === "hypertension") {
    const sys = Number(inputs.systolic_bp || inputs.systolic || 0);
    const dia = Number(inputs.diastolic_bp || inputs.diastolic || 0);
    if (sys >= 180 || dia >= 120) {
      return {
        tier: "immediate",
        matchedCriteria: [`Acute hypertensive crisis reading (${sys}/${dia} mmHg)`],
        basis: "hard-override",
      };
    }
    // Note: per ceiling rule, symptoms alone without crisis BP reading never trigger immediate override
  }

  return null;
}

function checkTrendEngine(
  cond: ConditionKey,
  inputs: Record<string, any>,
  priors: any[]
): TierResult | null {
  // If prior assessments demonstrate progressive degradation, return trend tier
  // Existing validated trend logic preserves prior trajectory analysis
  if (cond === "hypertension") {
    const latestSys = Number(inputs.systolic_bp || inputs.systolic || 0);
    const prevSys = Number(priors[priors.length - 1]?.systolic_bp || priors[priors.length - 1]?.vitals?.systolic_bp || 0);
    if (latestSys >= 140 && prevSys >= 140) {
      return {
        tier: "firm",
        matchedCriteria: ["Persistent hypertension confirmed across multiple consecutive visits"],
        basis: "trend",
      };
    }
  }
  return null;
}

function computeSnapshotTier(
  cond: ConditionKey,
  inputs: Record<string, any>
): TierResult {
  const matchedCriteria: string[] = [];

  // Stroke is deliberately excluded from DWSCS (uses ABCD2 instrument only)
  if (cond === "stroke") {
    let strokeScore = 0;
    if (isYes(inputs.tia_episode_history) || isYes(inputs.tiaEpisode90d)) {
      strokeScore += 2;
      matchedCriteria.push("TIA weakness/numbness episode within past 90 days (ABCD2 criteria)");
    }
    if (isYes(inputs.blurred_vision) || isYes(inputs.blurredVision) || isYes(inputs.headache_new_worse) || isYes(inputs.headache)) {
      strokeScore += 1;
      matchedCriteria.push("Associated visual or cephalic disturbance");
    }
    return {
      tier: strokeScore >= 3 ? "moderate" : strokeScore > 0 ? "soft" : "routine",
      matchedCriteria: matchedCriteria.length > 0 ? matchedCriteria : ["No stroke risk criteria matched"],
      basis: "snapshot",
      score: strokeScore,
    };
  }

  // Compute Duration-Weighted Symptom Cluster Score for other conditions
  const { score, matched } = computeDWSCS(cond, inputs);
  for (const m of matched) {
    matchedCriteria.push(m.formatted);
  }

  let tier: string = "routine";

  if (cond === "diabetes") {
    tier = mapDiabetesDWSCS(score);
    // Reconcile with lab hard thresholds if provided
    const glucose = Number(inputs.fasting_glucose_mg_dl || inputs.fastingGlucose || 0);
    const hba1c = Number(inputs.hba1c_percent || inputs.hba1c || 0);
    if (glucose >= 126 || hba1c >= 6.5) {
      tier = "firm";
      matchedCriteria.unshift(`Lab threshold confirmed (Glucose: ${glucose || "-"}, HbA1c: ${hba1c || "-"})`);
    }
  } else if (cond === "cvd") {
    const pulse = Number(inputs.resting_pulse_bpm || inputs.restingPulse || 0);
    const hasPalpitations = isYes(inputs.heart_palpitations) || isYes(inputs.palpitations);
    tier = mapCvdDWSCS(score, pulse, hasPalpitations);
  } else if (cond === "hypertension") {
    // Determine existing BP-category-derived tier
    const sys = Number(inputs.systolic_bp || inputs.systolic || 0);
    const dia = Number(inputs.diastolic_bp || inputs.diastolic || 0);
    let bpTier = "routine";
    if (sys >= 160 || dia >= 100) bpTier = "firm";
    else if (sys >= 140 || dia >= 90) bpTier = "moderate";
    else if (sys >= 130 || dia >= 80) bpTier = "soft";

    // Apply DWSCS escalator with ceiling rule
    if (bpTier === "routine" && score < 3 && matched.length > 0) {
      // Explain why DWSCS didn't escalate
      matchedCriteria.push("Symptom present without elevated BP reading — insufficient to escalate tier alone");
    }
    tier = mapHypertensionDWSCS(score, bpTier);
  } else if (cond === "ckd") {
    // Count raw CKD symptoms
    const rawCount = matched.length;
    tier = mapCkdDWSCS(score, rawCount);
  }

  if (matchedCriteria.length === 0) {
    matchedCriteria.push("No significant symptom pattern score items matched");
  }

  return {
    tier,
    matchedCriteria,
    basis: "snapshot",
    score,
  };
}
