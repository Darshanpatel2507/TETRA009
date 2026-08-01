import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAssessment } from "../../hooks/useAssessment";
import { ConditionNode } from "../../components/constellation/ConditionNode";
import type { ConditionKey } from "../../types";

export function MobileRiskDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const q = useAssessment(id);
  if (q.isLoading || !q.data) return <Card className="p-5">Loading…</Card>;
  const a = q.data;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-semibold flex items-center gap-1">
          ← Back
        </Button>
      </div>
      <Card className="p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-bold">Diagnostic Confidence</div>
            <div className="font-display text-lg mt-1">
              <Badge tone={a.confidence === "lab-confirmed" ? "brand" : "neutral"}>
                {a.confidence === "lab-confirmed" ? "Lab-confirmed" : "Screened (no lab)"}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary font-bold">Action</div>
            <div className="font-display text-lg font-bold text-brand-primary mt-1">{a.decision.action}</div>
          </div>
        </div>
      </Card>

      <ul className="space-y-3">
        {(Object.keys(a.scores) as ConditionKey[]).map((k) => (
          <li key={k}>
            <ConditionNode k={k} s={a.scores[k]} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
