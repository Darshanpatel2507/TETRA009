import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAssessmentLive } from "../../hooks/useAssessment";
import { usePatient } from "../../hooks/usePatients";
import { RiskConstellation } from "../../components/constellation/RiskConstellation";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useLang } from "../../context/LanguageContext";
import { bandLabel } from "../../lib/utils/formatters";
import type { ConditionKey } from "../../types";

export function RiskConstellationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const q = useAssessmentLive(id);
  const patient = usePatient(id);
  const [selected, setSelected] = useState<ConditionKey | null>(null);

  if (q.isLoading) {
    return <div className="text-text-secondary">Loading…</div>;
  }
  if (!q.data) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="font-display text-lg">No assessment found</h2>
        <p className="text-sm text-text-secondary mt-2">Start a new assessment for this patient.</p>
        <Button className="mt-4" onClick={() => navigate("/patient/intake")}>
          {t("intake.title")}
        </Button>
      </Card>
    );
  }

  const a = q.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Top Bar Navigation with Prominent Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(patient?.portal_type === "personal" ? "/my-health" : "/dashboard")}
            className="font-semibold text-text-primary hover:bg-surface-elevated px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border/60 transition-all shadow-sm"
          >
            <span>←</span> Back to {patient?.portal_type === "personal" ? "My Family Portal" : "Dashboard"}
          </Button>
          <span className="text-text-muted text-sm">/</span>
          <span className="text-sm font-bold text-text-primary font-display">Risk Constellation Overview</span>
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
          <span>Overall Urgency: <span className="font-mono font-bold text-brand-primary uppercase px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">{bandLabel(a.band)}</span></span>
        </div>
      </div>

      {/* Full Width Diagnostic Matrix */}
      <div>
        <RiskConstellation
          scores={a.scores}
          overallBand={a.band}
          onSelect={(k) => setSelected(k)}
        />
      </div>

      {/* Dual Bottom Triage & Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Recommended Action Card */}
        <Card className="p-6 border-l-4 border-l-brand-primary bg-gradient-to-r from-brand-primary/10 via-surface to-surface shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-text-muted flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping" />
                Deterministic Engine Triage Recommendation
              </span>
              <span className="text-[11px] font-mono font-extrabold text-brand-primary bg-brand-primary/15 px-2.5 py-0.5 rounded-full border border-brand-primary/30">
                PROTOCOL VERIFIED
              </span>
            </div>
            <h3 className="font-display text-2xl font-black text-text-primary mt-1 tracking-tight">
              {a.decision.action}
            </h3>
            <div className="text-sm text-text-secondary mt-3 leading-relaxed bg-surface-elevated/70 p-4 rounded-xl border border-border/50 font-sans">
              <span className="font-bold text-text-primary block mb-1 text-xs uppercase tracking-wide">Diagnostic Clinical Rationale:</span>
              {a.decision.rationale}
            </div>
          </div>
          <div className="mt-4 text-xs text-text-muted flex items-center justify-between pt-3 border-t border-border/40">
            <span>Confidence Rating: <strong className="text-text-primary uppercase font-mono">{a.confidence === "lab-confirmed" ? "Lab Confirmed" : "Screened (Clinical Vitals)"}</strong></span>
            <span>Triage Priority: <strong className="text-brand-primary">{bandLabel(a.band)}</strong></span>
          </div>
        </Card>

        {/* AI Synthesis & Navigation Card */}
        <Card className="p-6 bg-gradient-to-br from-surface via-surface to-brand-primary/5 border border-border shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✨</span>
              <h3 className="font-display text-lg font-bold text-text-primary">
                AI Clinical Synthesis & Referral Hub
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Proceed to the complete clinical assessment breakdown to examine parameter weights, view the systematically formatted AI clinical insights report, order missing laboratory investigations, and generate official hospital referral letters.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border/60">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Active Risk Drivers</span>
                <span className="text-text-primary font-mono font-bold text-sm">
                  {Object.values(a.scores).filter(s => s?.band === "critical" || s?.band === "high").length} High/Critical Factors
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border/60">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Missing Lab Tests</span>
                <span className="text-text-primary font-mono font-bold text-sm">
                  {(a.gap_labs ?? []).length} Tests Recommended
                </span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="primary"
            className="mt-6 w-full font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate(`/patient/${id}/breakdown`)}
          >
            Explore Full Clinical Breakdown & AI Report →
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
