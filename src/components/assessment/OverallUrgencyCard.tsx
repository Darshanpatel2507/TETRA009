/**
 * Overall urgency card — the headline of the risk breakdown.
 * Single big button + rationale + action.
 */
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { bandLabel } from "../../lib/utils/formatters";
import type { DecisionOutput, RiskBand } from "../../types";

export function OverallUrgencyCard({
  decision,
  confidence,
  onJumpToReferral,
}: {
  decision: DecisionOutput;
  confidence: "lab-confirmed" | "screened";
  onJumpToReferral: () => void;
}) {
  const tone: RiskBand = decision.band;
  return (
    <Card className="p-6" hover>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-text-secondary">Overall urgency</div>
          <div className="mt-2 font-display text-3xl">
            <span className={`text-risk-${tone}`}>{bandLabel(tone)}</span>
          </div>
          <Badge tone={confidence === "lab-confirmed" ? "brand" : "neutral"} className="mt-2">
            {confidence === "lab-confirmed" ? "Lab-confirmed" : "Screened (no lab)"}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-secondary">{decision.action}</div>
          <Button onClick={onJumpToReferral} variant="primary" size="lg" className="mt-3">
            Generate referral
          </Button>
        </div>
      </div>
      <p className="mt-4 text-sm text-text-secondary">{decision.rationale}</p>
    </Card>
  );
}
