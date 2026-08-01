import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { RiskConstellation } from "../../components/constellation/RiskConstellation";
import { useAssessment } from "../../hooks/useAssessment";
import { useParams } from "react-router-dom";

export function MobileRiskOverviewScreen() {
  const { id } = useParams<{ id: string }>();
  const q = useAssessment(id);
  if (q.isLoading || !q.data) return <Card className="p-5">Loading…</Card>;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      <RiskConstellation scores={q.data.scores} />
      <Card className="p-4 mt-4">
        <div className="text-sm text-text-secondary">Overall action</div>
        <div className="font-display text-lg">{q.data.decision.action}</div>
        <div className="text-xs text-text-muted mt-1">{q.data.decision.rationale}</div>
      </Card>
    </motion.div>
  );
}
