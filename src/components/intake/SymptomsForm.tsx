import { Switch } from "../ui/Switch";
import { useLang } from "../../context/LanguageContext";
import { Tooltip } from "../ui/Tooltip";
import type { IntakePayload } from "../../types";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
}

const FAST = ["face_droop", "arm_weakness", "speech_difficulty"] as const;
const GENERAL = [
  ["chest_pain", "Chest pain"],
  ["shortness_of_breath", "Shortness of breath"],
  ["polyuria", "Frequent urination"],
  ["polydipsia", "Excessive thirst"],
  ["fatigue", "Fatigue"],
  ["swelling_legs", "Leg swelling"],
] as const;

export function SymptomsForm({ value, onChange }: Props) {
  const { t } = useLang();
  const update = (s: Partial<IntakePayload["symptoms"]>) => {
    onChange({ symptoms: { ...value.symptoms, ...s } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg mb-1">FAST stroke screen</h3>
        <p className="text-sm text-text-secondary mb-3">Any positive = immediate referral.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FAST.map((k) => (
            <div key={k} className="rounded-card border border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tooltip label={k.replace(/_/g, " ").toUpperCase()}>
                  <span className="text-sm font-medium">{t(`field.${k}`)}</span>
                </Tooltip>
              </div>
              <Switch
                checked={Boolean(value.symptoms[k])}
                onChange={(v) => update({ [k]: v } as any)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg mb-3">General symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GENERAL.map(([k, label]) => (
            <div key={k} className="rounded-card border border-border p-3 flex items-center justify-between">
              <span className="text-sm font-medium">{t(`field.${k}`)}</span>
              <Switch
                checked={Boolean(value.symptoms[k as keyof IntakePayload["symptoms"]])}
                onChange={(v) => update({ [k]: v } as any)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
