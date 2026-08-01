// =============================================================
// Nirog shared types — kept in one place so the risk engine,
// hooks, components, and the seed script all agree.
// =============================================================

/** A condition we can score. */
export type ConditionKey =
  | "diabetes"
  | "hypertension"
  | "cvd"
  | "ckd"
  | "stroke";

/** The four urgency bands the decision engine can return. */
export type RiskBand = "low" | "moderate" | "high" | "critical";

/** Localised labels — populated in i18n; clients may resolve. */
export type Locale = "en" | "hi" | "gu";

/** ---- Patient (matches public.patients) ---- */
export interface Patient {
  id: string;
  full_name: string;
  age: number;
  sex: "M" | "F";
  village: string | null;
  phone: string | null;
  portal_type?: "community" | "personal";
  family_code?: string;
  relationship?: string;
  created_at: string;
}

/** ---- Risk assessment (matches public.risk_assessments) ---- */
export interface Assessment {
  id: string;
  patient_id: string;
  assessed_at: string;
  band: RiskBand;
  scores: Record<ConditionKey, ConditionScore>;
  factors: FactorRow[];
  gap_labs: GapLab[];
  specialist: SpecialistRef;
  decision: DecisionOutput;
  confidence: "lab-confirmed" | "screened";
  notes: string | null;
}

/** Per-condition score rolled into an assessment. */
export interface ConditionScore {
  band: RiskBand;
  /** Primary numeric the condition is graded on (e.g. BP, eGFR, IDRS) */
  value: number | null;
  /** Sub-band / stage label, e.g. "Stage 2", "Moderate" */
  stage: string;
  /** Optional ML probability if module B is enabled. */
  ml_probability?: number;
}

export interface FactorRow {
  condition: ConditionKey;
  label: string;
  value: string;
  weight: number; // 0..1 contribution to urgency
  source: "idrs" | "jnc8" | "who-ish" | "ckd-epi" | "fast" | "history" | "vitals" | "labs";
}

export interface GapLab {
  condition: ConditionKey;
  test: string;
  reason: string;
}

export interface SpecialistRef {
  primary: string;
  secondary?: string;
  reason: string;
}

export interface DecisionOutput {
  band: RiskBand;
  /** Human-readable summary e.g. "Immediate — FAST stroke screen positive" */
  rationale: string;
  /** Action label e.g. "Referral now", "48-hour referral", "Routine annual" */
  action: string;
}

/** ---- Referral (matches public.referrals) ---- */
export interface Referral {
  id: string;
  patient_id: string;
  assessment_id: string;
  specialist: string;
  status: "pending" | "sent" | "completed";
  created_at: string;
  notes: string | null;
}

/** ---- Intake form payload (typed for clarity in the wizard) ---- */
export interface IntakePayload {
  full_name: string;
  age: number;
  sex: "M" | "F";
  village?: string;
  phone?: string;
  portal_type?: "community" | "personal";
  family_code?: string;
  relationship?: string;

  vitals: {
    height_cm: number;
    weight_kg: number;
    systolic_bp: number;
    diastolic_bp: number;
    heart_rate?: number;
    waist_cm?: number;
  };

  symptoms: {
    /** FAST flags */
    face_droop: boolean;
    arm_weakness: boolean;
    speech_difficulty: boolean;
    time_of_onset?: string;
    /** General */
    chest_pain: boolean;
    shortness_of_breath: boolean;
    polyuria: boolean;
    polydipsia: boolean;
    fatigue: boolean;
    swelling_legs: boolean;
  };

  history: {
    smoking: boolean;
    alcohol_units_per_week: number;
    family_diabetes: boolean;
    family_hypertension: boolean;
    family_cvd: boolean;
    family_stroke: boolean;
    on_antihypertensive: boolean;
    on_statin: boolean;
  };

  /** Lab fields are all optional — engines degrade gracefully when missing */
  labs?: {
    fasting_glucose_mg_dl?: number;
    hba1c_percent?: number;
    total_cholesterol_mg_dl?: number;
    hdl_mg_dl?: number;
    ldl_mg_dl?: number;
    triglycerides_mg_dl?: number;
    serum_creatinine_mg_dl?: number;
    potassium_mmol_l?: number;
  };
}
