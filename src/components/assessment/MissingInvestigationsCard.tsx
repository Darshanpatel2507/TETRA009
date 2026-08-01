import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import type { GapLab } from "../../types";

export function MissingInvestigationsCard({ gaps }: { gaps: GapLab[] }) {
  const { t } = useLang();
  const [ordered, setOrdered] = useState<Record<number, boolean>>({});

  // If no labs are missing, hide the card completely to avoid UI clutter
  if (!gaps || gaps.length === 0) {
    return null;
  }

  return (
    <Card className="p-5 border-l-4 border-l-amber-500 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold text-lg">⚠</span>
          <h3 className="font-display text-lg font-bold">{t("breakdown.gap")}</h3>
        </div>
        <span className="text-[11px] uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
          Action Recommended
        </span>
      </div>
      <p className="text-xs text-text-secondary mb-4 leading-relaxed">
        To ensure complete peace of mind and fully confirm your health results, our verified medical rules recommend performing these simple test checks:
      </p>
      <ul className="space-y-3">
        {gaps.map((g, i) => (
          <li key={i} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-elevated/70 border border-border/70 shadow-sm">
            <div>
              <div className="text-sm font-bold text-text-primary">{g.test}</div>
              <div className="text-xs text-text-secondary mt-1 leading-relaxed"><strong>Why this helps:</strong> {g.reason}</div>
            </div>
            <Button
              size="sm"
              variant={ordered[i] ? "ghost" : "subtle"}
              onClick={() => setOrdered((prev) => ({ ...prev, [i]: !prev[i] }))}
              className={ordered[i] ? "text-emerald-500 font-bold text-xs bg-emerald-500/15 border border-emerald-500/30 px-3" : "text-xs font-semibold px-3"}
            >
              {ordered[i] ? "✓ Reminder Saved" : "Add Reminder"}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
