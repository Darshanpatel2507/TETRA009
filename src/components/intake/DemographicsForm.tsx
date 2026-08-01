import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { VoiceInputField } from "./VoiceInputField";
import { useLang } from "../../context/LanguageContext";
import type { IntakePayload } from "../../types";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
}

export function DemographicsForm({ value, onChange }: Props) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.full_name")}
            value={value.full_name}
            onChange={(e) => onChange({ full_name: e.target.value })}
            placeholder="e.g. Anjali Sharma"
          />
        </div>
        <VoiceInputField onResult={(text) => onChange({ full_name: text })} />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={t("field.age")}
            type="number"
            inputMode="numeric"
            value={value.age || ""}
            onChange={(e) => onChange({ age: Number(e.target.value) })}
          />
        </div>
        <VoiceInputField onResult={(text) => onChange({ age: Number(text.replace(/\D/g, "")) || 0 })} />
      </div>

      <Select
        label={t("field.sex")}
        value={value.sex}
        onChange={(e) => onChange({ sex: e.target.value as "M" | "F" })}
      >
        <option value="M">Male</option>
        <option value="F">Female</option>
      </Select>

      <Input
        label={t("field.village")}
        value={value.village ?? ""}
        onChange={(e) => onChange({ village: e.target.value })}
        placeholder="e.g. Nani Kharaj"
      />

      <Input
        label={t("field.phone")}
        value={value.phone ?? ""}
        onChange={(e) => onChange({ phone: e.target.value })}
        placeholder="e.g. 98xxxxxxxx"
      />
    </div>
  );
}
