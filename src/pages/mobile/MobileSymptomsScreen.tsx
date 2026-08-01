import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import { useToast } from "../../components/ui/Toast";

export function MobileSymptomsScreen() {
  const { t } = useLang();
  const { push } = useToast();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState({
    face_droop: false,
    arm_weakness: false,
    speech_difficulty: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-3"
    >
      <Card className="p-4">
        <h3 className="font-display text-lg">FAST screen</h3>
        <p className="text-xs text-text-secondary mb-3">Any positive = immediate referral.</p>
        <Row
          label={t("field.face_droop")}
          checked={symptoms.face_droop}
          onChange={(v) => setSymptoms((s) => ({ ...s, face_droop: v }))}
        />
        <Row
          label={t("field.arm_weakness")}
          checked={symptoms.arm_weakness}
          onChange={(v) => setSymptoms((s) => ({ ...s, arm_weakness: v }))}
        />
        <Row
          label={t("field.speech_difficulty")}
          checked={symptoms.speech_difficulty}
          onChange={(v) => setSymptoms((s) => ({ ...s, speech_difficulty: v }))}
        />
      </Card>
      <Button
        className="w-full"
        onClick={() => {
          const positive =
            symptoms.face_droop || symptoms.arm_weakness || symptoms.speech_difficulty;
          if (positive) {
            push({ kind: "error", title: "FAST positive", body: "Refer to emergency immediately." });
          } else {
            push({ kind: "success", title: "FAST negative", body: "Continue to vitals." });
          }
          navigate("/patient/intake");
        }}
      >
        Save & continue
      </Button>
    </motion.div>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
