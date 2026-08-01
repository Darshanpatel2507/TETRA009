import { Switch } from "../ui/Switch";
import { Input } from "../ui/Input";
import { useLang } from "../../context/LanguageContext";
import type { IntakePayload } from "../../types";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
}

export function HistoryForm({ value, onChange }: Props) {
  const { t } = useLang();
  const update = (h: Partial<IntakePayload["history"]>) => {
    onChange({ history: { ...value.history, ...h } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.smoking")}</span>
        <Switch checked={value.history.smoking} onChange={(v) => update({ smoking: v })} />
      </div>

      <Input
        label={t("field.alcohol")}
        type="number" inputMode="numeric"
        value={value.history.alcohol_units_per_week || ""}
        onChange={(e) => update({ alcohol_units_per_week: Number(e.target.value) })}
      />

      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.family_diabetes")}</span>
        <Switch checked={value.history.family_diabetes} onChange={(v) => update({ family_diabetes: v })} />
      </div>
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.family_hypertension")}</span>
        <Switch checked={value.history.family_hypertension} onChange={(v) => update({ family_hypertension: v })} />
      </div>
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.family_cvd")}</span>
        <Switch checked={value.history.family_cvd} onChange={(v) => update({ family_cvd: v })} />
      </div>
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.family_stroke")}</span>
        <Switch checked={value.history.family_stroke} onChange={(v) => update({ family_stroke: v })} />
      </div>
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.on_antihypertensive")}</span>
        <Switch checked={value.history.on_antihypertensive} onChange={(v) => update({ on_antihypertensive: v })} />
      </div>
      <div className="rounded-card border border-border p-3 flex items-center justify-between">
        <span className="text-sm font-medium">{t("field.on_statin")}</span>
        <Switch checked={value.history.on_statin} onChange={(v) => update({ on_statin: v })} />
      </div>
    </div>
  );
}
