import { useState } from "react";
import { Input } from "../ui/Input";
import { Tabs } from "../ui/Tabs";
import { useLang } from "../../context/LanguageContext";

export type Filter = "all" | "low" | "moderate" | "high" | "critical";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filter: Filter;
  onFilter: (f: Filter) => void;
}

export function FilterBar({ search, onSearch, filter, onFilter }: Props) {
  const { t } = useLang();
  const [opts, setOpts] = useState<{ id: Filter; label: string }[]>([
    { id: "all", label: "All" },
    { id: "low", label: "Routine" },
    { id: "moderate", label: "Flagged" },
    { id: "high", label: "48h" },
    { id: "critical", label: "Immediate" },
  ]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <Input
        aria-label={t("dashboard.search.placeholder")}
        placeholder={t("dashboard.search.placeholder")}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
      <Tabs
        tabs={opts}
        value={filter}
        onChange={(v) => onFilter(v as Filter)}
      />
    </div>
  );
}
