import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { usePatients } from "../../hooks/usePatients";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function MobileDashboardScreen() {
  const navigate = useNavigate();
  const q = usePatients();
  const rows = q.data ?? [];
  const high = rows.filter((r) => ["high", "critical"].includes(r.last_assessment?.band ?? "low")).length;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card className="p-5 bg-surface-sidebar text-text-inverse">
        <div className="text-xs text-text-inverse/70">Today</div>
        <div className="font-display text-3xl">{rows.length}</div>
        <div className="text-sm mt-1">{high} urgent cases</div>
      </Card>
      <Button className="w-full" onClick={() => navigate("/patient/intake")}>+ New assessment</Button>
      <Button variant="ghost" className="w-full" onClick={() => navigate("/dashboard")}>Open full dashboard</Button>
    </motion.div>
  );
}
