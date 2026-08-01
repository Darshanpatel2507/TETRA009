import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { RiskConstellation } from "../../components/constellation/RiskConstellation";
import { useAssessment } from "../../hooks/useAssessment";
import { useParams, useNavigate } from "react-router-dom";

export function MobileRiskOverviewScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const q = useAssessment(id);
  if (q.isLoading || !q.data) return <Card className="p-5">Loading…</Card>;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="font-semibold flex items-center gap-1">
          ← Back to Dashboard
        </Button>
      </div>
      <RiskConstellation scores={q.data.scores} overallBand={q.data.band} />
      <Card className="p-4 border-l-4 border-l-brand-primary">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Overall recommended action</div>
        <div className="font-display text-lg font-bold mt-1">{q.data.decision.action}</div>
        <div className="text-xs text-text-secondary mt-1">{q.data.decision.rationale}</div>
      </Card>
      <Button className="w-full font-bold py-3" onClick={() => navigate(`/patient/${id}/breakdown`)}>
        View Full Clinical Breakdown →
      </Button>
    </motion.div>
  );
}
