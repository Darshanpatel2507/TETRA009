import { motion } from "framer-motion";
import { IntakeStepper } from "../../components/intake/IntakeStepper";
import { useLang } from "../../context/LanguageContext";

export function PatientIntakePage() {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <h1 className="font-display text-2xl">{t("intake.title")}</h1>
      <IntakeStepper />
    </motion.div>
  );
}
