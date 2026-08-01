import { IconDoctor, IconClipboard } from "../ui/SahayakIcons";

interface Props {
  symptoms: Record<string, any>;
  onChange: (updatedSymptoms: Record<string, any>) => void;
  onSkipToHistory?: () => void;
}

/**
 * HospitalStaffForm — healthcare staff intake bypass. Removes subjective symptom
 * questioning and immediately prompts hospital workers and clinicians to navigate directly
 * to Medical & Clinical History for objective diagnostic evaluation.
 */
export function HospitalStaffForm({ onSkipToHistory }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-surface shadow-xl p-8 text-text-primary text-left max-w-3xl mx-auto my-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 text-brand-primary shrink-0">
          <IconDoctor size={32} />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-brand-primary/15 text-brand-primary inline-block mb-1">
            Clinical Staff Protocol Active
          </span>
          <h3 className="text-lg md:text-xl font-display font-bold text-text-primary">
            Symptom Screening Omitted for Hospital Staff
          </h3>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-sans pt-1">
            Subjective symptom questionnaires are tailored for direct patient and citizen self-reporting. When conducting a professional assessment as a doctor, nurse, or hospital worker, please proceed directly to the next step (Medical History) to input structured clinical records and diagnostic evaluations.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface-elevated border border-border text-xs md:text-sm text-text-secondary flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconClipboard size={22} className="text-brand-primary shrink-0" />
          <span className="font-semibold text-text-primary">
            Ready to log patient medical history and vital parameters?
          </span>
        </div>
        {onSkipToHistory && (
          <button
            type="button"
            onClick={onSkipToHistory}
            className="px-6 py-3 rounded-xl bg-brand-primary text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm hover:opacity-90 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Medical History</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
