import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useLang } from "../../context/LanguageContext";
import {
  SahayakLogo,
  IconUser,
  IconDoctor,
  IconHeart,
  IconDiabetes,
  IconBP,
  IconKidney,
  IconBrain,
  IconMic,
  IconShield,
  IconClipboard,
  IconHospital,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconHomeWellness,
} from "../../components/ui/SahayakIcons";

export function LandingHomePage() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-12 pb-16 text-left"
    >
      {/* Hero Showcase Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0E2034] via-[#122A44] to-[#0A1A2B] border border-[#1F3752] p-8 md:p-14 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 mb-6 shadow-sm">
            <SahayakLogo size={18} className="shrink-0" />
            <span>HYBRID DETERMINISTIC TRIAGE ENGINE & COMMUNITY HEALTH PORTAL</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Next-Generation Healthcare Early Prediction & Triage System
          </h1>

          <p className="mt-5 text-slate-300 text-base md:text-lg leading-relaxed font-normal font-sans">
            Sahayak bridges the diagnostic gap between rural communities and specialized hospital care. Powered by a high-precision hybrid prediction engine, we combine WHO clinical vital rules with a Duration-Weighted Master Symptom Taxonomy to deliver hospital-grade health evaluations, intelligent gap analysis, and concrete test timelines without AI hallucination.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="px-7 py-4 font-bold text-base shadow-lg shadow-brand-primary/40 hover:scale-105 transition-all flex items-center gap-2 rounded-2xl"
              onClick={() => navigate("/personal-health")}
            >
              <IconUser size={20} className="text-current shrink-0" />
              <span>Personal Health Portal</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="subtle"
              className="px-6 py-4 font-bold text-base bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-2 rounded-2xl"
              onClick={() => navigate("/family-health")}
            >
              <IconHomeWellness size={20} className="text-current shrink-0" />
              <span>Family Group Portal</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="subtle"
              className="px-6 py-4 font-bold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center gap-2 rounded-2xl"
              onClick={() => navigate("/dashboard")}
            >
              <IconDoctor size={20} className="text-current shrink-0" />
              <span>Clinical Registry</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-5 text-xs md:text-sm font-sans">
            <div>
              <span className="font-extrabold text-cyan-400 text-lg md:text-2xl font-mono block">5 Core Models</span>
              <span className="text-slate-300 font-medium text-xs">Diabetes, BP, CVD, CKD, Stroke</span>
            </div>
            <div>
              <span className="font-extrabold text-emerald-400 text-lg md:text-2xl font-mono block">100% Isolated</span>
              <span className="text-slate-300 font-medium text-xs">Zero Cross-Condition Leakage</span>
            </div>
            <div>
              <span className="font-extrabold text-amber-400 text-lg md:text-2xl font-mono block">DWSCS Engine</span>
              <span className="text-slate-300 font-medium text-xs">Duration-Weighted Pattern Score</span>
            </div>
            <div>
              <span className="font-extrabold text-purple-400 text-lg md:text-2xl font-mono block">3 Languages</span>
              <span className="text-slate-300 font-medium text-xs">English, Hindi & Gujarati Voice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual/Triple Portal Gateways */}
      <div className="pt-2">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/30">
            TAILORED USER EXPERIENCES
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-black text-text-primary mt-3">
            Choose Your Specialized Gateway Portal
          </h2>
          <p className="text-text-secondary text-sm md:text-base mt-2">
            Sahayak adapts its screening workflow seamlessly between private individuals, households, and clinical hospital staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Gateway 1: Personal Health Portal */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface p-7 border border-border hover:border-brand-primary shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/personal-health")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3.5 rounded-2xl bg-brand-primary/15 text-brand-primary border border-brand-primary/30 shadow-inner flex items-center gap-2">
                  <IconUser size={26} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30 uppercase">
                  INDIVIDUAL SELF-CHECK
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-text-primary group-hover:text-brand-primary transition-colors">
                Personal Health Portal
              </h3>
              <p className="text-xs md:text-sm text-text-secondary mt-2.5 leading-relaxed font-sans">
                Designed for private individual self-screening. Check your personal symptoms in simple everyday language, view your risk indicators in real time, and save individual evaluations to a dedicated personal dashboard without requiring family relationship dropdowns or household group codes.
              </p>

              <div className="mt-6 space-y-2.5 pt-5 border-t border-border">
                <div className="flex items-start gap-2.5 text-xs text-text-primary font-semibold font-sans">
                  <span className="p-1 rounded bg-brand-primary/20 text-brand-primary mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Standalone Dashboard:</strong> Dedicated view for individual patient checkups.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text-primary font-semibold font-sans">
                  <span className="p-1 rounded bg-brand-primary/20 text-brand-primary mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Master Symptom Screening:</strong> Plain-language check with intelligent duration selection.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="md" variant="primary" className="w-full font-bold text-sm py-3.5 flex items-center justify-center gap-2 rounded-2xl shadow-md group-hover:shadow-lg transition-all">
                <span>Open Personal Portal</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>

          {/* Gateway 2: Family Health Portal */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#0C211C] via-[#102C25] to-[#0A1A16] text-white p-7 border border-[#1C4B3E] hover:border-emerald-400 shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/family-health")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner flex items-center gap-2">
                  <IconHomeWellness size={26} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  HOUSEHOLD GROUP
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Family Health Portal
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                Connect your entire household under a shared 4-digit family group code. Log health evaluations for parents, children, and spouses while organizing records by explicit family relationships (Father, Mother, Son, Daughter).
              </p>

              <div className="mt-6 space-y-2.5 pt-5 border-t border-emerald-800/60">
                <div className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Shared Group Room:</strong> Switch or create household codes securely.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Relationship Tags & Filters:</strong> Complete health overview for every household member.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="md" variant="subtle" className="w-full font-bold text-sm py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 rounded-2xl shadow-md transition-all">
                <span>Open Family Group Portal</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>

          {/* Gateway 3: Clinical & Health Worker Registry */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#0C1726] via-[#102035] to-[#0A1420] text-white p-7 border border-[#203754] hover:border-cyan-500 shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/dashboard")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner flex items-center gap-2">
                  <IconDoctor size={26} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  CLINICAL HOSPITAL STAFF
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                Clinical Worker Registry
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                Built for city specialists, village doctors, and hospital nurses. When hospital staff perform patient intake, redundant subjective symptom questionnaires automatically disappear—streamlining directly into objective medical history and diagnostic labs.
              </p>

              <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-800">
                <div className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Adaptive Staff Workflow:</strong> Skips subjective questions to accelerate clinical triage.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 mt-0.5"><IconCheck size={13} /></span>
                  <span><strong>Automated Referral Letters:</strong> Instantly drafts formal doctor specialty hand-off summaries.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="md" variant="subtle" className="w-full font-bold text-sm py-3.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center gap-2 rounded-2xl shadow-md transition-all">
                <span>Open Clinical Registry</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NEW SECTION: How the Prediction System Works — Architecture & Engine Overview */}
      <div className="pt-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0D1826] via-[#112032] to-[#0A121D] border border-[#203652] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30 mb-4 shadow-sm">
              <IconBrain size={16} className="shrink-0 animate-pulse" />
              <span>EARLY PREDICTION SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white tracking-tight">
              How the Sahayak Hybrid Prediction Engine Works
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-3 leading-relaxed font-sans font-normal">
              To achieve hospital-grade accuracy in remote and community settings without relying on hallucination-prone LLMs, Sahayak executes a strict 4-stage hybrid deterministic evaluation pipeline. Here is exactly how our early prediction engine analyzes vital data and predicts outcomes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="bg-[#15273C]/80 p-6 rounded-2xl border border-cyan-500/30 shadow-md hover:border-cyan-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-lg shrink-0">
                      01
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Master Symptom Taxonomy
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    Input Stage
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  Every patient symptom is asked exactly once in plain, humanized language without tedious disease repetition. Each affirmative symptom displays an intuitive duration selector (<span className="text-cyan-300 font-medium">Started today · Last few days · 1–4 weeks · 1–3 months · &gt;3 months · Comes & goes</span>). Multiple condition models intelligently feed from a single unified questionnaire answer bank.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold">
                <span>SINGLE-SOURCE QUESTION BANK</span>
                <span>DURATION TRACKED</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#15273C]/80 p-6 rounded-2xl border border-emerald-500/30 shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-lg shrink-0">
                      02
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Cross-Condition Isolation Guarantee
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Firewall Stage
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  A mathematical structural firewall prevents diagnostic contamination between disease models. Symptoms specific to Condition B (such as peripheral numbness in Diabetes) can <strong className="text-emerald-300">never</strong> leak into or artificially elevate Condition A (such as Hypertension or Stroke). Every disease score is evaluated in strict isolation against a verified clinical allowlist.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-emerald-300 font-bold">
                <span>STRUCTURAL FIREWALL</span>
                <span>ZERO SYMPTOM LEAKAGE</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#15273C]/80 p-6 rounded-2xl border border-purple-500/30 shadow-md hover:border-purple-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-mono font-black text-lg shrink-0">
                      03
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Duration-Weighted Symptom Scoring (DWSCS)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-md border border-purple-500/20">
                    Fallback Stage
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  When lab tests or clinical vitals are unavailable in remote villages, our engine activates the Duration-Weighted Symptom Cluster Score (DWSCS). Primary indicators (weight ≥2.0) lasting over a month receive progressive duration multipliers (up to <span className="text-purple-300 font-bold">1.25×</span>), while acute same-day reports remain at baseline. Vital ceiling rules ensure subjective symptoms alone cannot cause false-emergency alarms.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                <span>TRANSPARENT HEURISTIC</span>
                <span>VITAL CEILING RULES</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#15273C]/80 p-6 rounded-2xl border border-amber-500/30 shadow-md hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-black text-lg shrink-0">
                      04
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Deterministic Triage & Lab Gap Engine
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20">
                    Output Stage
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  Our decision engine collapses granular scores into 4 clear user-facing action tiers (<span className="text-emerald-300 font-medium">All Clear</span>, <span className="text-amber-300 font-medium">Needs Attention</span>, <span className="text-orange-300 font-medium">48 Hours</span>, or <span className="text-rose-400 font-bold animate-pulse">Immediate</span>). Each alert enforces mandatory concrete testing deadlines and recommends specific laboratory investigations tailored exclusively to the diagnosed disease condition.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                <span>CONCRETE DEADLINES</span>
                <span>DISEASE-SPECIFIC LABS</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#0B1522] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-300">
                <strong className="text-white">Validation Guarantee:</strong> Evaluated across all 5 disease conditions with automated regression test checkpoints ensuring zero cross-condition leakage.
              </span>
            </div>
            <Button
              size="sm"
              variant="subtle"
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold px-4 py-2 shrink-0 rounded-xl"
              onClick={() => navigate("/patient/intake")}
            >
              Test Prediction Engine Now
            </Button>
          </div>
        </div>
      </div>

      {/* Why Sahayak Section */}
      <div className="pt-8">
        <h2 className="font-display text-2xl md:text-4xl font-black text-text-primary text-center mb-10">
          How Sahayak Protects Community & Family Health
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <Card className="p-7 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left rounded-3xl">
            <div className="w-13 h-13 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-5 border border-brand-primary/30 p-3">
              <IconMic size={28} />
            </div>
            <h4 className="font-display font-bold text-xl text-text-primary">
              Voice & Audio Symptom Intake
            </h4>
            <p className="text-xs md:text-sm text-text-secondary mt-2.5 leading-relaxed font-sans font-normal">
              Not comfortable reading or writing complex symptoms? Simply tap the microphone and explain how you feel in English, Hindi, or Gujarati. Sahayak automatically translates, transcribes, and maps your spoken expressions directly into verified symptom factors.
            </p>
          </Card>

          <Card className="p-7 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left rounded-3xl">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/30 p-3">
              <IconShield size={28} />
            </div>
            <h4 className="font-display font-bold text-xl text-text-primary">
              Verified Medical Health Rules
            </h4>
            <p className="text-xs md:text-sm text-text-secondary mt-2.5 leading-relaxed font-sans font-normal">
              We never let AI guess or invent numerical health scores. Every single risk alert is calculated using tested World Health Organization, JNC 8, and KDIGO clinical guidelines with non-negotiable concrete testing deadlines.
            </p>
          </Card>

          <Card className="p-7 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left rounded-3xl">
            <div className="w-13 h-13 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-5 border border-purple-500/30 p-3">
              <IconClipboard size={28} />
            </div>
            <h4 className="font-display font-bold text-xl text-text-primary">
              Prepared Hospital Doctor Letters
            </h4>
            <p className="text-xs md:text-sm text-text-secondary mt-2.5 leading-relaxed font-sans font-normal">
              If a checkup shows you need to visit a city specialist or hospital, Sahayak instantly drafts an official medical letter summarizing your vital numbers, DWSCS symptom patterns, and required lab investigations, so receiving hospital doctors can initiate treatment immediately.
            </p>
          </Card>
        </div>
      </div>

      {/* Educational Clinical Guide & Transparency Section */}
      <div className="pt-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-extrabold font-mono">
                CLINICAL TRANSPARENCY & BENCHMARK GUIDE
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-4xl font-black text-white tracking-tight">
              Validated Medical Benchmarks Underneath the Hood
            </h3>
            <p className="text-sm md:text-base text-emerald-100/90 mt-3 leading-relaxed font-normal font-sans">
              Unlike general chat assistants that guess outcomes, Sahayak relies entirely on internationally recognized, peer-reviewed medical standards to assign objective health scores and triage urgency. Here is exactly where your diagnostic scores originate:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <div className="bg-[#1A3630]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-3 text-base font-bold text-white mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconHeart size={22} />
                  </div>
                  <span>Heart & Blood Flow (CVD)</span>
                </div>
                <p className="text-xs md:text-sm text-emerald-100 font-normal leading-relaxed font-sans">
                  Calculated using <strong>WHO / ISH SEAR-B Charts</strong> calibrated specially for South-East Asian communities. It combines age, systolic blood pressure, biological sex, smoking habits, and diabetic status into an exact 10-year cardiovascular risk percentage.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 font-bold">
                BENCHMARK: WHO/ISH SEAR-B CHARTS
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-3 text-base font-bold text-white mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconDiabetes size={22} />
                  </div>
                  <span>Blood Sugar Balance (Diabetes)</span>
                </div>
                <p className="text-xs md:text-sm text-emerald-100 font-normal leading-relaxed font-sans">
                  Evaluated using the verified <strong>IDRS (Indian Diabetes Risk Score)</strong> standard. Computes screening alerts by analyzing age group, conservative waist measurements, physical exercise activity routines, and direct parental/sibling diabetic history.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 font-bold">
                BENCHMARK: INDIAN DIABETES RISK SCORE (IDRS)
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-3 text-base font-bold text-white mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconBP size={22} />
                  </div>
                  <span>Blood Pressure (Hypertension)</span>
                </div>
                <p className="text-xs md:text-sm text-emerald-100 font-normal leading-relaxed font-sans">
                  Staged strictly according to <strong>JNC 8 Medical Guidelines</strong>. Automatically evaluates systolic and diastolic blood pressure readings against clear diagnostic thresholds: Normal (&lt;120/80), Elevated, Stage 1, Stage 2, and emergency Hypertensive Crisis.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 font-bold">
                BENCHMARK: JNC 8 SCREENING RULES
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-3 text-base font-bold text-white mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconKidney size={22} />
                  </div>
                  <span>Kidney Filtration Health (CKD)</span>
                </div>
                <p className="text-xs md:text-sm text-emerald-100 font-normal leading-relaxed font-sans">
                  Utilizes the modern race-free <strong>CKD-EPI 2021 Creatinine Equation</strong>. Mathematically computes your estimated Glomerular Filtration Rate (eGFR) using lab values, age, and sex factors to detect early changes in how smoothly kidneys filter daily waste.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 font-bold">
                BENCHMARK: KDIGO / CKD-EPI 2021
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-6 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-2 hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-3 text-base font-bold text-white mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconBrain size={22} />
                  </div>
                  <span>Brain & Stroke Alert (Cerebrovascular Triage)</span>
                </div>
                <p className="text-xs md:text-sm text-emerald-100 font-normal leading-relaxed font-sans">
                  Combines a rigorous dual-layer triage safeguard: (1) The acute <strong>FAST Protocol</strong> screening for emergency physical signs like sudden facial drooping, arm weakness, or speech difficulty, combined with (2) The clinical <strong>ABCD² Risk Staging</strong> model (Age, Blood Pressure, Clinical features, Duration, and Diabetes) to evaluate preventive steps before vascular emergencies occur.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between text-[11px] font-mono text-emerald-300 font-bold gap-2">
                <span>BENCHMARK: FAST PROTOCOL & ABCD² MODEL</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  AUTOMATICALLY INTEGRATED IN EVERY HEALTH CHECKUP
                </span>
              </div>
            </div>
          </div>

          {/* Explanation of the 4 Simplified Precision Urgency Tiers */}
          <div className="mt-10 pt-8 border-t border-emerald-500/30 relative z-10">
            <h4 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2.5">
              <IconSparkles size={22} className="text-emerald-400" />
              <span>Understanding the 4 Precision Urgency Tiers & Deadlines</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#16332D]/90 p-5 rounded-2xl border border-emerald-500/40 shadow-sm">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 mb-3">
                  ALL CLEAR (ROUTINE)
                </span>
                <p className="text-xs text-emerald-100 font-normal leading-relaxed font-sans">
                  All checkup scores and symptom patterns are healthy and within safe baseline limits. No immediate doctor consultation or diagnostic tests are required today; maintain daily nutritional balance and healthy movement habits.
                </p>
              </div>
              <div className="bg-[#2A2312]/90 p-5 rounded-2xl border border-amber-500/50 shadow-sm">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-amber-500/20 text-amber-200 border border-amber-400/50 mb-3">
                  NEEDS ATTENTION (MONITOR)
                </span>
                <p className="text-xs text-amber-100 font-normal leading-relaxed font-sans">
                  Moderate elevations in blood pressure, kidney, or sugar scores detected. We advise specific dietary modifications and recommend completing follow-up diagnostic lab screenings within <strong className="text-amber-200">2–4 weeks</strong>.
                </p>
              </div>
              <div className="bg-[#331C14]/90 p-5 rounded-2xl border border-orange-500/50 shadow-sm">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold font-mono uppercase bg-orange-500/20 text-orange-200 border border-orange-400/50 mb-3">
                  48 HOURS (URGENT CARE)
                </span>
                <p className="text-xs text-orange-100 font-normal leading-relaxed font-sans">
                  A prominent symptom or reading warrants priority clinical attention. A general specialist or doctor visit is strongly recommended within <strong className="text-orange-200">3 days (48–72 hours)</strong> along with rest, diagnostic profiling, and symptom logging.
                </p>
              </div>
              <div className="bg-[#361218]/95 p-5 rounded-2xl border border-rose-500/60 shadow-md">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black font-mono uppercase bg-rose-500/25 text-rose-200 border border-rose-400/60 mb-3 animate-pulse">
                  IMMEDIATE (EMERGENCY)
                </span>
                <p className="text-xs text-rose-100 font-normal leading-relaxed font-sans">
                  Acute emergency markers detected (such as stroke FAST indicators or severe glucose crisis). Call emergency hospital services or go to an emergency room <strong className="text-rose-200 underline decoration-rose-400 decoration-2">immediately (Deadline: now)</strong> with your Sahayak report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Banner */}
      <Card className="p-8 md:p-10 bg-gradient-to-r from-brand-primary/15 via-surface-elevated to-surface border border-brand-primary/40 rounded-3xl text-left shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-primary">
            Ready to experience next-generation community triage?
          </h3>
          <p className="text-sm text-text-secondary mt-2 font-sans font-normal max-w-2xl leading-relaxed">
            No mandatory registration or waitlists required. Run an interactive symptom check and receive deterministic, hospital-accurate health guidance with concrete testing deadlines in just 3 minutes.
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          className="shrink-0 font-bold px-9 py-5 text-base shadow-lg shadow-brand-primary/30 hover:scale-105 transition-all flex items-center gap-2 rounded-2xl"
          onClick={() => navigate("/patient/intake")}
        >
          <IconClipboard size={22} className="text-current shrink-0" />
          <span>Start Health Checkup</span>
          <IconArrowRight size={20} className="text-current shrink-0" />
        </Button>
      </Card>
    </motion.div>
  );
}

