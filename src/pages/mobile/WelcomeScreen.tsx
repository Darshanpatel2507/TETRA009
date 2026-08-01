import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useLang } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export function WelcomeScreen() {
  const { t } = useLang();
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card className="p-5">
        <h2 className="font-display text-xl">Welcome</h2>
        <p className="text-sm text-text-secondary mt-1">
          Start a new assessment or view the existing patient list.
        </p>
        <div className="grid gap-3 mt-4">
          <Button onClick={() => navigate("/patient/intake")}>{t("nav.intake")}</Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>{t("nav.dashboard")}</Button>
        </div>
      </Card>
    </motion.div>
  );
}
