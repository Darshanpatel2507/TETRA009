import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePatients } from "../../hooks/usePatients";
import { createAssessment } from "../../hooks/useAssessment";
import { useToast } from "../../components/ui/Toast";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { classNames, bandLabel, getBandColorClass } from "../../lib/utils/formatters";
import { MasterSymptomWizard } from "../../components/intake/MasterSymptomWizard";
import type { IntakePayload } from "../../types";
import {
  IconUser,
  IconHeart,
  IconInfo,
  IconSparkles,
  IconCheck,
  IconClipboard
} from "../../components/ui/SahayakIcons";

export function PersonalHealthDashboard() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { data: records, refetch, isLoading } = usePatients();

  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"logs" | "guide">("logs");

  // Individual profile state (No relationship menu!)
  const [formName, setFormName] = useState("");
  const [formAge, setFormAge] = useState<number>(30);
  const [formSex, setFormSex] = useState<"M" | "F">("M");
  const [formSymptoms, setFormSymptoms] = useState<Record<string, any>>({ durations: {}, unclassified_notes: [] });

  const personalRecords = (records ?? []).filter((r) => {
    return r.patient.portal_type === "personal" && !r.patient.family_code;
  });

  const handleSaveCheckup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      push({ kind: "error", title: "Missing Name", body: "Please enter your name for this checkup record." });
      return;
    }

    setIsSubmitting(true);

    const payload: IntakePayload = {
      full_name: formName.trim(),
      age: Number(formAge),
      sex: formSex,
      village: "Individual Self-Checkup",
      phone: "+91 98XXX-XXXXX",
      portal_type: "personal",
      vitals: {
        height_cm: 170,
        weight_kg: 65,
        systolic_bp: 118,
        diastolic_bp: 78,
      },
      symptoms: {
        face_droop: Boolean(formSymptoms["face_droop"] || formSymptoms["slurred_speech"]),
        arm_weakness: Boolean(formSymptoms["arm_weakness"]),
        speech_difficulty: Boolean(formSymptoms["slurred_speech"]),
        chest_pain: Boolean(formSymptoms["chest_pain"] || formSymptoms["chest_pressure"]),
        shortness_of_breath: Boolean(formSymptoms["shortness_of_breath"]),
        polyuria: Boolean(formSymptoms["polyuria"] || formSymptoms["frequent_urination"]),
        polydipsia: Boolean(formSymptoms["polydipsia"] || formSymptoms["unusual_thirst"]),
        fatigue: Boolean(formSymptoms["fatigue"] || formSymptoms["excessive_fatigue"]),
        swelling_legs: Boolean(formSymptoms["swelling_legs"] || formSymptoms["ankle_swelling"]),
        durations: (formSymptoms.durations || {}) as Record<string, string>,
        unclassified_notes: (formSymptoms.unclassified_notes || []) as string[],
        ...formSymptoms,
      } as any,
      history: {
        smoking: false,
        alcohol_units_per_week: 0,
        family_diabetes: false,
        family_hypertension: false,
        family_cvd: false,
        family_stroke: false,
        on_antihypertensive: false,
        on_statin: false,
      },
      labs: {
        fasting_glucose_mg_dl: 92,
      },
    };

    try {
      const res = await createAssessment(payload);
      push({
        kind: "info",
        title: "Symptom Checkup Recorded!",
        body: `Your individual health evaluation for ${formName} has been processed and saved.`,
      });
      setShowAddModal(false);
      setFormName("");
      setFormAge(30);
      setFormSymptoms({ durations: {}, unclassified_notes: [] });
      refetch();
      // Navigate directly to their results
      if (res?.assessment?.id || res?.patientId) {
        navigate(`/patient/${res.assessment?.id || res.patientId}/constellation`);
      }
    } catch (err: any) {
      push({ kind: "error", title: "Submission Failed", body: err.message || "Could not save personal record." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const educationalTopics = [
    {
      icon: <IconSparkles size={24} className="text-brand-primary" />,
      title: "AI-Powered Free-Text Translation",
      subtitle: "Turning Everyday Words into Structured Medical Context",
      description: "When you type or speak your symptoms in your own natural phrasing, our diagnostic assistant automatically extracts key symptoms and matches them directly to recognized clinical taxonomy without hallucinating diagnoses.",
      highlight: "AI only structures your observations; deterministic clinical rules compute all urgency statuses."
    },
    {
      icon: <IconClipboard size={24} className="text-brand-primary" />,
      title: "Why Symptom Duration Matters",
      subtitle: "Differentiating Acute Spikes from Chronic Baseline Trends",
      description: "Every checked symptom opens a timeline selector. Symptoms that started today or over the last few days may require accelerated attention compared to longstanding baseline conditions that require steady outpatient management.",
      highlight: "Always indicate accurate timelines for precise diagnostic advice."
    },
    {
      icon: <IconHeart size={24} className="text-brand-primary" />,
      title: "Individual Privacy & Autonomy",
      subtitle: "Your Personal Symptom Journal",
      description: "Records saved in this Personal Health portal remain confidential and decoupled from group household tables or general hospital community registries, allowing you to self-evaluate with peace of mind.",
      highlight: "Review plain-language advice at your own pace before engaging healthcare providers."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto space-y-8 pb-16 relative text-left"
    >
      {/* Hero Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1E19] via-[#112F26] to-[#091814] border border-brand-primary/30 p-8 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary font-mono text-xs font-bold border border-brand-primary/30 mb-4">
            <IconUser size={16} className="shrink-0 text-current" />
            <span>INDIVIDUAL SYMPTOM TRACKING & GUIDANCE</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            My Personal Health Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-3 max-w-3xl leading-relaxed font-sans font-medium">
            Log individual symptoms at any time, check real-time diagnostic indicators in everyday language, and track your self-evaluation journal without requiring family relationship codes or hospital appointments.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={classNames(
                "px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm border",
                activeTab === "logs"
                  ? "bg-brand-primary text-white border-brand-primary shadow-md"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
              )}
            >
              <IconClipboard size={18} />
              <span>My Checkup Logs ({personalRecords.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={classNames(
                "px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm border",
                activeTab === "guide"
                  ? "bg-brand-primary text-white border-brand-primary shadow-md"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
              )}
            >
              <IconInfo size={18} />
              <span>How Diagnostic Guidance Works</span>
            </button>
          </div>
        </div>

        <div className="shrink-0 w-full lg:w-auto relative z-10">
          <Button
            size="lg"
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="w-full lg:w-auto font-extrabold px-6 py-4 text-sm md:text-base shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 bg-brand-primary hover:opacity-90 text-white border border-white/20 rounded-2xl cursor-pointer"
          >
            <IconSparkles size={20} className="shrink-0" />
            <span>Log New Personal Checkup</span>
          </Button>
        </div>
      </div>

      {/* Main Area: Logs vs Guide */}
      <AnimatePresence mode="wait">
        {activeTab === "logs" ? (
          <motion.div
            key="logs-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-display font-black text-xl text-text-primary flex items-center gap-2">
                  <IconClipboard size={22} className="text-brand-primary" />
                  <span>Individual Symptom History</span>
                </h2>
                <p className="text-xs text-text-secondary font-medium mt-0.5">
                  Select any previous screening below to review your comprehensive Risk Constellation and advice report.
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold text-brand-primary hover:bg-surface-elevated px-3.5 py-2 border border-brand-primary/40 rounded-xl flex items-center gap-1.5 shadow-2xs"
              >
                <span>+ Start Fresh Evaluation</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-text-secondary font-mono">
                Loading your personal health evaluations...
              </div>
            ) : personalRecords.length === 0 ? (
              <Card className="p-12 text-center bg-surface border border-dashed border-border rounded-3xl max-w-2xl mx-auto my-8 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 text-brand-primary mx-auto mb-4 flex items-center justify-center border border-brand-primary/20">
                  <IconUser size={36} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-text-primary">No Individual Records Found Yet</h3>
                <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed font-medium">
                  Your journal is currently empty. Get started by logging your initial symptom screening using our guided plain-language medical questionnaire.
                </p>
                <div className="mt-8">
                  <Button
                    variant="primary"
                    className="font-bold px-7 py-3.5 text-sm shadow-lg flex items-center justify-center gap-2 mx-auto rounded-xl"
                    onClick={() => setShowAddModal(true)}
                  >
                    <IconSparkles size={18} />
                    <span>Start My First Checkup</span>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalRecords.map((row) => {
                  const pat = row.patient;
                  const ass = row.last_assessment;
                  const band = ass?.band || "low";
                  const targetId = ass?.id || pat.id;

                  return (
                    <Card
                      key={pat.id}
                      onClick={() => navigate(`/patient/${targetId}/constellation`)}
                      className="p-6 bg-surface hover:bg-surface-elevated border border-border transition-all cursor-pointer group rounded-3xl shadow-sm hover:shadow-md flex flex-col justify-between text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 bg-surface-elevated px-3 py-1 rounded-full text-xs font-mono font-bold text-text-secondary border border-border/70 shadow-2xs">
                            <IconUser size={14} className="text-brand-primary shrink-0" />
                            <span>Individual Record</span>
                          </span>
                          <span className={classNames(
                            "px-3 py-1 rounded-full text-[10px] font-mono uppercase shadow-2xs",
                            getBandColorClass(band)
                          )}>
                            {band === "low" ? "ALL CLEAR" : bandLabel(band)}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-2.5">
                          <IconUser size={20} className="text-brand-primary shrink-0" />
                          <span className="truncate">{pat.full_name || "Self-Checkup"}</span>
                        </h3>
                        <div className="text-xs font-mono text-text-muted mt-1.5">
                          Age: {pat.age}y · Sex: {pat.sex} · Date: {new Date(ass?.assessed_at || pat.created_at).toLocaleDateString()}
                        </div>

                        <div className="mt-5 p-4 rounded-2xl bg-surface-elevated border border-border/80 text-xs">
                          <div className="font-bold text-text-primary text-[11px] font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <IconInfo size={15} className="text-brand-primary shrink-0" />
                            <span>Guidance Summary:</span>
                          </div>
                          <div className="text-text-secondary line-clamp-2 leading-relaxed font-sans font-medium">
                            {ass?.decision?.rationale || "All recorded symptoms reflect baseline health within safe parameters."}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs font-bold text-brand-primary">
                        <span>Open Comprehensive Report</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="guide-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="border-b border-border pb-4">
              <h2 className="font-display font-black text-xl text-text-primary flex items-center gap-2">
                <IconInfo size={22} className="text-brand-primary" />
                <span>How Personal Symptom Intelligence & Scoring Works</span>
              </h2>
              <p className="text-xs text-text-secondary font-medium mt-1">
                Transparency and precision guide every calculation in your personal checkup report.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educationalTopics.map((topic, idx) => (
                <Card key={idx} className="p-7 bg-surface border border-border rounded-3xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border w-fit mb-4 shadow-2xs">
                      {topic.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs font-bold text-brand-primary mb-3 font-sans">
                      {topic.subtitle}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                      {topic.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/80">
                    <span className="text-xs font-bold text-text-primary flex items-start gap-2 bg-surface-elevated p-3 rounded-xl border border-border">
                      <IconCheck size={16} className="text-brand-primary shrink-0 mt-0.5" />
                      <span>{topic.highlight}</span>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Modal for Logging New Individual Symptoms */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4 overflow-y-auto lg:pl-[280px]"
            onClick={() => !isSubmitting && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-surface border border-border rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-border mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl md:text-2xl text-text-primary flex items-center gap-2.5">
                    <IconUser size={26} className="text-brand-primary shrink-0" />
                    <span>Individual Symptom Assessment</span>
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary mt-1 font-medium">
                    Enter basic identity details below and check any noticed symptoms. No household code or relationship is needed.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="text-text-muted hover:text-text-primary p-2.5 rounded-2xl bg-surface-elevated border border-border text-lg font-bold w-10 h-10 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCheckup} className="space-y-8">
                {/* Basic Demographics Grid (No Relationship Select!) */}
                <div className="bg-surface-elevated p-6 rounded-2xl border border-border space-y-4 shadow-inner">
                  <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
                    <IconInfo size={16} className="text-brand-primary" />
                    <span>Your Basic Information</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wide font-mono">
                        Your Full Name <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditya Sharma"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-surface border border-border p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary shadow-2xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wide font-mono">
                          Age (Years)
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={120}
                          value={formAge}
                          onChange={(e) => setFormAge(Number(e.target.value))}
                          disabled={isSubmitting}
                          className="w-full rounded-xl bg-surface border border-border p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary font-mono font-bold text-center shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wide font-mono text-center">
                          Sex
                        </label>
                        <div className="flex bg-surface p-1 rounded-xl border border-border h-11">
                          <button
                            type="button"
                            onClick={() => setFormSex("M")}
                            disabled={isSubmitting}
                            className={classNames(
                              "flex-1 rounded-lg text-xs font-black transition-all cursor-pointer",
                              formSex === "M" ? "bg-brand-primary text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
                            )}
                          >
                            M
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormSex("F")}
                            disabled={isSubmitting}
                            className={classNames(
                              "flex-1 rounded-lg text-xs font-black transition-all cursor-pointer",
                              formSex === "F" ? "bg-brand-primary text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
                            )}
                          >
                            F
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Master Symptom Screening Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-display font-bold text-base md:text-lg text-text-primary flex items-center gap-2">
                      <IconClipboard size={20} className="text-brand-primary" />
                      <span>Master Symptom Screening</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold bg-surface-elevated px-3 py-1 rounded-full text-text-secondary border border-border">
                      34 Clinical Checks Available
                    </span>
                  </div>
                  <div className="bg-surface p-1 rounded-2xl">
                    <MasterSymptomWizard
                      symptoms={formSymptoms}
                      onChange={(updated) => setFormSymptoms(updated)}
                      isEmbedded={true}
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3.5 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                    className="font-bold text-sm text-text-secondary px-5 py-3 border border-border rounded-xl hover:bg-surface-elevated cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="font-extrabold px-8 py-3.5 text-sm shadow-xl flex items-center gap-2 rounded-xl bg-brand-primary hover:opacity-90 text-white cursor-pointer"
                  >
                    <IconSparkles size={18} />
                    <span>{isSubmitting ? "Processing Evaluation..." : "Save & Calculate Guidance"}</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
