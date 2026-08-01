/**
 * VoiceInputField — microphone button that fills the associated
 * input via the Web Speech API. Lives next to every text/numeric
 * input per the low-literacy mandate.
 */
import { useVoiceInput } from "../../hooks/useVoiceInput";
import { Tooltip } from "../ui/Tooltip";
import { useLang } from "../../context/LanguageContext";
import { classNames } from "../../lib/utils/formatters";

interface Props {
  onResult: (text: string) => void;
  className?: string;
}

export function VoiceInputField({ onResult, className }: Props) {
  const { t } = useLang();
  const v = useVoiceInput(onResult);
  if (!v.isSupported) return null;
  return (
    <Tooltip label={t("intake.voice")}>
      <button
        type="button"
        onClick={v.isListening ? v.stop : v.start}
        aria-label={t("intake.voice")}
        className={classNames(
          "h-11 w-11 rounded-lg border border-border bg-surface hover:bg-surface-muted grid place-items-center",
          v.isListening && "border-risk-high text-risk-high",
          className ?? "",
        )}
      >
        <span className="text-lg">🎙</span>
      </button>
    </Tooltip>
  );
}
