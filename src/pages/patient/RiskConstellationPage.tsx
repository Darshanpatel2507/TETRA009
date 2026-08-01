import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAssessmentLive } from "../../hooks/useAssessment";
import { RiskConstellation } from "../../components/constellation/RiskConstellation";
import { ConditionNode } from "../../components/constellation/ConditionNode";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";
import { bandLabel } from "../../lib/utils/formatters";
import type { ConditionKey } from "../../types";

export function RiskConstellationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const q = useAssessmentLive(id);
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
  // Fetch the patient name in parallel (small enough to inline)
  const patientName = a.patient_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-6"
    >
      <div className="lg:col-span-2">
        <RiskConstellation
          scores={a.scores}
          onSelect={(k) => setSelected(k)}
        />
        <Button className="w-full mt-4" onClick={() => navigate(`/patient/${id}/breakdown`)}>
          View breakdown →
        </Button>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="font-display text-xl">
          {t("constellation.title")} — <span className="text-text-secondary">{patientName}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(a.scores) as ConditionKey[]).map((k) => (
            <ConditionNode
              key={k}
              k={k}
              s={a.scores[k]}
              active={selected === k}
              onClick={() => setSelected(k)}
            />
          ))}
        </div>

        <Card className="p-4">
          <div className="text-sm text-text-secondary">
            Overall action: <span className="font-display ml-1">{a.decision.action}</span>
          </div>
          <div className="text-xs text-text-muted mt-1">{a.decision.rationale}</div>
        </Card>
      </div>
    </motion.div>
  );
}
