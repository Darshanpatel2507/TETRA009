import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { usePatients } from "../../hooks/usePatients";
import { createAssessment } from "../../hooks/useAssessment";
import { useToast } from "../../components/ui/Toast";
import { bandLabel, classNames } from "../../lib/utils/formatters";
import type { IntakePayload } from "../../types";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // Switch or create family code
  function changeFamilyCode(code: string) {
    setFamilyCode(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sahayak_active_family_code", code);
    }
  }

  function handleCreateFamily() {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    changeFamilyCode(newCode);
    push({
      kind: "info",
      title: `Created New Family Group #${newCode}`,
      body: "Your fresh family space is ready! You can now add your household members below.",
    });
  }

  function handleJoinFamilySubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!clean || clean.length < 3) {
      push({ kind: "error", title: "Invalid Family Code", body: "Please enter a valid 4-digit family number." });
      return;
    }
    changeFamilyCode(clean);
    setShowJoinModal(false);
    setInputCode("");
    push({
      kind: "info",
      title: `Joined Family Group #${clean}`,
      body: `Showing all personal wellness checkups belonging to family #${clean}.`,
    });
  }

  // Handle personal intake form creation directly on page
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
      portal_type: "personal",
      family_code: familyCode,
      relationship: formRelation,
      vitals: {
        height_cm: 168,
        weight_kg: 68,
        systolic_bp: formBP === "high" ? 158 : formBP === "mild" ? 136 : 116,
        diastolic_bp: formBP === "high" ? 98 : formBP === "mild" ? 88 : 76,
      },
      symptoms: {
        face_droop: formFast,
        arm_weakness: false,
        speech_difficulty: false,
        chest_pain: false,
        shortness_of_breath: false,
        polyuria: formSugar === "high",
        polydipsia: formSugar === "high",
        fatigue: false,
        swelling_legs: false,
      },
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

  // Filter records specifically for this portal & family group
  const familyRecords = (records ?? []).filter((r) => {
    const isPersonal = r.patient.portal_type === "personal";
    if (!isPersonal) return false;
    // Match active family code (defaulting to 7392 if unassigned)
    const patCode = r.patient.family_code || "7392";
    return patCode === familyCode;
  });

  const vitalGuides = [
    {
      icon: "❤️",
      title: "Heart & Blood Flow (CVD)",
      simpleStatus: "Healthy Blood Circulation",
      laymanExplanation: "This check ensures your heart is pumping oxygen-rich blood smoothly to all parts of your body without blockage or strain.",
      dailyAdvice: "Walking for 30 minutes a day and using less cooking salt directly strengthens your heart and keeps your blood flow energetic.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: "🩸",
      title: "Blood Sugar Balance (Diabetes)",
      simpleStatus: "Balanced Sugar Energy",
      laymanExplanation: "This check monitors how your body turns food sugar into everyday physical energy. Keeping sugar levels stable prevents unusual tiredness and protects your eyesight and nerves.",
      dailyAdvice: "Eating balanced meals with green vegetables and avoiding sweet fizzy drinks helps your body process sugar effortlessly.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: "💓",
      title: "Blood Pressure Strength (Hypertension)",
      simpleStatus: "Calm & Stable Pressure",
      laymanExplanation: "This check measures how gently your blood pushes against your blood vessel walls. When pressure is stable, your head feels light and comfortable.",
      dailyAdvice: "Getting 7-8 hours of peaceful rest and practicing deep breathing exercises helps keep your blood pressure calm and relaxed.",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: "🧠",
      title: "Brain & Nerve Alertness (Stroke)",
      simpleStatus: "Fast & Responsive Nerves",
      laymanExplanation: "This check ensures your brain signals travel quickly to your arms, legs, and facial expressions without any sudden numbness or hesitation.",
      dailyAdvice: "Always remember the FAST warning rule: If anyone ever experiences sudden facial sagging or arm numbness, seek immediate hospital care without delay.",
      statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: "🛡️",
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
      className="max-w-7xl mx-auto space-y-8 pb-16 relative"
    >
      {/* Top Banner & Quick Action */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0D211C] via-[#11312B] to-[#0A1A17] border border-[#1E4D43] p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              <span>🏡 ACTIVE FAMILY GROUP CODE:</span>
              <span className="text-white font-black underline text-sm">#{familyCode}</span>
            </span>
            {familyCode === "7392" && (
              <span className="text-[11px] font-mono font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                ✨ Default Demo Family Active
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Hello! Welcome to Your Family Wellness Hub
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
            All checkups entered here are kept completely separate from the Community Clinical Registry. Use your unique 4-digit family code so household members can securely join and check their vitals together.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <Button
            size="md"
            variant="ghost"
            onClick={handleCreateFamily}
            className="font-bold border border-emerald-400/40 hover:bg-emerald-500/20 text-emerald-300 px-4 py-3 text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>➕ Create Family</span>
          </Button>
          <Button
            size="md"
            variant="ghost"
            onClick={() => setShowJoinModal(true)}
            className="font-bold border border-emerald-400/40 hover:bg-emerald-500/20 text-emerald-300 px-4 py-3 text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>🔗 Join Family</span>
          </Button>
          <Button
            size="md"
            variant="primary"
            className="font-extrabold px-5 py-3 text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-300/50 rounded-xl"
            onClick={() => setShowAddModal(true)}
          >
            <span>👤+ Add Family Member</span>
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
            <p className="text-xs text-text-secondary">
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
              className="text-xs font-bold text-brand-primary border border-brand-primary/30 px-3 py-1.5 rounded-lg hover:bg-brand-primary/10"
            >
              View Community Dashboard →
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 rounded-2xl bg-surface text-center text-sm text-text-secondary animate-pulse border border-border">
            Loading family wellness records...
          </div>
        ) : familyRecords.length === 0 ? (
          <Card className="p-10 text-center bg-surface border border-dashed border-border/80 rounded-2xl max-w-xl mx-auto my-6 shadow-sm">
            <div className="text-5xl mb-3">🏡 👨‍👩‍👧</div>
            <h3 className="font-display font-bold text-lg text-text-primary">No Members in Family #{familyCode} Yet</h3>
            <p className="text-xs text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
              You created a fresh family group! Get started by adding yourself or a loved one using the personal health form below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button
                variant="primary"
                className="font-bold px-6 py-3 text-sm shadow-md"
                onClick={() => setShowAddModal(true)}
              >
                ✚ Add Family Member & Checkup
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
              const dateStr = ass?.assessed_at || pat.created_at;

              return (
                <Card
                  key={pat.id}
                  onClick={() => navigate(`/patient/${targetId}/constellation`)}
                  className="p-6 bg-surface hover:bg-surface-elevated border border-border transition-all cursor-pointer group rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 bg-surface-elevated px-2 py-1 rounded text-xs font-mono font-bold text-text-secondary border border-border/60">
                        <span>🏷️ {pat.relationship || "Family Member"}</span>
                      </span>
                      <span className={classNames(
                        "px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase border shadow-sm",
                        band === "critical" || band === "high"
                          ? "bg-red-500/15 text-red-500 border-red-500/30"
                          : band === "moderate"
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                      )}>
                        {band === "low" ? "SAFE & STABLE" : bandLabel(band)}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                      <span className="text-brand-primary">👤</span>
                      <span>{pat.full_name || "Personal Checkup"}</span>
                    </h4>
                    <div className="text-xs font-mono text-text-muted mt-0.5">
                      Age: {pat.age}y · Sex: {pat.sex} · ID: {pat.id.substring(0, 8)}
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-surface-muted/60 border border-border/50 text-xs">
                      <div className="font-bold text-text-primary text-[11px] uppercase tracking-wider mb-1">
                        💡 Health Advice:
                      </div>
                      <div className="text-text-secondary line-clamp-2 leading-relaxed font-normal">
                        {ass?.decision?.rationale || "All core vital checkups completely stable. Maintain active exercises and nutritious daily routine."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-brand-primary font-extrabold group-hover:translate-x-1 transition-transform">
                    <span>View Layman Health Report</span>
                    <span>→</span>
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
          <p className="text-sm text-text-secondary mt-1">
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
                className="rounded-2xl p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-surface-elevated border border-border/60 shadow-inner">
                        {guide.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-base text-text-primary tracking-tight">
                          {guide.title}
                        </h3>
                        <span className={classNames("inline-block mt-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded border", guide.statusColor)}>
                          ✓ {guide.simpleStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary mt-4 leading-relaxed font-normal">
                    {guide.laymanExplanation}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="text-[11px] font-bold uppercase text-brand-primary tracking-wider mb-1 flex items-center gap-1.5">
                    <span>🌱</span> Daily Family Wellness Tip:
                  </div>
                  <p className="text-xs text-text-primary font-medium leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border/40">
                    {guide.dailyAdvice}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* 6th Card: Ask Sahayak Coach Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-brand-primary via-[#0F362C] to-[#0A261E] text-white shadow-lg flex flex-col justify-between border border-brand-primary/40">
            <div>
              <span className="text-3xl block mb-3">💬 💡</span>
              <h3 className="font-display font-bold text-lg text-white">
                Have questions about a symptom?
              </h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                Whenever you feel unusual fatigue, fever, or breathlessness, simply use Sahayak's built-in voice recorder during a checkup. Our smart AI will explain what is happening in English, Hindi, or Gujarati without confusing hospital vocabulary!
              </p>
            </div>

            <Button
              size="sm"
              variant="subtle"
              className="mt-6 w-full font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 py-2.5 rounded-xl"
              onClick={() => navigate("/patient/intake")}
            >
              🗣️ Try Voice Symptom Check Now →
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Health Pledge & Support */}
      <Card className="p-6 bg-surface-muted rounded-2xl border border-border text-center text-xs text-text-secondary">
        <p className="font-medium text-text-primary">
          🛡️ <strong>Sahayak Commitment to Ordinary Citizens:</strong> We believe healthcare advice should be as familiar as speaking with a supportive neighbor or family doctor. Zero complicated jargon, zero AI hallucinations.
        </p>
      </Card>

      {/* MODAL: Join Existing Family */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                  <span>🔗</span> Join Existing Family Group
                </h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-text-secondary hover:text-text-primary text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleJoinFamilySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    ENTER 4-DIGIT FAMILY CODE
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 7392"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full font-mono text-center text-2xl tracking-widest px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                  <p className="text-xs text-text-secondary mt-1.5 leading-normal">
                    Tip: Use demo family code <strong>7392</strong> to view Rajesh, Sunita, and Ananya Patel's sample profiles!
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowJoinModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" className="font-bold px-6 py-2.5">
                    Switch Family View
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add Family Member & Checkup */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-surface rounded-3xl border border-border p-7 max-w-lg w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
                    Family #{familyCode} Intake
                  </span>
                  <h3 className="font-display font-bold text-xl text-text-primary mt-1">
                    Add Family Member & Vitals
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-secondary hover:text-text-primary text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Patel"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">
                      Relationship in Household
                    </label>
                    <select
                      value={formRelation}
                      onChange={(e) => setFormRelation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary font-medium"
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
                    <label className="block text-xs font-bold text-text-primary mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formAge}
                      onChange={(e) => setFormAge(Number(e.target.value))}
                      className="w-full font-mono px-3 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Gender
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormSex("M")}
                      className={classNames(
                        "flex-1 py-2 rounded-xl font-semibold border text-center transition-all",
                        formSex === "M"
                          ? "bg-brand-primary text-white border-brand-primary shadow-md"
                          : "bg-surface-elevated text-text-secondary border-border hover:bg-surface-muted"
                      )}
                    >
                      Male (M)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSex("F")}
                      className={classNames(
                        "flex-1 py-2 rounded-xl font-semibold border text-center transition-all",
                        formSex === "F"
                          ? "bg-brand-primary text-white border-brand-primary shadow-md"
                          : "bg-surface-elevated text-text-secondary border-border hover:bg-surface-muted"
                      )}
                    >
                      Female (F)
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    💓 Current Blood Pressure Status (Simple Check)
                  </label>
                  <div className="space-y-2">
                    {[
                      { val: "normal", label: "Normal & Calm (approx 115/75 mmHg)" },
                      { val: "mild", label: "Slightly High / Mild Tension (~136/88 mmHg)" },
                      { val: "high", label: "Elevated / Needs Doctor Advice (~158/98 mmHg)" },
                    ].map((opt) => (
                      <label key={opt.val} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-elevated border border-border/60 cursor-pointer hover:border-brand-primary/40">
                        <input
                          type="radio"
                          name="bp"
                          checked={formBP === opt.val}
                          onChange={() => setFormBP(opt.val as any)}
                          className="text-brand-primary focus:ring-brand-primary w-4 h-4"
                        />
                        <span className="text-xs font-medium text-text-primary">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    🩸 Blood Sugar Status
                  </label>
                  <select
                    value={formSugar}
                    onChange={(e) => setFormSugar(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:border-brand-primary text-xs font-medium"
                  >
                    <option value="normal">Normal Energy & Sugar (Fasting &lt; 100 mg/dL)</option>
                    <option value="high">Elevated / Diabetic Concern (&gt; 140 mg/dL)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFast}
                      onChange={(e) => setFormFast(e.target.checked)}
                      className="mt-0.5 text-red-600 focus:ring-red-500 w-4 h-4 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-red-400">
                        ⚠️ Sudden Symptoms (FAST Alert)
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5">
                        Check ONLY if this family member currently has sudden facial sagging, slurred speech, or numb arms.
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                    className="font-extrabold px-6 py-3 text-sm shadow-md"
                  >
                    {isSubmitting ? "Saving Checkup..." : "💾 Save Member Checkup"}
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
