import type { ConditionKey } from "../../types";

export type SymptomDuration = 
  | "Started today" 
  | "Last few days" 
  | "About 1–4 weeks" 
  | "About 1–3 months" 
  | "Longer than 3 months" 
  | "Comes and goes";

export const DURATION_OPTIONS: SymptomDuration[] = [
  "Started today",
  "Last few days",
  "About 1–4 weeks",
  "About 1–3 months",
  "Longer than 3 months",
  "Comes and goes",
];

export interface MasterSymptomItem {
  id: string;
  question: string;
  conditions: ConditionKey[];
  conditionNames: string[];
  isEmergency: boolean;
  stage: 1 | 2 | 3 | 4;
  stageName: string;
}

/**
 * Master Symptom Taxonomy — Single shared question bank of 34 verified plain-language screening checks.
 * Every symptom is asked once with a duration picker and feeds multiple underlying clinical engines.
 */
export const MASTER_SYMPTOM_TAXONOMY: MasterSymptomItem[] = [
  // ==========================================
  // STAGE 1: SUDDEN & ACUTE WELLBEING CHECKS
  // ==========================================
  {
    id: "face_droop",
    question: "Right now or in the last week — is one side of your face drooping?",
    conditions: ["stroke"],
    conditionNames: ["Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "arm_weakness",
    question: "Right now or in the last week — is one arm weak or drifting down?",
    conditions: ["stroke"],
    conditionNames: ["Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "speech_difficulty",
    question: "Right now or in the last week — is your speech slurred or hard to understand?",
    conditions: ["stroke"],
    conditionNames: ["Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "sudden_balance_loss",
    question: "Right now or in the last week — do you have sudden loss of balance?",
    conditions: ["stroke"],
    conditionNames: ["Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "thunderclap_headache",
    question: "Right now — do you have the worst, most sudden headache of your life?",
    conditions: ["stroke"],
    conditionNames: ["Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "chest_pain",
    question: "Do you feel chest discomfort, heaviness, or burning?",
    conditions: ["cvd", "hypertension", "ckd"],
    conditionNames: ["CVD", "BP", "CKD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "shortness_of_breath",
    question: "Are you more short of breath than usual, even resting or on mild activity?",
    conditions: ["cvd", "hypertension", "ckd"],
    conditionNames: ["CVD", "BP", "CKD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "pain_radiating_jaw_arm",
    question: "Does pain spread to your jaw, neck, or arm?",
    conditions: ["cvd"],
    conditionNames: ["CVD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "cold_sweats_fainting",
    question: "Do you have cold sweats, dizziness, or feel like fainting?",
    conditions: ["cvd"],
    conditionNames: ["CVD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "urine_no_output",
    question: "Have you passed very little or no urine today?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "severe_back_belly_pain",
    question: "Do you have severe pain in your back or belly?",
    conditions: ["hypertension"],
    conditionNames: ["BP"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "fruity_breath_smell",
    question: "Does your breath smell fruity or unusual?",
    conditions: ["diabetes"],
    conditionNames: ["Diabetes"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "breathing_fast_deep",
    question: "Are you breathing unusually fast or deep?",
    conditions: ["diabetes", "ckd"],
    conditionNames: ["Diabetes", "CKD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "vomiting_no_fluids",
    question: "Are you vomiting and unable to keep fluids down?",
    conditions: ["diabetes", "ckd"],
    conditionNames: ["Diabetes", "CKD"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },
  {
    id: "confusion_alertness",
    question: "Do you feel confused or having trouble staying alert?",
    conditions: ["diabetes", "hypertension", "ckd", "stroke"],
    conditionNames: ["Diabetes", "BP", "CKD", "Stroke"],
    isEmergency: true,
    stage: 1,
    stageName: "Sudden & Acute Wellbeing Checks",
  },

  // ==========================================
  // STAGE 2: ENERGY & BLOOD SUGAR BALANCE
  // ==========================================
  {
    id: "fatigue", // mapped to existing fatigue key + new wording
    question: "Do you feel unusually tired, even with rest?",
    conditions: ["diabetes", "cvd", "ckd"],
    conditionNames: ["Diabetes", "CVD", "CKD"],
    isEmergency: false,
    stage: 2,
    stageName: "Energy & Blood Sugar Balance",
  },
  {
    id: "weight_loss_unintentional",
    question: "Have you lost weight without trying?",
    conditions: ["diabetes"],
    conditionNames: ["Diabetes"],
    isEmergency: false,
    stage: 2,
    stageName: "Energy & Blood Sugar Balance",
  },
  {
    id: "polydipsia",
    question: "Are you thirstier than usual?",
    conditions: ["diabetes"],
    conditionNames: ["Diabetes"],
    isEmergency: false,
    stage: 2,
    stageName: "Energy & Blood Sugar Balance",
  },
  {
    id: "polyuria",
    question: "Are you urinating more often than usual?",
    conditions: ["diabetes"],
    conditionNames: ["Diabetes"],
    isEmergency: false,
    stage: 2,
    stageName: "Energy & Blood Sugar Balance",
  },
  {
    id: "hunger_increased",
    question: "Do you feel hungrier than usual?",
    conditions: ["diabetes"],
    conditionNames: ["Diabetes"],
    isEmergency: false,
    stage: 2,
    stageName: "Energy & Blood Sugar Balance",
  },

  // ==========================================
  // STAGE 3: KIDNEY & FLUID BALANCE
  // ==========================================
  {
    id: "urine_foamy",
    question: "Is your urine foamy or bubbly?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "nocturia",
    question: "Are you waking up at night to urinate more than before?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "swelling_legs",
    question: "Are your legs, ankles, or feet more swollen than usual?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "swelling_face",
    question: "Is the swelling around your eyes or face?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "skin_itching_unusual",
    question: "Do you have unusual itching on your skin?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "muscle_cramps_unusual",
    question: "Do you have muscle cramps that aren't normal for you?",
    conditions: ["ckd"],
    conditionNames: ["CKD"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },
  {
    id: "poor_appetite_nausea",
    question: "Do you have poor appetite or feel sick to your stomach?",
    conditions: ["ckd", "diabetes"],
    conditionNames: ["CKD", "Diabetes"],
    isEmergency: false,
    stage: 3,
    stageName: "Kidney & Fluid Balance",
  },

  // ==========================================
  // STAGE 4: HEART, BP & STROKE PREVENTION
  // ==========================================
  {
    id: "trouble_sleeping",
    question: "Are you having trouble sleeping?",
    conditions: ["cvd"],
    conditionNames: ["CVD"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "anxious_restless",
    question: "Do you feel anxious or restless without a clear reason?",
    conditions: ["cvd"],
    conditionNames: ["CVD"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "heart_palpitations",
    question: "Does your heart feel like it's racing, pounding, or skipping?",
    conditions: ["cvd"],
    conditionNames: ["CVD"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "headache_new_worse",
    question: "Do you have a new headache, or one that feels different/worse than your usual?",
    conditions: ["hypertension", "stroke"],
    conditionNames: ["BP", "Stroke"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "mild_dizzy_lightheaded",
    question: "Do you feel mildly dizzy or lightheaded?",
    conditions: ["hypertension"],
    conditionNames: ["BP"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "blurred_vision",
    question: "Have your eyes had blurred vision sometimes?",
    conditions: ["hypertension", "stroke"],
    conditionNames: ["BP", "Stroke"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
  {
    id: "tia_episode_history",
    question: "In the last 3 months, did you have a sudden episode of weakness, numbness, or trouble speaking that went away on its own within an hour?",
    conditions: ["stroke"],
    conditionNames: ["Stroke (ABCD2 trigger)"],
    isEmergency: false,
    stage: 4,
    stageName: "Heart Rhythm, BP & Circulation",
  },
];

export function getSymptomsByStage(stageNum: 1 | 2 | 3 | 4): MasterSymptomItem[] {
  return MASTER_SYMPTOM_TAXONOMY.filter((item) => item.stage === stageNum);
}

export function getSymptomById(id: string): MasterSymptomItem | undefined {
  return MASTER_SYMPTOM_TAXONOMY.find((item) => item.id === id);
}
