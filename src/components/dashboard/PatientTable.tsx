import { useNavigate } from "react-router-dom";
import { DataTable } from "../ui/DataTable";
import { RiskDotsBadge } from "./RiskDotsBadge";
import { Button } from "../ui/Button";
import { useLang } from "../../context/LanguageContext";
import type { DashboardRow } from "../../hooks/usePatients";
import type { ConditionKey } from "../../types";

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (isNaN(t)) return iso;
  const d = Date.now() - t;
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const condLabel: Record<ConditionKey, string> = {
  diabetes: "D",
  hypertension: "H",
  cvd: "C",
  ckd: "K",
  stroke: "S",
};

export function PatientTable({ rows }: { rows: DashboardRow[] }) {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <DataTable<DashboardRow>
      rows={rows}
      rowKey={(r) => r.patient.id}
      empty={t("dashboard.empty")}
      onRowClick={(r) => r.last_assessment && navigate(`/patient/${r.patient.id}/constellation`)}
      columns={[
        { key: "name", header: t("table.name"), cell: (r) => (
          <div>
            <div className="font-bold text-text-primary">{r.patient.full_name}</div>
            <div className="text-[11px] font-mono text-text-muted">ID: {r.patient.id.slice(0, 8)}</div>
          </div>
        )},
        { key: "age", header: t("table.age"), className: "font-mono w-16", cell: (r) => <span className="font-mono">{r.patient.age}</span> },
        { key: "sex", header: t("table.sex"), className: "w-16", cell: (r) => <span className="font-mono">{r.patient.sex}</span> },
        { key: "village", header: t("table.village"), cell: (r) => r.patient.village ?? "—" },
        { key: "band", header: t("table.band"), className: "w-44", cell: (r) =>
          r.last_assessment ? <RiskDotsBadge band={r.last_assessment.band} /> : <span className="text-text-muted">—</span>
        },
        { key: "conds", header: "C", className: "w-32", cell: (r) => {
          const s = r.last_assessment?.scores ?? null;
          if (!s) return <span className="text-text-muted">—</span>;
          const active = (Object.keys(s) as ConditionKey[]).filter((k) => s[k].band !== "low");
          return (
            <div className="flex gap-1">
              {active.map((k) => (
                <span
                  key={k}
                  title={k}
                  className={`inline-block h-5 w-5 grid place-items-center text-[10px] font-mono rounded text-text-inverse`}
                  style={{ background: `var(--condition-${k})` }}
                >
                  {condLabel[k]}
                </span>
              ))}
            </div>
          );
        }},
        { key: "last", header: t("table.last"), className: "w-28", cell: (r) => (
          <span className="font-mono text-xs text-text-secondary">{timeAgo(r.last_assessment?.assessed_at ?? null)}</span>
        )},
        { key: "action", header: "", className: "w-28", cell: (r) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); navigate(`/patient/${r.patient.id}/breakdown`); }}
          >
            {t("table.view")}
          </Button>
        )},
      ]}
    />
  );
}
