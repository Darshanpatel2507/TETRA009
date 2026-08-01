import { useState } from "react";
import { Input } from "../ui/Input";
import { VoiceInputField } from "./VoiceInputField";
import { Tooltip } from "../ui/Tooltip";
import { useLang } from "../../context/LanguageContext";
import { bmi, bmiCategory, bmiLabel } from "../../lib/utils/bmi";
import type { IntakePayload } from "../../types";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
}

export function VitalsForm({ value, onChange }: Props) {
  const { t } = useLang();
  const b = bmi(value.vitals.weight_kg, value.vitals.height_cm);
  const cat = bmiCategory(b);

  const [bpInput, setBpInput] = useState(() =>
    value.vitals.systolic_bp && value.vitals.diastolic_bp
      ? `${value.vitals.systolic_bp}/${value.vitals.diastolic_bp}`
      : value.vitals.systolic_bp
      ? `${value.vitals.systolic_bp}`
      : ""
  );

  const update = (vitals: Partial<IntakePayload["vitals"]>) => {
    onChange({ vitals: { ...value.vitals, ...vitals } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.height")}
            type="number" inputMode="numeric"
            value={value.vitals.height_cm || ""}
            onChange={(e) => update({ height_cm: Number(e.target.value) })}
          />
        </div>
        <VoiceInputField onResult={(t) => update({ height_cm: Number(t.replace(/\D/g, "")) || 0 })} />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.weight")}
            type="number" inputMode="numeric"
            value={value.vitals.weight_kg || ""}
            onChange={(e) => update({ weight_kg: Number(e.target.value) })}
          />
        </div>
        <VoiceInputField onResult={(t) => update({ weight_kg: Number(t.replace(/\D/g, "")) || 0 })} />
      </div>

      {b != null && (
        <div className="md:col-span-2 -mt-2 text-sm text-text-secondary">
          <span className="font-mono mr-2">{b.toFixed(1)} kg/m²</span>
          <span className="text-text-muted">{cat ? bmiLabel[cat] : ""}</span>
        </div>
      )}

      <div className="md:col-span-2 flex items-end gap-2">
        <div className="flex-1">
          <Tooltip label="Systolic / Diastolic mmHg">
            <Input
              label={t("field.bp")}
              value={bpInput}
              onChange={(e) => {
                const val = e.target.value;
                setBpInput(val);
                const parts = val.split("/");
                update({
                  systolic_bp: Number(parts[0]) || 0,
                  diastolic_bp: Number(parts[1]) || 0,
                });
              }}
              placeholder="120/80"
            />
          </Tooltip>
        </div>
        <VoiceInputField onResult={(text) => {
          const m = text.match(/(\d{2,3})\s*\D+\s*(\d{2,3})/);
          if (m) {
            const s = Number(m[1]);
            const d = Number(m[2]);
            setBpInput(`${s}/${d}`);
            update({ systolic_bp: s, diastolic_bp: d });
          }
        }} />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.hr")}
            type="number" inputMode="numeric"
            value={value.vitals.heart_rate || ""}
            onChange={(e) => update({ heart_rate: Number(e.target.value) })}
          />
        </div>
        <VoiceInputField onResult={(t) => update({ heart_rate: Number(t.replace(/\D/g, "")) || 0 })} />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.waist")}
            type="number" inputMode="numeric"
            value={value.vitals.waist_cm || ""}
            onChange={(e) => update({ waist_cm: Number(e.target.value) })}
          />
        </div>
        <VoiceInputField onResult={(t) => update({ waist_cm: Number(t.replace(/\D/g, "")) || 0 })} />
      </div>
    </div>
  );
}
