/**
 * Synthetic patients used ONLY by scripts/seed.ts. Never imported
 * into src/ — these are demo fixtures, not real data.
 */
import type { IntakePayload } from "../../types";

export const seedPatients: { payload: IntakePayload }[] = [
  {
    payload: {
      full_name: "Anjali Sharma", age: 54, sex: "F", village: "Nani Kharaj", phone: "98xxxxxxxx",
      vitals: { height_cm: 158, weight_kg: 72, systolic_bp: 168, diastolic_bp: 102, heart_rate: 88, waist_cm: 92 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: true, polydipsia: true, fatigue: true, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: true, family_hypertension: true, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { fasting_glucose_mg_dl: 142, hba1c_percent: 7.4, serum_creatinine_mg_dl: 0.9 },
    },
  },
  {
    payload: {
      full_name: "Ramesh Patel", age: 62, sex: "M", village: "Khanpur", phone: "98xxxxxxxx",
      vitals: { height_cm: 170, weight_kg: 78, systolic_bp: 148, diastolic_bp: 92, heart_rate: 80, waist_cm: 102 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: true, alcohol_units_per_week: 6, family_diabetes: false, family_hypertension: true, family_cvd: true, family_stroke: false, on_antihypertensive: true, on_statin: false },
      labs: { total_cholesterol_mg_dl: 245, hdl_mg_dl: 38, ldl_mg_dl: 160, serum_creatinine_mg_dl: 1.2 },
    },
  },
  {
    payload: {
      full_name: "Priya Desai", age: 32, sex: "F", village: "Sanosara", phone: "",
      vitals: { height_cm: 162, weight_kg: 58, systolic_bp: 118, diastolic_bp: 76, heart_rate: 72, waist_cm: 78 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Manoj Yadav", age: 58, sex: "M", village: "Rohat", phone: "98xxxxxxxx",
      vitals: { height_cm: 168, weight_kg: 65, systolic_bp: 188, diastolic_bp: 118, heart_rate: 96, waist_cm: 95 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: true, shortness_of_breath: true, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: true, alcohol_units_per_week: 4, family_diabetes: false, family_hypertension: true, family_cvd: true, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Sarojben Chaudhary", age: 67, sex: "F", village: "Bhimnath", phone: "98xxxxxxxx",
      vitals: { height_cm: 152, weight_kg: 55, systolic_bp: 132, diastolic_bp: 84, heart_rate: 78, waist_cm: 88 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: true, swelling_legs: true },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: true, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { serum_creatinine_mg_dl: 1.6 },
    },
  },
  {
    payload: {
      full_name: "Imran Sheikh", age: 45, sex: "M", village: "Tuka", phone: "98xxxxxxxx",
      vitals: { height_cm: 175, weight_kg: 82, systolic_bp: 142, diastolic_bp: 90, heart_rate: 84, waist_cm: 100 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 2, family_diabetes: false, family_hypertension: true, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { fasting_glucose_mg_dl: 108, hba1c_percent: 6.0 },
    },
  },
  {
    payload: {
      full_name: "Reena Kumari", age: 28, sex: "F", village: "Kalavad", phone: "98xxxxxxxx",
      vitals: { height_cm: 160, weight_kg: 54, systolic_bp: 110, diastolic_bp: 70, heart_rate: 72, waist_cm: 72 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Vasudev Joshi", age: 71, sex: "M", village: "Savarkundla", phone: "98xxxxxxxx",
      vitals: { height_cm: 165, weight_kg: 70, systolic_bp: 124, diastolic_bp: 78, heart_rate: 76, waist_cm: 92 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: true, family_stroke: true, on_antihypertensive: true, on_statin: true },
      labs: { serum_creatinine_mg_dl: 1.1, total_cholesterol_mg_dl: 180, hdl_mg_dl: 50, ldl_mg_dl: 100 },
    },
  },
  {
    payload: {
      full_name: "Jayvanti Parmar", age: 51, sex: "F", village: "Visavadar", phone: "98xxxxxxxx",
      vitals: { height_cm: 158, weight_kg: 68, systolic_bp: 158, diastolic_bp: 96, heart_rate: 88, waist_cm: 90 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: true, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: true, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Lakshmi Iyer", age: 36, sex: "F", village: "Mahuva", phone: "98xxxxxxxx",
      vitals: { height_cm: 162, weight_kg: 60, systolic_bp: 116, diastolic_bp: 74, heart_rate: 70, waist_cm: 76 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: true, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Chotu Prajapati", age: 49, sex: "M", village: "Dholka", phone: "98xxxxxxxx",
      vitals: { height_cm: 168, weight_kg: 76, systolic_bp: 138, diastolic_bp: 88, heart_rate: 86, waist_cm: 96 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: true, alcohol_units_per_week: 8, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { fasting_glucose_mg_dl: 102 },
    },
  },
  {
    payload: {
      full_name: "Geetaben Vaghela", age: 63, sex: "F", village: "Vallabhipur", phone: "98xxxxxxxx",
      vitals: { height_cm: 156, weight_kg: 64, systolic_bp: 176, diastolic_bp: 108, heart_rate: 92, waist_cm: 94 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: true, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: true, family_cvd: false, family_stroke: false, on_antihypertensive: true, on_statin: false },
      labs: { serum_creatinine_mg_dl: 1.3 },
    },
  },
  {
    payload: {
      full_name: "Arjun Solanki", age: 42, sex: "M", village: "Patan", phone: "",
      vitals: { height_cm: 172, weight_kg: 86, systolic_bp: 146, diastolic_bp: 92, heart_rate: 84, waist_cm: 104 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: true, polydipsia: true, fatigue: true, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 2, family_diabetes: true, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { fasting_glucose_mg_dl: 168, hba1c_percent: 8.1 },
    },
  },
  {
    payload: {
      full_name: "Hira Thakur", age: 56, sex: "F", village: "Bhanvad", phone: "98xxxxxxxx",
      vitals: { height_cm: 160, weight_kg: 70, systolic_bp: 150, diastolic_bp: 94, heart_rate: 88, waist_cm: 92 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: true, family_cvd: true, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Nitin Pandya", age: 33, sex: "M", village: "Unjha", phone: "98xxxxxxxx",
      vitals: { height_cm: 178, weight_kg: 80, systolic_bp: 122, diastolic_bp: 78, heart_rate: 72, waist_cm: 90 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Sumitra Naik", age: 60, sex: "F", village: "Khambhalia", phone: "98xxxxxxxx",
      vitals: { height_cm: 155, weight_kg: 62, systolic_bp: 144, diastolic_bp: 90, heart_rate: 82, waist_cm: 88 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: true, swelling_legs: true },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { serum_creatinine_mg_dl: 2.0 },
    },
  },
  {
    payload: {
      full_name: "Yash Trivedi", age: 25, sex: "M", village: "Halvad", phone: "98xxxxxxxx",
      vitals: { height_cm: 174, weight_kg: 70, systolic_bp: 118, diastolic_bp: 76, heart_rate: 70, waist_cm: 80 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Bhavna Chauhan", age: 48, sex: "F", village: "Sayla", phone: "98xxxxxxxx",
      vitals: { height_cm: 161, weight_kg: 72, systolic_bp: 162, diastolic_bp: 100, heart_rate: 90, waist_cm: 90 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: true, polydipsia: false, fatigue: true, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: true, family_hypertension: true, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: { fasting_glucose_mg_dl: 132 },
    },
  },
  {
    payload: {
      full_name: "Kalu Rawat", age: 69, sex: "M", village: "Idar", phone: "98xxxxxxxx",
      vitals: { height_cm: 167, weight_kg: 73, systolic_bp: 132, diastolic_bp: 84, heart_rate: 78, waist_cm: 94 },
      symptoms: { face_droop: true, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: true, family_cvd: false, family_stroke: true, on_antihypertensive: true, on_statin: false },
      labs: {},
    },
  },
  {
    payload: {
      full_name: "Pushpa Makwana", age: 44, sex: "F", village: "Chotila", phone: "98xxxxxxxx",
      vitals: { height_cm: 159, weight_kg: 70, systolic_bp: 130, diastolic_bp: 82, heart_rate: 80, waist_cm: 86 },
      symptoms: { face_droop: false, arm_weakness: false, speech_difficulty: false, chest_pain: false, shortness_of_breath: false, polyuria: false, polydipsia: false, fatigue: false, swelling_legs: false },
      history: { smoking: false, alcohol_units_per_week: 0, family_diabetes: false, family_hypertension: false, family_cvd: false, family_stroke: false, on_antihypertensive: false, on_statin: false },
      labs: {},
    },
  },
];
