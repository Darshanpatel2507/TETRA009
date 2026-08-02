/**
 * Single source of truth: which form field IDs feed which condition.
 * Generated directly from the "Feeds condition(s)" column of the master taxonomy —
 * do not hand-maintain a second copy of this mapping anywhere else.
 */
import type { ConditionKey } from "../../types";
import { MASTER_SYMPTOM_TAXONOMY } from "../taxonomy/masterSymptomTaxonomy";

export const CONDITIONS: ConditionKey[] = ["diabetes", "hypertension", "cvd", "ckd", "stroke"];

// Alias map to ensure backward/test-fixture compatibility without hand-maintaining duplicate sets
const SYMPTOM_ALIASES: Record<string, string[]> = {
  polydipsia: ["thirst"],
  polyuria: ["frequentUrination"],
  weight_loss_unintentional: ["weightLoss"],
  hunger_increased: ["hunger"],
  poor_appetite_nausea: ["poorAppetite"],
  heart_palpitations: ["palpitations"],
  chest_pain: ["chestDiscomfort"],
  trouble_sleeping: ["sleepTrouble"],
  shortness_of_breath: ["shortnessOfBreath"],
  anxious_restless: ["anxious"],
  headache_new_worse: ["headache"],
  blurred_vision: ["blurredVision"],
  mild_dizzy_lightheaded: ["dizziness"],
  swelling_legs: ["swelling"],
  urine_foamy: ["foamyUrine"],
  nocturia: ["nightUrination"],
  skin_itching_unusual: ["itching"],
  muscle_cramps_unusual: ["muscleCramps"],
  joint_pain: ["jointPain"],
  tia_episode_history: ["tiaEpisode90d"],
  face_droop: ["faceDrooping"],
  arm_weakness: ["armWeakness"],
  speech_difficulty: ["slurredSpeech"],
  sudden_balance_loss: ["suddenBalanceLoss"],
  thunderclap_headache: ["thunderclapHeadache"],
  confusion_alertness: ["confusion"],
  fruity_breath_smell: ["fruityBreath"],
  breathing_fast_deep: ["fastBreathing"],
  vomiting_no_fluids: ["vomiting"],
  pain_radiating_jaw_arm: ["jawNeckArmPain"],
  cold_sweats_fainting: ["coldSweatsDizziness"],
  urine_no_output: ["noUrineToday"],
  severe_back_belly_pain: ["severeAbdominalPain"],
  swelling_face: ["facialSwelling"]
};

export const TAXONOMY_FIELDS_FOR: Record<ConditionKey, string[]> = {
  diabetes: [],
  hypertension: [],
  cvd: [],
  ckd: [],
  stroke: [],
};

for (const item of MASTER_SYMPTOM_TAXONOMY) {
  for (const cond of item.conditions) {
    if (!TAXONOMY_FIELDS_FOR[cond]) TAXONOMY_FIELDS_FOR[cond] = [];
    if (!TAXONOMY_FIELDS_FOR[cond].includes(item.id)) {
      TAXONOMY_FIELDS_FOR[cond].push(item.id);
    }
    // Also register aliases for isolation boundary filtering
    if (SYMPTOM_ALIASES[item.id]) {
      for (const alias of SYMPTOM_ALIASES[item.id]) {
        if (!TAXONOMY_FIELDS_FOR[cond].includes(alias)) {
          TAXONOMY_FIELDS_FOR[cond].push(alias);
        }
      }
    }
  }
}
