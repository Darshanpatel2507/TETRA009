import { useState } from "react";
import type { IntakePayload } from "../../types";
import { MasterSymptomWizard } from "./MasterSymptomWizard";
import { HospitalStaffForm } from "./HospitalStaffForm";
import { IconUser, IconDoctor, IconHospital, IconInfo } from "../ui/SahayakIcons";

interface Props {
  value: IntakePayload;
  onChange: (p: Partial<IntakePayload>) => void;
  onSkipToHistory?: () => void;
}

export function SymptomsForm({ value, onChange, onSkipToHistory }: Props) {
  const [mode, setMode] = useState<"patient" | "staff">("patient");

  return (
    <div className="space-y-6 text-left">
      {/* Mode Selector Top Bar */}
      <div className="p-5 md:p-6 rounded-3xl border border-border bg-surface shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <h4 className="text-sm md:text-base font-extrabold text-text-primary flex items-center gap-2">
            <IconHospital size={20} className="text-brand-primary shrink-0" />
            <span>Who is filling out this symptom assessment?</span>
          </h4>
          <p className="text-xs text-text-secondary mt-1 flex items-center gap-1.5 font-medium">
            <IconInfo size={14} className="text-brand-primary shrink-0" />
            <span>Patients receive conversational questions with duration tracking. Healthcare workers bypass subjective questionnaires to enter direct medical histories.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-elevated p-1.5 rounded-2xl border border-border w-full md:w-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setMode("patient")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all shadow-2xs cursor-pointer ${
              mode === "patient"
                ? "bg-brand-primary text-white shadow-sm font-black"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            <IconUser size={16} />
            <span>Patient / Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("staff")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all shadow-2xs cursor-pointer ${
              mode === "staff"
                ? "bg-brand-primary text-white shadow-sm font-black"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            <IconDoctor size={16} />
            <span>Hospital Staff / Nurse</span>
          </button>
        </div>
      </div>

      {/* Conditional Form Render based on Mode */}
      {mode === "patient" ? (
        <MasterSymptomWizard
          symptoms={value.symptoms}
          onChange={(s) => onChange({ symptoms: s as any })}
          isEmbedded={true}
        />
      ) : (
        <HospitalStaffForm
          symptoms={value.symptoms}
          onChange={(s) => onChange({ symptoms: s as any })}
          onSkipToHistory={onSkipToHistory}
        />
      )}
    </div>
  );
}
