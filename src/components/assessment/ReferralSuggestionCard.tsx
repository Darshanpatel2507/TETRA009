import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import type { SpecialistRef } from "../../types";

export function ReferralSuggestionCard({
  specialist,
  onGenerate,
  pending,
}: {
  specialist: SpecialistRef;
  onGenerate: () => void;
  pending?: boolean;
}) {
  const { t } = useLang();
  return (
    <Card className="p-5">
      <h3 className="font-display text-lg mb-1">{t("breakdown.referral")}</h3>
      <p className="text-sm text-text-secondary">Suggested next specialist</p>
      <div className="mt-3 font-display text-2xl text-brand-primary">{specialist.primary}</div>
      {specialist.secondary && (
        <div className="text-sm text-text-secondary">+ {specialist.secondary}</div>
      )}
      <p className="mt-2 text-sm text-text-secondary">{specialist.reason}</p>
      <Button onClick={onGenerate} variant="primary" size="lg" className="mt-4" loading={pending}>
        {t("breakdown.generate")}
      </Button>
    </Card>
  );
}
