import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAssessmentLive } from "../../hooks/useAssessment";
import { usePatient } from "../../hooks/usePatients";
import { OverallUrgencyCard } from "../../components/assessment/OverallUrgencyCard";
import { FactorBreakdownTable } from "../../components/assessment/FactorBreakdownTable";
import { MissingInvestigationsCard } from "../../components/assessment/MissingInvestigationsCard";
import { AIInsightCard } from "../../components/assessment/AIInsightCard";
import { ReferralSuggestionCard } from "../../components/assessment/ReferralSuggestionCard";
import { useLang } from "../../context/LanguageContext";
import { useCreateReferral } from "../../hooks/useReferral";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { bandLabel, classNames } from "../../lib/utils/formatters";

export function RiskBreakdownPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const q = useAssessmentLive(id);
  const patient = usePatient(id);
  const createReferral = useCreateReferral();
  const referralRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.isLoading && !q.data) navigate("/dashboard");
  }, [q.isLoading, q.data, navigate]);

  if (q.isLoading || !q.data) {
    return <div className="text-text-secondary">Loading…</div>;
  }

  const a = q.data;
  const hasGaps = (a.gap_labs ?? []).length > 0;

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
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Top Bar Navigation with Prominent Back Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/patient/${id}/constellation`)}
            className="font-semibold text-text-primary hover:bg-surface-elevated px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border/60 transition-all shadow-sm"
          >
            <span>←</span> Back to Constellation
          </Button>
          <span className="text-text-muted text-sm">/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(patient?.portal_type === "personal" ? "/my-health" : "/dashboard")}
            className="text-text-secondary hover:text-text-primary px-2.5 py-1.5 text-sm font-medium"
          >
            {patient?.portal_type === "personal" ? "My Family Portal" : "Clinical Dashboard"}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary bg-surface-elevated/80 px-3.5 py-1.5 rounded-lg border border-border/50 shadow-inner">
          <span className="flex items-center gap-1.5 font-bold text-text-primary text-sm">
            <span className="text-brand-primary">👤</span>
            <span>{patient?.full_name ?? "Patient Profile"}</span>
            {patient?.relationship && <span className="text-xs font-normal text-text-muted bg-surface px-2 py-0.5 rounded border border-border/40">({patient.relationship})</span>}
            {patient?.age && <span className="text-xs font-mono text-text-muted">({patient.age}y, {patient.sex})</span>}
          </span>
          <span className="h-4 w-[1px] bg-border/60" />
          <span className="text-text-muted">ID: <span className="font-mono text-text-primary">{a.patient_id.slice(0, 8)}</span></span>
          <span className="h-4 w-[1px] bg-border/60" />
          <span>Urgency Band: <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">{bandLabel(a.band)}</span></span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">{t("breakdown.title")}</h1>
          <p className="text-sm text-text-secondary mt-1">{t("breakdown.subtitle")}</p>
        </div>
      </div>

      <OverallUrgencyCard
        decision={a.decision}
        confidence={a.confidence}
        onJumpToReferral={scrollToReferral}
      />

      <div className={classNames("grid gap-6", hasGaps ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        <FactorBreakdownTable rows={a.factors ?? []} />
        {hasGaps && <MissingInvestigationsCard gaps={a.gap_labs ?? []} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightCard assessment={a} />
        <div ref={referralRef} className="h-full">
          <ReferralSuggestionCard
            specialist={a.specialist}
            onGenerate={onGenerate}
            pending={createReferral.isPending}
          />
        </div>
      </div>
    </motion.div>
  );
}
