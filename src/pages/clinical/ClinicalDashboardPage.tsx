import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useLang } from "../../context/LanguageContext";
import { usePatients } from "../../hooks/usePatients";
import { StatCard } from "../../components/dashboard/StatCard";
import { PatientTable } from "../../components/dashboard/PatientTable";
import { FilterBar, type Filter } from "../../components/dashboard/FilterBar";
import { csvEscape, downloadBlob } from "../../lib/utils/formatters";

type SortKey = "name" | "age" | "band" | "last";

const bandRank: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };

export function ClinicalDashboardPage() {
  const { t } = useLang();
  const q = usePatients();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "band", dir: "desc" });

  const rows = q.data ?? [];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && (r.last_assessment?.band ?? "low") !== filter) return false;
      if (!term) return true;
      return (
        r.patient.full_name.toLowerCase().includes(term) ||
        (r.patient.village ?? "").toLowerCase().includes(term)
      );
    });
  }, [rows, search, filter]);

  const sorted = useMemo(() => {
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case "name": return a.patient.full_name.localeCompare(b.patient.full_name) * dir;
        case "age":  return (a.patient.age - b.patient.age) * dir;
        case "band": return ((bandRank[a.last_assessment?.band ?? "low"] ?? 0) - (bandRank[b.last_assessment?.band ?? "low"] ?? 0)) * dir;
        case "last": return (Date.parse(a.last_assessment?.assessed_at ?? "0") - Date.parse(b.last_assessment?.assessed_at ?? "0")) * dir;
      }
    });
  }, [filtered, sort]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: rows.length,
      high: rows.filter((r) => ["high", "critical"].includes(r.last_assessment?.band ?? "low")).length,
      today: rows.filter((r) => r.last_assessment && new Date(r.last_assessment.assessed_at).toDateString() === today).length,
    };
  }, [rows]);

  function exportCsv() {
    const header = ["name", "age", "sex", "village", "band", "last_assessed"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        csvEscape(r.patient.full_name),
        csvEscape(r.patient.age),
        csvEscape(r.patient.sex),
        csvEscape(r.patient.village ?? ""),
        csvEscape(r.last_assessment?.band ?? ""),
        csvEscape(r.last_assessment?.assessed_at ?? ""),
      ].join(","));
    }
    downloadBlob("nirog-dashboard.csv", lines.join("\n"));
  }

  function toggleSort(k: SortKey) {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl">{t("dashboard.title")}</h1>
          <p className="text-sm text-text-secondary mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <Button variant="ghost" onClick={exportCsv}>{t("dashboard.export")}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label={t("dashboard.stat.total")} value={stats.total} />
        <StatCard label={t("dashboard.stat.highRisk")} value={stats.high} tone={stats.high > 0 ? "high" : "neutral"} />
        <StatCard label={t("dashboard.stat.today")} value={stats.today} />
      </div>

      <Card className="p-4">
        <FilterBar search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
        <div className="mt-4">
          <PatientTable rows={sorted} />
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Sorted by <span className="font-mono">{sort.key} {sort.dir}</span> — click a column to toggle.
          <button className="ml-2 underline" onClick={() => toggleSort("band")}>Re-sort by urgency</button>
        </p>
      </Card>
    </motion.div>
  );
}
