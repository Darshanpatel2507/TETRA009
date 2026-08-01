import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import type { GapLab } from "../../types";

export function MissingInvestigationsCard({ gaps }: { gaps: GapLab[] }) {
  const { t } = useLang();
  return (
    <Card className="p-5">
      <h3 className="font-display text-lg mb-3">{t("breakdown.gap")}</h3>
      {gaps.length === 0 ? (
        <p className="text-sm text-text-secondary">All required labs captured.</p>
      ) : (
        <ul className="space-y-2">
          {gaps.map((g, i) => (
            <li key={i} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
              <div>
                <div className="text-sm font-medium">{g.test}</div>
                <div className="text-xs text-text-secondary">{g.reason}</div>
              </div>
              <Button size="sm" variant="ghost">Order</Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
