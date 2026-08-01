import type { Patient, Assessment } from "../types";

export interface PatientMeta {
  portal_type?: "community" | "personal" | "family";
  family_code?: string;
  relationship?: string;
}

const STORAGE_KEY = "sahayak_patient_meta_v1";
const LOCAL_NEW_MEMBERS_KEY = "sahayak_local_personal_members_v1";

export function getMetadataMap(): Record<string, PatientMeta> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePatientMetadata(id: string, meta: PatientMeta) {
  if (typeof window === "undefined" || !id) return;
  try {
    const map = getMetadataMap();
    map[id] = { ...(map[id] || {}), ...meta };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function mergePatientWithMetadata(patient: Patient): Patient {
  const map = getMetadataMap();
  const meta = map[patient.id] || {};
  return {
    ...patient,
    portal_type: patient.portal_type || meta.portal_type || "community",
    family_code: patient.family_code || meta.family_code,
    relationship: patient.relationship || meta.relationship,
  };
}

/** 
 * Built-in realistic Demo Family profiles for Family Group #7392 so users have instant demonstration data.
 */
export const DEMO_FAMILY_MEMBERS: { patient: Patient; assessment: Assessment }[] = [
  {
    patient: {
      id: "demo-pat-1",
      full_name: "Rajesh Patel",
      age: 58,
      sex: "M",
      village: "Ahmedabad Community",
      phone: "+91 98234-56789",
      portal_type: "family",
      family_code: "7392",
      relationship: "Father (Head of Family)",
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    assessment: {
      id: "demo-ass-1",
      patient_id: "demo-pat-1",
      assessed_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      band: "moderate",
      confidence: "screened",
      notes: "Home blood pressure checks indicated mild Stage 1 tension.",
      scores: {
        hypertension: { band: "moderate", stage: "Stage 1 blood pressure tension", value: 138 },
        diabetes: { band: "low", stage: "Safe & balanced blood sugar", value: 98 },
        cvd: { band: "moderate", stage: "Moderate circulatory observation due to age", value: 12 },
        ckd: { band: "low", stage: "Healthy kidney clearance", value: 95 },
        stroke: { band: "low", stage: "All neural signs responsive & normal", value: 0 },
      },
      factors: [
        { condition: "hypertension", label: "Systolic Blood Pressure", value: "138 mmHg", weight: 0.5, source: "vitals" },
        { condition: "cvd", label: "Age Group", value: "58 Years Old", weight: 0.4, source: "history" }
      ],
      gap_labs: [
        { condition: "diabetes", test: "Fasting HbA1c Lab Check", reason: "Annual health verification for family elders" }
      ],
      specialist: {
        primary: "Community Cardiologist & General Physician",
        reason: "Mild stage 1 blood pressure reading observed during routine family evaluation."
      },
      decision: {
        band: "moderate",
        rationale: "Elevated systolic blood pressure (Stage 1 Hypertension). Regularly monitor BP at home and limit excess salt.",
        action: "Routine Checkup & Home Blood Pressure Monitoring"
      }
    }
  },
  {
    patient: {
      id: "demo-pat-2",
      full_name: "Sunita Patel",
      age: 54,
      sex: "F",
      village: "Ahmedabad Community",
      phone: "+91 98234-56788",
      portal_type: "family",
      family_code: "7392",
      relationship: "Mother",
      created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    },
    assessment: {
      id: "demo-ass-2",
      patient_id: "demo-pat-2",
      assessed_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      band: "low",
      confidence: "screened",
      notes: "Excellent overall physical fitness and nutrition.",
      scores: {
        hypertension: { band: "low", stage: "Normal healthy blood pressure", value: 118 },
        diabetes: { band: "low", stage: "Balanced glycemic energy", value: 90 },
        cvd: { band: "low", stage: "Strong cardiovascular heartbeat", value: 5 },
        ckd: { band: "low", stage: "Normal filtration clearance", value: 99 },
        stroke: { band: "low", stage: "No neural symptoms", value: 0 },
      },
      factors: [],
      gap_labs: [],
      specialist: {
        primary: "General Wellness Checkup Clinic",
        reason: "Regular preventative annual health checkup."
      },
      decision: {
        band: "low",
        rationale: "All vital indices and physiological checkups within excellent safe ranges.",
        action: "Maintain healthy daily nutrition & routine walking"
      }
    }
  },
  {
    patient: {
      id: "demo-pat-3",
      full_name: "Ananya Patel",
      age: 22,
      sex: "F",
      village: "Ahmedabad Community",
      phone: "+91 98234-56787",
      portal_type: "family",
      family_code: "7392",
      relationship: "Daughter",
      created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    },
    assessment: {
      id: "demo-ass-3",
      patient_id: "demo-pat-3",
      assessed_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      band: "low",
      confidence: "screened",
      notes: "Active sports and youth wellness checkup.",
      scores: {
        hypertension: { band: "low", stage: "Athletic pulse and optimal blood pressure", value: 112 },
        diabetes: { band: "low", stage: "Optimal metabolism", value: 85 },
        cvd: { band: "low", stage: "Excellent heart strength", value: 1 },
        ckd: { band: "low", stage: "Optimal kidney hydration & filtration", value: 105 },
        stroke: { band: "low", stage: "Clear reflexes and normal speech", value: 0 },
      },
      factors: [],
      gap_labs: [],
      specialist: {
        primary: "General Community Healthcare Practitioner",
        reason: "Standard college wellness checkup verification."
      },
      decision: {
        band: "low",
        rationale: "Young adult vitals completely healthy with zero warning signs.",
        action: "Continue healthy youth fitness and balanced study routine"
      }
    }
  }
];

/** 
 * Built-in Demo Individual Personal profile for standalone personal symptom tracking without household codes.
 */
export const DEMO_PERSONAL_MEMBERS: { patient: Patient; assessment: Assessment }[] = [
  {
    patient: {
      id: "demo-personal-1",
      full_name: "Aditya Sharma (My Health Record)",
      age: 31,
      sex: "M",
      village: "Individual Self-Checkup",
      phone: "+91 99123-45678",
      portal_type: "personal",
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    assessment: {
      id: "demo-personal-ass-1",
      patient_id: "demo-personal-1",
      assessed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      band: "low",
      confidence: "screened",
      notes: "Routine self-logged personal symptom screening.",
      scores: {
        hypertension: { band: "low", stage: "Optimal pulse and blood pressure range", value: 116 },
        diabetes: { band: "low", stage: "Stable blood sugar response", value: 88 },
        cvd: { band: "low", stage: "Healthy cardiovascular fitness", value: 2 },
        ckd: { band: "low", stage: "Normal renal hydration levels", value: 100 },
        stroke: { band: "low", stage: "No neurologic indicators observed", value: 0 },
      },
      factors: [
        { condition: "hypertension", label: "Self-Reported Status", value: "No acute symptoms", weight: 0.2, source: "history" }
      ],
      gap_labs: [],
      specialist: {
        primary: "Preventive Wellness Physician",
        reason: "Regular personal wellness monitoring."
      },
      decision: {
        band: "low",
        rationale: "All reported symptom indicators reflect normal baseline wellness without acute warnings.",
        action: "Maintain proactive personal fitness, adequate hydration, and healthy sleep habits."
      }
    }
  }
];

export function getLocalPersonalMembers(): { patient: Patient; assessment: Assessment }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_NEW_MEMBERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalPersonalMember(patient: Patient, assessment: Assessment) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalPersonalMembers();
    existing.unshift({ patient, assessment });
    window.localStorage.setItem(LOCAL_NEW_MEMBERS_KEY, JSON.stringify(existing));
  } catch {}
}

export function lookupDemoOrLocalPatient(id?: string): { patient?: Patient; assessment?: Assessment } {
  if (!id) return {};
  const demoFam = DEMO_FAMILY_MEMBERS.find(m => m.patient.id === id || m.assessment.id === id);
  if (demoFam) return demoFam;
  const demoPers = DEMO_PERSONAL_MEMBERS.find(m => m.patient.id === id || m.assessment.id === id);
  if (demoPers) return demoPers;
  const local = getLocalPersonalMembers().find(m => m.patient.id === id || m.assessment.id === id);
  if (local) return local;
  return {};
}
