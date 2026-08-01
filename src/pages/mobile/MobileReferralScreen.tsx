import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useParams } from "react-router-dom";
import { useAssessment } from "../../hooks/useAssessment";
import { useCreateReferral } from "../../hooks/useReferral";
import { useLang } from "../../context/LanguageContext";

export function MobileReferralScreen() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const q = useAssessment(id);
  const m = useCreateReferral();
  if (q.isLoading || !q.data) return <Card className="p-5">Loading…</Card>;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card className="p-5">
        <h3 className="font-display text-lg">{t("breakdown.referral")}</h3>
        <div className="mt-2 font-display text-2xl text-brand-primary">{q.data.specialist.primary}</div>
        {q.data.specialist.secondary && <div className="text-sm text-text-secondary">+ {q.data.specialist.secondary}</div>}
        <p className="mt-2 text-sm text-text-secondary">{q.data.specialist.reason}</p>
        <Button onClick={() => m.mutate({
          patient_id: q.data!.patient_id,
          assessment_id: q.data!.id,
          specialist: q.data!.specialist.primary,
          notes: q.data!.decision.rationale,
        })} loading={m.isPending} className="mt-4 w-full">{t("breakdown.generate")}</Button>
      </Card>
    </motion.div>
  );
}
