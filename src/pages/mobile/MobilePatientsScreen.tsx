import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { RiskDotsBadge } from "../../components/dashboard/RiskDotsBadge";
import { usePatients } from "../../hooks/usePatients";
import { useNavigate } from "react-router-dom";

export function MobilePatientsScreen() {
  const navigate = useNavigate();
  const q = usePatients();
  const [search, setSearch] = useState("");
  const rows = (q.data ?? []).filter((r) => {
    const t = search.toLowerCase();
    return !t || r.patient.full_name.toLowerCase().includes(t) || (r.patient.village ?? "").toLowerCase().includes(t);
  });
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
      <Input placeholder="Search by name or village" value={search} onChange={(e) => setSearch(e.target.value)} />
      {rows.length === 0 && (
        <Card className="p-5 text-center text-text-secondary">No patients yet.</Card>
      )}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.patient.id}>
            <Card className="p-4" hover onClick={() => r.last_assessment && navigate(`/patient/${r.patient.id}/breakdown`)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.patient.full_name}</div>
                  <div className="text-xs text-text-secondary">
                    <span className="font-mono">{r.patient.age}y</span> · {r.patient.sex} · {r.patient.village ?? "—"}
                  </div>
                </div>
                {r.last_assessment ? <RiskDotsBadge band={r.last_assessment.band} /> : <span className="text-xs text-text-muted">—</span>}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
