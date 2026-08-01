import { runRiskEngine } from "../src/lib/riskEngine";
import { analyzeGap } from "../src/lib/riskEngine/gapAnalysis";

const samples: Record<string, any> = {
  "No labs at all": {
    full_name: "Test 1", age: 50, sex: "M",
    vitals: { height_cm: 170, weight_kg: 70, systolic_bp: 140, diastolic_bp: 90 },
    symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
    history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
    labs: {},
  },
  "Fasting glucose only": {
    full_name: "Test 2", age: 55, sex: "F",
    vitals: { height_cm: 165, weight_kg: 65, systolic_bp: 145, diastolic_bp: 92 },
    symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
    history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
    labs: { fasting_glucose_mg_dl: 130 },
  },
  "Partial lipid panel only": {
    full_name: "Test 3", age: 62, sex: "M",
    vitals: { height_cm: 168, weight_kg: 75, systolic_bp: 150, diastolic_bp: 94 },
    symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
    history: { smoking: true, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
    labs: { hdl_mg_dl: 40 },
  },
  "All labs present": {
    full_name: "Test 4", age: 58, sex: "M",
    vitals: { height_cm: 170, weight_kg: 72, systolic_bp: 138, diastolic_bp: 88 },
    symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
    history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
    labs: {
      fasting_glucose_mg_dl: 100, hba1c_percent: 5.8,
      total_cholesterol_mg_dl: 200, hdl_mg_dl: 50, ldl_mg_dl: 120, triglycerides_mg_dl: 150,
      serum_creatinine_mg_dl: 1.0, potassium_mmol_l: 4.0,
    },
  },
};

for (const [label, payload] of Object.entries(samples)) {
  const gaps = analyzeGap(payload);
  const engine = runRiskEngine(payload);
  console.log(`\n=== ${label} ===`);
  console.log(`Confidence: ${engine.confidence}`);
  console.log(`Gaps:`);
  if (gaps.length === 0) console.log("  (none)");
  for (const g of gaps) console.log(`  ${g.condition.padEnd(13)} → ${g.test}  (${g.reason})`);
}
