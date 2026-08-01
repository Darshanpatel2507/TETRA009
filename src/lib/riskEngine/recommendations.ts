export type DisplayTier = 'all-clear' | 'needs-attention' | '48-hours' | 'immediate';
export type InternalSeverity = 'none' | 'soft' | 'moderate' | 'firm' | 'immediate' | 'low' | 'high' | 'critical' | 'advanced';
export type ConditionName = 'Diabetes' | 'Hypertension' | 'CVD' | 'Stroke' | 'CKD' | 'General';

/**
 * Maps granular internal severities to the simplified 4-word user-facing status vocabulary.
 */
export function toDisplayTier(internal: InternalSeverity | string): DisplayTier {
  const norm = (internal || '').toLowerCase();
  if (norm === 'none' || norm === 'low' || norm === 'routine' || norm === 'safe') return 'all-clear';
  if (norm === 'immediate' || norm === 'critical') return 'immediate';
  if (norm === 'firm' || norm === 'high' || norm === 'advanced') return '48-hours';
  // 'soft' + 'moderate' + anything else collapses into needs-attention
  return 'needs-attention';
}

export function displayTierLabel(tier: DisplayTier): string {
  switch (tier) {
    case 'all-clear':
      return 'All Clear';
    case 'needs-attention':
      return 'Needs Attention';
    case '48-hours':
      return '48 Hours';
    case 'immediate':
      return 'Immediate';
    default:
      return 'All Clear';
  }
}

export interface TestRecommendation {
  action: string;
  deadline: string;
}

/**
 * Mandatory concrete deadlines table. No test recommendation is allowed without a specific timeframe.
 */
export const RECOMMENDATION_TABLE: Record<string, Record<string, TestRecommendation>> = {
  Diabetes: {
    soft: { action: "HbA1c or fasting glucose blood test", deadline: "within 6 weeks" },
    moderate: { action: "HbA1c or fasting glucose blood test", deadline: "within 4 weeks" },
    firm: { action: "HbA1c or fasting glucose blood test", deadline: "within 2 weeks" },
    high: { action: "HbA1c or fasting glucose blood test", deadline: "within 2 weeks" },
    immediate: { action: "Emergency clinical evaluation (DKA or acute glucose crisis pattern)", deadline: "now" },
    critical: { action: "Emergency clinical evaluation (DKA or acute glucose crisis pattern)", deadline: "now" },
  },
  Hypertension: {
    soft: { action: "Home blood pressure tracking + health worker check-up", deadline: "within 6 weeks" },
    moderate: { action: "Doctor blood pressure review & diagnostic check-up", deadline: "within 3 weeks" },
    firm: { action: "Priority doctor clinical consultation", deadline: "within 3 days" },
    high: { action: "Priority doctor clinical consultation", deadline: "within 3 days" },
    immediate: { action: "Emergency room evaluation for acute blood pressure crisis", deadline: "now" },
    critical: { action: "Emergency room evaluation for acute blood pressure crisis", deadline: "now" },
  },
  CVD: {
    soft: { action: "Doctor heart health check-up & lipid panel", deadline: "within 6 weeks" },
    moderate: { action: "Doctor circulatory health evaluation", deadline: "within 3 weeks" },
    firm: { action: "Priority doctor cardiac visit & ECG screening", deadline: "within 3 days" },
    high: { action: "Priority doctor cardiac visit & ECG screening", deadline: "within 3 days" },
    immediate: { action: "Emergency cardiac transport and acute care", deadline: "now" },
    critical: { action: "Emergency cardiac transport and acute care", deadline: "now" },
  },
  Stroke: {
    soft: { action: "Preventive neurology check-up & vascular review", deadline: "within 6 weeks" },
    moderate: { action: "Doctor neurology evaluation (ABCD2 screening score ≥4)", deadline: "within 4 weeks" },
    firm: { action: "Priority doctor urgent evaluation (TIA pattern within 7 days)", deadline: "same day" },
    high: { action: "Priority doctor urgent evaluation (TIA pattern within 7 days)", deadline: "same day" },
    immediate: { action: "Emergency hospital services via FAST protocol", deadline: "now" },
    critical: { action: "Emergency hospital services via FAST protocol", deadline: "now" },
  },
  CKD: {
    soft: { action: "Routine urine protein and kidney function test", deadline: "within 6 weeks" },
    moderate: { action: "Kidney function blood eGFR + urine albumin test", deadline: "within 3–4 weeks" },
    advanced: { action: "Doctor & nephrology specialist examination", deadline: "within 1–2 weeks" },
    firm: { action: "Doctor & nephrology specialist examination", deadline: "within 1–2 weeks" },
    high: { action: "Doctor & nephrology specialist examination", deadline: "within 1–2 weeks" },
    immediate: { action: "Emergency nephrology hospital triage", deadline: "now" },
    critical: { action: "Emergency nephrology hospital triage", deadline: "now" },
  },
  General: {
    soft: { action: "Routine preventive health worker review", deadline: "within 6 weeks" },
    moderate: { action: "General doctor comprehensive check-up", deadline: "within 3 weeks" },
    firm: { action: "Priority outpatient doctor consultation", deadline: "within 3 days" },
    high: { action: "Priority outpatient doctor consultation", deadline: "within 3 days" },
    immediate: { action: "Immediate medical triage and facility transport", deadline: "now" },
    critical: { action: "Immediate medical triage and facility transport", deadline: "now" },
  }
};

/**
 * Retrieves the recommended test with a guaranteed deadline for any condition and internal severity.
 */
export function getRecommendation(condition: ConditionName | string, severity: InternalSeverity | string): TestRecommendation {
  const condTable = RECOMMENDATION_TABLE[condition] || RECOMMENDATION_TABLE["General"];
  const normSeverity = (severity || "").toLowerCase();
  
  if (normSeverity === "none" || normSeverity === "low" || normSeverity === "safe" || normSeverity === "routine") {
    return { action: "Maintain daily nutrition, sleep, and physical activity routines", deadline: "ongoing daily" };
  }
  
  return condTable[normSeverity] || condTable["moderate"] || { action: "General doctor clinical checkup", deadline: "within 3 weeks" };
}
