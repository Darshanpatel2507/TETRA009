import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAssessmentLive } from "../../hooks/useAssessment";
import { OverallUrgencyCard } from "../../components/assessment/OverallUrgencyCard";
import { FactorBreakdownTable } from "../../components/assessment/FactorBreakdownTable";
import { MissingInvestigationsCard } from "../../components/assessment/MissingInvestigationsCard";
import { AIInsightCard } from "../../components/assessment/AIInsightCard";
import { ReferralSuggestionCard } from "../../components/assessment/ReferralSuggestionCard";
import { useLang } from "../../context/LanguageContext";
import { useCreateReferral } from "../../hooks/useReferral";
import { Card } from "../../components/ui/Card";
import { bandLabel } from "../../lib/utils/formatters";

export function RiskBreakdownPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const q = useAssessmentLive(id);
  const createReferral = useCreateReferral();
  const referralRef = useRef<HTMLDivElement>(null);

  // Fetch patient name once
  const patientName = (q.data as any)?.patient_name;

  useEffect(() => {
    if (!q.isLoading && !q.data) navigate("/dashboard");
  }, [q.isLoading, q.data, navigate]);

  if (q.isLoading || !q.data) {
    return <div className="text-text-secondary">Loading…</div>;
  }

  const a = q.data;

  function scrollToReferral() {
    referralRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onGenerate() {
    if (!a) return;
    createReferral.mutate({
      patient_id: a.patient_id,
      assessment_id: a.id,
      specialist: a.specialist.primary,
      notes: a.decision.rationale,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl">{t("breakdown.title")}</h1>
          <p className="text-sm text-text-secondary">{t("breakdown.subtitle")}</p>
        </div>
        <div className="text-xs text-text-muted">band: <span className="font-mono">{bandLabel(a.band)}</span></div>
      </div>

      <OverallUrgencyCard
        decision={a.decision}
        confidence={a.confidence}
        onJumpToReferral={scrollToReferral}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FactorBreakdownTable rows={a.factors ?? []} />
        <MissingInvestigationsCard gaps={a.gap_labs ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightCard assessment={a} />
        <div ref={referralRef}>
          <ReferralSuggestionCard
            specialist={a.specialist}
            onGenerate={onGenerate}
            pending={createReferral.isPending}
          />
        </div>
      </div>

      {patientName && (
        <Card className="p-4 text-sm text-text-secondary">
          Patient: <span className="font-mono">{patientName}</span>
        </Card>
      )}
    </motion.div>
  );
}
