import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { usePatients } from "../../hooks/usePatients";
import { createAssessment } from "../../hooks/useAssessment";
import { useToast } from "../../components/ui/Toast";
import { bandLabel, classNames, getBandColorClass } from "../../lib/utils/formatters";
import type { IntakePayload } from "../../types";
import {
  IconUser,
  IconHomeWellness,
  IconHeart,
  IconDiabetes,
  IconBP,
  IconBrain,
  IconKidney,
  IconShield,
  IconSparkles,
  IconClipboard,
  IconMic,
  IconInfo,
  IconCheck,
  IconUrgencyImmediate,
  IconArrowRight,
  IconDoctor,
} from "../../components/ui/SahayakIcons";
import { MasterSymptomWizard } from "../../components/intake/MasterSymptomWizard";

export function PatientPortalDashboard() {
  const navigate = useNavigate();
  const { data: records, isLoading, refetch } = usePatients();
  const { push } = useToast();

  // Family group management state
  const [familyCode, setFamilyCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("sahayak_active_family_code") || "7392";
    }
    return "7392";
  });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inputCode, setInputCode] = useState("");
  
  // On-page Add Member form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRelation, setFormRelation] = useState("Self");
  const [formAge, setFormAge] = useState(45);
  const [formSex, setFormSex] = useState<"M" | "F">("M");
  const [formBP, setFormBP] = useState<"normal" | "mild" | "high">("normal");
  const [formSugar, setFormSugar] = useState<"normal" | "high">("normal");
  const [formFast, setFormFast] = useState(false);
  const [formSymptoms, setFormSymptoms] = useState<Record<string, any>>({ durations: {}, unclassified_notes: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  function changeFamilyCode(code: string) {
    setFamilyCode(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sahayak_active_family_code", code);
    }
  }

  function handleCreateFamily() {
    // Ensure strict 4-digit uniqueness against existing family codes in registry
    const existingCodes = new Set((records ?? []).map((r) => r.patient.family_code).filter(Boolean));
    let newCode = Math.floor(1000 + Math.random() * 9000).toString();
    while (existingCodes.has(newCode)) {
      newCode = Math.floor(1000 + Math.random() * 9000).toString();
    }
    changeFamilyCode(newCode);
    push({
      kind: "info",
      title: `Created New Family Group #${newCode}`,
      body: "Your secure family space is ready! You can now add your household members below.",
    });
  }

  function handleJoinFamilySubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!/^\d{4}$/.test(clean)) {
      push({ kind: "error", title: "Invalid Family Code", body: "Please enter exactly a 4-digit numeric family code (e.g. 7392)." });
      return;
    }
    changeFamilyCode(clean);
    setShowJoinModal(false);
    setInputCode("");
    push({
      kind: "info",
      title: `Joined Family Group #${clean}`,
      body: `Showing all family wellness checkups belonging to group #${clean}.`,
    });
  }

  async function handleAddMemberSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      push({ kind: "error", title: "Missing Name", body: "Please type the family member's name." });
      return;
    }
    setIsSubmitting(true);

    const payload: IntakePayload = {
      full_name: formName.trim(),
      age: Number(formAge),
      sex: formSex,
      village: `Family Hub #${familyCode}`,
      phone: "+91 98XXX-XXXXX",
      portal_type: "family",
      family_code: familyCode,
      relationship: formRelation,
      vitals: {
        height_cm: 168,
        weight_kg: 68,
        systolic_bp: formBP === "high" ? 158 : formBP === "mild" ? 136 : 116,
        diastolic_bp: formBP === "high" ? 98 : formBP === "mild" ? 88 : 76,
      },
      symptoms: {
        face_droop: Boolean(formFast || formSymptoms["face_droop"]),
        arm_weakness: Boolean(formSymptoms["arm_weakness"]),
        speech_difficulty: Boolean(formSymptoms["slurred_speech"]),
        chest_pain: Boolean(formSymptoms["chest_pain"]),
        shortness_of_breath: Boolean(formSymptoms["shortness_of_breath"]),
        polyuria: Boolean(formSugar === "high" || formSymptoms["polyuria"]),
        polydipsia: Boolean(formSugar === "high" || formSymptoms["polydipsia"]),
        fatigue: Boolean(formSymptoms["fatigue"]),
        swelling_legs: Boolean(formSymptoms["swelling_legs"]),
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
        fasting_glucose_mg_dl: formSugar === "high" ? 145 : 95,
      }
    };

    try {
      await createAssessment(payload);
      push({
        kind: "info",
        title: "Family Member Checkup Recorded!",
        body: `Added ${formName} (${formRelation}) into family group #${familyCode}.`,
      });
      setShowAddModal(false);
      setFormName("");
      setFormRelation("Self");
      setFormAge(45);
      setFormBP("normal");
      setFormSugar("normal");
      setFormFast(false);
      refetch();
    } catch (err: any) {
      push({ kind: "error", title: "Submission Failed", body: err.message || "Error saving family record" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const familyRecords = (records ?? []).filter((r) => {
    const isFamilyOrLegacy = r.patient.portal_type === "family" || (r.patient.portal_type === "personal" && Boolean(r.patient.family_code));
    if (!isFamilyOrLegacy) return false;
    const patCode = r.patient.family_code || "7392";
    return patCode === familyCode;
  });

  const vitalGuides = [
    {
      icon: <IconHeart size={26} />,
      title: "Heart & Blood Flow (CVD)",
      simpleStatus: "Healthy Blood Circulation",
      laymanExplanation: "This check ensures your heart is pumping oxygen-rich blood smoothly to all parts of your body without blockage or strain.",
      dailyAdvice: "Walking for 30 minutes a day and using less cooking salt directly strengthens your heart and keeps your blood flow energetic.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <IconDiabetes size={26} />,
      title: "Blood Sugar Balance (Diabetes)",
      simpleStatus: "Balanced Sugar Energy",
      laymanExplanation: "This check monitors how your body turns food sugar into everyday physical energy. Keeping sugar levels stable prevents unusual tiredness and protects your eyesight and nerves.",
      dailyAdvice: "Eating balanced meals with green vegetables and avoiding sweet fizzy drinks helps your body process sugar effortlessly.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <IconBP size={26} />,
      title: "Blood Pressure Strength (Hypertension)",
      simpleStatus: "Calm & Stable Pressure",
      laymanExplanation: "This check measures how gently your blood pushes against your blood vessel walls. When pressure is stable, your head feels light and comfortable.",
      dailyAdvice: "Getting 7-8 hours of peaceful rest and practicing deep breathing exercises helps keep your blood pressure calm and relaxed.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <IconBrain size={26} />,
      title: "Brain & Nerve Alertness (Stroke)",
      simpleStatus: "Fast & Responsive Nerves",
      laymanExplanation: "This check ensures your brain signals travel quickly to your arms, legs, and facial expressions without any sudden numbness or hesitation.",
      dailyAdvice: "Always remember the FAST warning rule: If anyone ever experiences sudden facial sagging or arm numbness, seek immediate hospital care without delay.",
      statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: <IconKidney size={26} />,
      title: "Kidney Filter Cleaning (CKD)",
      simpleStatus: "Effective Waste Cleaning",
      laymanExplanation: "This check ensures your kidneys are constantly washing away body wastes and keeping water levels balanced so your ankles and feet never feel puffy or swollen.",
      dailyAdvice: "Drinking plenty of clean, fresh drinking water throughout the day helps your internal kidney filters stay bright and active.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto space-y-8 pb-16 relative text-left"
    >
      {/* Top Banner & Quick Action */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0D211C] via-[#11312B] to-[#0A1A17] border border-[#1E4D43] p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              <IconHomeWellness size={16} className="text-current shrink-0" />
              <span>ACTIVE FAMILY GROUP CODE:</span>
              <span className="text-white font-black underline text-sm">#{familyCode}</span>
            </span>
            {familyCode === "7392" && (
              <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                <IconSparkles size={14} />
                <span>Default Demo Family Active</span>
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome to Your Family Wellness Hub
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed font-sans">
            All checkups entered here are kept completely separate from the Community Clinical Registry. Use your unique 4-digit family code so household members can securely join and check their vitals together.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <Button
            size="md"
            variant="ghost"
            onClick={handleCreateFamily}
            className="font-bold border border-emerald-400/40 hover:bg-emerald-500/20 text-emerald-300 px-4 py-3 text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <IconSparkles size={16} />
            <span>Create Family</span>
          </Button>
          <Button
            size="md"
            variant="ghost"
            onClick={() => setShowJoinModal(true)}
            className="font-bold border border-emerald-400/40 hover:bg-emerald-500/20 text-emerald-300 px-4 py-3 text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <IconClipboard size={16} />
            <span>Join Family</span>
          </Button>
          <Button
            size="md"
            variant="primary"
            className="font-extrabold px-5 py-3 text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300/50 rounded-xl"
            onClick={() => setShowAddModal(true)}
          >
            <IconUser size={18} />
            <span>Add Family Member</span>
          </Button>
        </div>
      </div>

      {/* My Family Members & Checkups Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span>Members in Family Group #{familyCode}</span>
              <span className="text-xs font-mono font-normal text-text-muted bg-surface px-2 py-0.5 rounded border border-border">
                {familyRecords.length} member{familyRecords.length !== 1 ? "s" : ""}
              </span>
            </h2>
            <p className="text-xs text-text-secondary font-sans font-medium">
              Click on any household member below to view their simple diagnosis summary and AI health advice.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {familyCode !== "7392" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeFamilyCode("7392")}
                className="text-xs text-text-secondary hover:text-text-primary underline"
              >
                Switch to Demo Family (#7392)
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-xs font-bold text-brand-primary border border-brand-primary/30 px-3.5 py-2 rounded-xl hover:bg-brand-primary/10 flex items-center gap-1.5"
            >
              <span>View Community Dashboard</span>
              <IconArrowRight size={14} className="text-current" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 rounded-2xl bg-surface text-center text-sm text-text-secondary animate-pulse border border-border font-sans font-semibold">
            Loading family wellness records...
          </div>
        ) : familyRecords.length === 0 ? (
          <Card className="p-10 text-center bg-surface border border-dashed border-border/80 rounded-2xl max-w-xl mx-auto my-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-500 mx-auto mb-4 flex items-center justify-center border border-emerald-500/30">
              <IconHomeWellness size={36} />
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary">No Members in Family #{familyCode} Yet</h3>
            <p className="text-xs text-text-secondary mt-2 max-w-md mx-auto leading-relaxed font-sans font-medium">
              You created a fresh family group! Get started by adding yourself or a loved one using the family health form below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button
                variant="primary"
                className="font-bold px-6 py-3 text-sm shadow-md flex items-center gap-2"
                onClick={() => setShowAddModal(true)}
              >
                <IconUser size={18} />
                <span>Add Family Member & Checkup</span>
              </Button>
              {familyCode !== "7392" && (
                <Button
                  variant="ghost"
                  className="font-semibold text-xs text-text-secondary border border-border px-4 py-2.5 rounded-xl"
                  onClick={() => changeFamilyCode("7392")}
                >
                  Load Demo Family (#7392)
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {familyRecords.map((item) => {
              const ass = item.last_assessment;
              const pat = item.patient;
              const band = ass?.band || "low";
              const targetId = ass?.id || pat.id;

              return (
                <Card
                  key={pat.id}
                  onClick={() => navigate(`/patient/${targetId}/constellation`)}
                  className="p-6 bg-surface hover:bg-surface-elevated border border-border transition-all cursor-pointer group rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 bg-surface-elevated px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-text-secondary border border-border/60">
                        <IconUser size={14} className="text-brand-primary shrink-0" />
                        <span>{pat.relationship || "Family Member"}</span>
                      </span>
                      <span className={classNames(
                        "px-2.5 py-1 rounded-full text-[10px] font-mono uppercase shadow-sm",
                        getBandColorClass(band)
                      )}>
                        {band === "low" ? "ALL CLEAR" : bandLabel(band)}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-2">
                      <IconUser size={18} className="text-brand-primary" />
                      <span>{pat.full_name || "Family Checkup"}</span>
                    </h4>
                    <div className="text-xs font-mono text-text-muted mt-1">
                      Age: {pat.age}y · Sex: {pat.sex} · ID: {pat.id.substring(0, 8)}
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-surface-muted/60 border border-border/50 text-xs">
                      <div className="font-bold text-text-primary text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <IconInfo size={14} className="text-brand-primary shrink-0" />
                        <span>Health Advice:</span>
                      </div>
                      <div className="text-text-secondary line-clamp-2 leading-relaxed font-sans font-medium">
                        {ass?.decision?.rationale || "All core vital checkups completely stable. Maintain active exercises and nutritious daily routine."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-brand-primary font-extrabold group-hover:translate-x-1 transition-transform font-sans">
                    <span>View Complete Checkup Summary</span>
                    <IconArrowRight size={16} className="text-current" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 5 Core Health Indicators (Explained Simply) */}
      <div>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Understanding Your 5 Core Vital Areas
          </h2>
          <p className="text-sm text-text-secondary mt-1 font-sans font-medium">
            We broke down medical hospital terminology into clear, reassuring everyday concepts so you and your family know exactly what protects your wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitalGuides.map((guide, idx) => {
            const isOpen = selectedTopic === idx;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedTopic(isOpen ? null : idx)}
                className="rounded-2xl p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 cursor-pointer transition-all flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-surface-elevated border border-border/60 shadow-inner text-emerald-400 shrink-0">
                        {guide.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-text-primary tracking-tight font-sans">
                          {guide.title}
                        </h3>
                        <span className={classNames("inline-flex items-center gap-1 mt-1 text-[11px] font-black font-mono px-2 py-0.5 rounded border", guide.statusColor)}>
                          <IconCheck size={13} className="shrink-0" />
                          <span>{guide.simpleStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary mt-4 leading-relaxed font-sans font-medium">
                    {guide.laymanExplanation}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="text-[11px] font-bold font-mono uppercase text-brand-primary tracking-wider mb-1.5 flex items-center gap-1.5">
                    <IconHomeWellness size={14} className="text-brand-primary shrink-0" />
                    <span>Daily Family Wellness Tip:</span>
                  </div>
                  <p className="text-xs text-text-primary font-medium leading-relaxed font-sans bg-surface-elevated p-3.5 rounded-xl border border-border/40">
                    {guide.dailyAdvice}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* 6th Card: Ask Sahayak Coach Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-brand-primary via-[#0F362C] to-[#0A261E] text-white shadow-lg flex flex-col justify-between border border-brand-primary/40 text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                <IconMic size={26} className="text-emerald-300" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Have questions about a symptom?
              </h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed font-sans font-medium">
                Whenever you feel unusual fatigue, fever, or breathlessness, simply use Sahayak's built-in voice recorder during a checkup. Our smart AI will structure your thoughts in English, Hindi, or Gujarati without confusing hospital vocabulary!
              </p>
            </div>

            <Button
              size="sm"
              variant="subtle"
              className="mt-6 w-full font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 py-3 rounded-xl flex items-center justify-center gap-2"
              onClick={() => navigate("/patient/intake")}
            >
              <IconMic size={16} />
              <span>Try Voice Symptom Check Now</span>
              <IconArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Health Pledge & Support */}
      <Card className="p-6 bg-surface-elevated rounded-2xl border border-border text-left text-xs text-text-secondary flex items-center gap-3">
        <IconShield size={24} className="text-emerald-400 shrink-0" />
        <p className="font-medium text-text-primary font-sans leading-relaxed">
          <strong>Sahayak Commitment to Ordinary Citizens:</strong> We believe healthcare advice should be as familiar as speaking with a supportive neighbor or family doctor. Zero complicated jargon, zero AI hallucinations, and mandatory test deadlines.
        </p>
      </Card>

      {/* MODAL: Switch / Join Family Group */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:pl-[280px] bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl border border-border p-7 max-w-md w-full shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display font-bold text-lg text-text-primary">
                  Connect to a Household
                </h3>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="text-text-secondary hover:text-text-primary text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-xs text-text-secondary leading-relaxed font-sans">
                  <strong className="text-text-primary font-bold block mb-0.5">How Family Groups Work:</strong>
                  Every rural family receives a secure 4-digit code (e.g. 7392). Everyone in your home who enters this same number can view shared checkups and family guidance on any mobile device.
                </div>

                <form onSubmit={handleJoinFamilySubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-text-primary font-sans mb-1.5">
                      Enter Existing 4-Digit Family Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 7392"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full font-mono text-center text-xl tracking-widest px-4 py-3 rounded-2xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-extrabold shadow-inner"
                    />
                  </div>
                  <Button variant="primary" size="md" type="submit" className="w-full font-extrabold py-3 shadow-md">
                    Switch to This Family Hub
                  </Button>
                </form>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs font-mono uppercase font-bold text-text-muted">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-text-secondary">
                  Setting up Sahayak for your home for the very first time?
                </p>
                <Button
                  variant="subtle"
                  size="md"
                  type="button"
                  onClick={() => {
                    handleCreateFamily();
                    setShowJoinModal(false);
                  }}
                  className="w-full font-bold text-xs bg-surface-elevated border-border text-text-primary py-3 flex items-center justify-center gap-2"
                >
                  <IconSparkles size={16} className="text-brand-primary" />
                  <span>Generate a Brand New 4-Digit Family ID</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:pl-[280px] bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-surface text-text-primary rounded-3xl border border-border p-6 md:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded border border-brand-primary/20">
                    Family #{familyCode} Intake
                  </span>
                  <h3 className="font-display font-bold text-xl text-text-primary mt-1">
                    Add Family Member & Symptom Check
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-text-secondary hover:text-text-primary text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-6 text-sm font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Patel"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-semibold text-sm shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Relationship in Household
                    </label>
                    <select
                      value={formRelation}
                      onChange={(e) => setFormRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-semibold text-sm shadow-2xs cursor-pointer"
                    >
                      <option value="Self">Self</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formAge}
                      onChange={(e) => setFormAge(Number(e.target.value))}
                      className="w-full font-mono px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-semibold text-sm shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormSex("M")}
                        className={classNames(
                          "flex-1 py-2.5 rounded-xl font-bold border text-center transition-all cursor-pointer shadow-2xs",
                          formSex === "M"
                            ? "bg-brand-primary text-white border-brand-primary shadow-sm font-black"
                            : "bg-surface-elevated text-text-secondary border-border hover:bg-surface hover:text-text-primary"
                        )}
                      >
                        Male (M)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormSex("F")}
                        className={classNames(
                          "flex-1 py-2.5 rounded-xl font-bold border text-center transition-all cursor-pointer shadow-2xs",
                          formSex === "F"
                            ? "bg-brand-primary text-white border-brand-primary shadow-sm font-black"
                            : "bg-surface-elevated text-text-secondary border-border hover:bg-surface hover:text-text-primary"
                        )}
                      >
                        Female (F)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="mb-4">
                    <h4 className="text-base font-extrabold text-text-primary flex items-center gap-2">
                      <IconBrain size={20} className="text-brand-primary shrink-0" />
                      <span>Master Symptom Screening</span>
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 font-medium">
                      Select any experienced symptoms and pick how long they have been occurring to calibrate precision health scores for this family member.
                    </p>
                  </div>
                  <MasterSymptomWizard
                    symptoms={formSymptoms}
                    onChange={(updated) => setFormSymptoms(updated)}
                    isEmbedded={true}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)} className="text-text-secondary hover:text-text-primary font-bold">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 text-sm shadow-md flex items-center gap-2 bg-brand-primary text-white font-extrabold hover:opacity-90"
                  >
                    <IconCheck size={16} />
                    <span>{isSubmitting ? "Saving Checkup..." : "Save Member Checkup"}</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
