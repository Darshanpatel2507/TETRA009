import { Input } from "../ui/Input";
import { VoiceInputField } from "./VoiceInputField";
import { useLang } from "../../context/LanguageContext";
import { Tooltip } from "../ui/Tooltip";
import type { IntakePayload } from "../../types";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
}

export function LabsForm({ value, onChange }: Props) {
  const { t } = useLang();
  const update = (labs: Partial<IntakePayload["labs"]>) => {
    onChange({ labs: { ...(value.labs ?? {}), ...labs } as IntakePayload["labs"] });
  };

  const setNum = (field: keyof NonNullable<IntakePayload["labs"]>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    update({ [field]: v === "" ? undefined : Number(v) } as any);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabField label={t("field.fasting_glucose")} value={value.labs?.fasting_glucose_mg_dl ?? ""} onChange={setNum("fasting_glucose_mg_dl")} tooltip="Plasma glucose after an overnight fast" />
      <LabField label={t("field.hba1c")} value={value.labs?.hba1c_percent ?? ""} onChange={setNum("hba1c_percent")} tooltip="Glycated haemoglobin — 3-month sugar marker" />
      <LabField label={t("field.total_chol")} value={value.labs?.total_cholesterol_mg_dl ?? ""} onChange={setNum("total_cholesterol_mg_dl")} tooltip="Total cholesterol in mg/dL" />
      <LabField label={t("field.hdl")} value={value.labs?.hdl_mg_dl ?? ""} onChange={setNum("hdl_mg_dl")} tooltip="" />
      <LabField label={t("field.ldl")} value={value.labs?.ldl_mg_dl ?? ""} onChange={setNum("ldl_mg_dl")} tooltip="" />
      <LabField label={t("field.trig")} value={value.labs?.triglycerides_mg_dl ?? ""} onChange={setNum("triglycerides_mg_dl")} tooltip="" />
      <LabField label={t("field.creatinine")} value={value.labs?.serum_creatinine_mg_dl ?? ""} onChange={setNum("serum_creatinine_mg_dl")} tooltip="Used to compute eGFR (CKD-EPI 2021)" />
      <LabField label={t("field.potassium")} value={value.labs?.potassium_mmol_l ?? ""} onChange={setNum("potassium_mmol_l")} tooltip="Baseline before starting antihypertensives" />
    </div>
  );
}

function LabField({
  label, value, onChange, tooltip,
}: { label: string; value: number | ""; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; tooltip: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Tooltip label={tooltip}>
          <Input
            label={label}
            type="number" inputMode="decimal"
            value={value as any}
            onChange={onChange}
            placeholder="optional"
          />
        </Tooltip>
      </div>
      <VoiceInputField onResult={(t) => {
        const n = Number(t.replace(/[^0-9.]/g, ""));
        if (!isNaN(n)) onChange({ target: { value: String(n) } } as any);
      }} />
    </div>
  );
}
