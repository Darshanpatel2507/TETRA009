/**
 * Intake stepper — five steps, slide+fade between them on step
 * change. Each step is a small form chunk.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "../ui/Stepper";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useLang } from "../../context/LanguageContext";
import { createAssessment } from "../../hooks/useAssessment";
import { useToast } from "../ui/Toast";
import type { IntakePayload } from "../../types";
import { DemographicsForm } from "./DemographicsForm";
import { VitalsForm } from "./VitalsForm";
import { SymptomsForm } from "./SymptomsForm";
import { HistoryForm } from "./HistoryForm";
import { LabsForm } from "./LabsForm";

const STEPS = [
  { id: "demographics", labelKey: "intake.step.demographics" },
  { id: "vitals", labelKey: "intake.step.vitals" },
  { id: "symptoms", labelKey: "intake.step.symptoms" },
  { id: "history", labelKey: "intake.step.history" },
  { id: "labs", labelKey: "intake.step.labs" },
];

function emptyPayload(): IntakePayload {
  return {
    full_name: "",
    age: 0,
    sex: "M",
    village: "",
    phone: "",
    vitals: {
      height_cm: 0,
      weight_kg: 0,
      systolic_bp: 0,
      diastolic_bp: 0,
      heart_rate: 0,
      waist_cm: 0,
    },
    symptoms: {
      face_droop: false,
      arm_weakness: false,
      speech_difficulty: false,
      chest_pain: false,
      shortness_of_breath: false,
      polyuria: false,
      polydipsia: false,
      fatigue: false,
      swelling_legs: false,
    },
    history: {
      smoking: false,
      alcohol_units_per_week: 0,
      family_diabetes: false,
      family_hypertension: false,
      family_cvd: false,
      family_stroke: false,
      on_antihypertensive: false,
      on_statin: false,
    },
    labs: {
      fasting_glucose_mg_dl: undefined,
      hba1c_percent: undefined,
      total_cholesterol_mg_dl: undefined,
      hdl_mg_dl: undefined,
      ldl_mg_dl: undefined,
      triglycerides_mg_dl: undefined,
      serum_creatinine_mg_dl: undefined,
      potassium_mmol_l: undefined,
    },
  };
}

export function IntakeStepper() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { push } = useToast();
  const [step, setStep] = useState(STEPS[0].id);
  const [payload, setPayload] = useState<IntakePayload>(emptyPayload);
  const [saving, setSaving] = useState(false);

  const idx = STEPS.findIndex((s) => s.id === step);
  const isLast = idx === STEPS.length - 1;
  const isFirst = idx === 0;

  const canSave =
    payload.full_name.trim().length > 0 &&
    payload.age > 0 &&
    payload.vitals.systolic_bp > 0 &&
    payload.vitals.diastolic_bp > 0;

  function update(p: Partial<IntakePayload>) {
    setPayload((cur) => ({ ...cur, ...p }));
  }

  async function onSave() {
    setSaving(true);
    try {
      const { patientId } = await createAssessment(payload);
      push({ kind: "success", title: t("toast.assessmentSaved") });
      navigate(`/patient/${patientId}/constellation`);
    } catch (e) {
      push({ kind: "error", title: "Save failed", body: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <Stepper steps={STEPS.map((s) => ({ id: s.id, label: t(s.labelKey) }))} current={step}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {step === "demographics" && <DemographicsForm value={payload} onChange={update} />}
            {step === "vitals" && <VitalsForm value={payload} onChange={update} />}
            {step === "symptoms" && <SymptomsForm value={payload} onChange={update} onSkipToHistory={() => setStep("history")} />}
            {step === "history" && <HistoryForm value={payload} onChange={update} />}
            {step === "labs" && <LabsForm value={payload} onChange={update} />}
          </motion.div>
        </AnimatePresence>
      </Stepper>

      <div className="flex items-center gap-2 mt-6">
        <Button
          variant="ghost"
          onClick={() => (isFirst ? navigate("/dashboard") : setStep(STEPS[Math.max(0, idx - 1)].id))}
        >
          {t("intake.back")}
        </Button>
        <div className="flex-1" />
        {!isLast && (
          <Button
            onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, idx + 1)].id)}
          >
            {t("intake.next")}
          </Button>
        )}
        {isLast && (
          <div className="flex flex-col items-end gap-2">
            {!canSave && (
              <span className="text-xs text-amber-500 font-medium">
                ⚠ Required before saving: Patient Name, Age, and Blood Pressure.
              </span>
            )}
            <Button onClick={onSave} loading={saving} disabled={!canSave}>
              {t("intake.save")}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
