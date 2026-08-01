/**
 * Mobile intake — vertical single-column form, large 44px+ targets,
 * one task per screen via a "Continue" CTA that drives each section.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Switch";
import { VoiceInputField } from "../../components/intake/VoiceInputField";
import { createAssessment } from "../../hooks/useAssessment";
import { useToast } from "../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { bmi, bmiCategory, bmiLabel } from "../../lib/utils/bmi";
import type { IntakePayload } from "../../types";

function empty(): IntakePayload {
  return {
    full_name: "", age: 0, sex: "M",
    vitals: { height_cm: 0, weight_kg: 0, systolic_bp: 0, diastolic_bp: 0 },
    symptoms: {
      face_droop: false, arm_weakness: false, speech_difficulty: false,
      chest_pain: false, shortness_of_breath: false, polyuria: false,
      polydipsia: false, fatigue: false, swelling_legs: false,
    },
    history: {
      smoking: false, alcohol_units_per_week: 0,
      family_diabetes: false, family_hypertension: false, family_cvd: false,
      family_stroke: false, on_antihypertensive: false, on_statin: false,
    },
    labs: {},
  };
}

export function MobileIntakeScreen() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { t } = useLang();
  const [p, setP] = useState<IntakePayload>(empty());
  const [saving, setSaving] = useState(false);
  const [bpInput, setBpInput] = useState("");

  const canSave =
    p.full_name.trim().length > 0 &&
    p.age > 0 &&
    p.vitals.systolic_bp > 0 &&
    p.vitals.diastolic_bp > 0;

  function update(x: Partial<IntakePayload>) {
    setP((cur) => ({ ...cur, ...x }));
  }
  const b = bmi(p.vitals.weight_kg, p.vitals.height_cm);

  async function save() {
    setSaving(true);
    try {
      const { patientId } = await createAssessment(p);
      push({ kind: "success", title: t("toast.assessmentSaved") });
      navigate(`/patient/${patientId}/constellation`);
    } catch (e) {
      push({ kind: "error", title: "Save failed", body: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="font-display text-lg">Person</h3>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input label={t("field.full_name")} value={p.full_name} onChange={(e) => update({ full_name: e.target.value })} />
          </div>
          <VoiceInputField onResult={(t) => update({ full_name: t })} />
        </div>
        <Input label={t("field.age")} type="number" inputMode="numeric" value={p.age || ""} onChange={(e) => update({ age: Number(e.target.value) })} />
        <Input label={t("field.village")} value={p.village ?? ""} onChange={(e) => update({ village: e.target.value })} />
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-display text-lg">Vitals</h3>
        <Input label={t("field.height")} type="number" value={p.vitals.height_cm || ""} onChange={(e) => update({ vitals: { ...p.vitals, height_cm: Number(e.target.value) } })} />
        <Input label={t("field.weight")} type="number" value={p.vitals.weight_kg || ""} onChange={(e) => update({ vitals: { ...p.vitals, weight_kg: Number(e.target.value) } })} />
        {b != null && <div className="text-xs text-text-secondary">BMI <span className="font-mono">{b.toFixed(1)}</span> · {bmiLabel[bmiCategory(b) ?? "normal"]}</div>}
        <Input
          label={t("field.bp")}
          value={bpInput}
          onChange={(e) => {
            const val = e.target.value;
            setBpInput(val);
            const parts = val.split("/");
            update({
              vitals: {
                ...p.vitals,
                systolic_bp: Number(parts[0]) || 0,
                diastolic_bp: Number(parts[1]) || 0,
              },
            });
          }}
          placeholder="120/80"
        />
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="font-display text-lg">Key symptoms</h3>
        <Row label={t("field.face_droop")} checked={p.symptoms.face_droop} onChange={(v) => update({ symptoms: { ...p.symptoms, face_droop: v } })} />
        <Row label={t("field.arm_weakness")} checked={p.symptoms.arm_weakness} onChange={(v) => update({ symptoms: { ...p.symptoms, arm_weakness: v } })} />
        <Row label={t("field.speech_difficulty")} checked={p.symptoms.speech_difficulty} onChange={(v) => update({ symptoms: { ...p.symptoms, speech_difficulty: v } })} />
        <Row label={t("field.chest_pain")} checked={p.symptoms.chest_pain} onChange={(v) => update({ symptoms: { ...p.symptoms, chest_pain: v } })} />
      </Card>

      <div className="space-y-2">
        {!canSave && (
          <p className="text-xs text-amber-500 font-medium">
            ⚠ Required before saving: Patient Name, Age, and Blood Pressure.
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} size="lg" className="flex-1">
            {t("intake.back")}
          </Button>
          <Button loading={saving} onClick={save} disabled={!canSave} size="lg" className="flex-2 w-2/3">
            {t("intake.save")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
