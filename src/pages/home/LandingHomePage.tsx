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
      className="max-w-7xl mx-auto space-y-10 pb-12 text-left"
    >
      {/* Hero Showcase Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0E2034] via-[#122A44] to-[#0A1A2B] border border-[#1F3752] p-8 md:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 mb-5 shadow-sm">
            <SahayakLogo size={18} className="shrink-0" />
            <span>WELCOME TO SAHAYAK HEALTH · YOUR SMART COMMUNITY GUIDE</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Smart & Friendly Healthcare Support for Your Family & Village
          </h1>
          
          <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed font-normal font-sans">
            Sahayak combines trusted medical health check rules with helpful AI explanations so anyone can understand their heart, blood sugar, and general wellness without confusing hospital terminology.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="px-7 py-4 font-bold text-base shadow-lg shadow-brand-primary/40 hover:scale-105 transition-all flex items-center gap-2"
              onClick={() => navigate("/personal-health")}
            >
              <IconUser size={20} className="text-current shrink-0" />
              <span>Personal Health Portal</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="subtle"
              className="px-6 py-4 font-bold text-base bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-2"
              onClick={() => navigate("/family-health")}
            >
              <IconHomeWellness size={20} className="text-current shrink-0" />
              <span>Family Group Portal</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="subtle"
              className="px-6 py-4 font-bold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <IconDoctor size={20} className="text-current shrink-0" />
              <span>Clinical Registry</span>
              <IconArrowRight size={18} className="text-current shrink-0" />
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs md:text-sm font-sans">
            <div>
              <span className="font-extrabold text-cyan-400 text-lg md:text-2xl font-mono block">5 Core</span>
              <span className="text-slate-400 font-medium">Vital Health Checks</span>
            </div>
            <div>
              <span className="font-extrabold text-emerald-400 text-lg md:text-2xl font-mono block">3 Languages</span>
              <span className="text-slate-400 font-medium">English, Hindi & Gujarati</span>
            </div>
            <div>
              <span className="font-extrabold text-amber-400 text-lg md:text-2xl font-mono block">100% Reliable</span>
              <span className="text-slate-400 font-medium">Verified Medical Rule Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Portal Gateways */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            Choose Your Gateway Portal
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            Sahayak provides dedicated experiences tailored for ordinary citizens and community healthcare providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gateway 1: Personal Health Portal */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface p-7 border border-border hover:border-brand-primary shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/personal-health")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3 rounded-2xl bg-brand-primary/15 text-brand-primary border border-brand-primary/30 shadow-inner flex items-center gap-2">
                  <IconUser size={24} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30 uppercase">
                  INDIVIDUAL SELF-CHECK
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-text-primary group-hover:text-brand-primary transition-colors">
                Personal Health Portal
              </h3>
              <p className="text-xs md:text-sm text-text-secondary mt-2.5 leading-relaxed font-sans">
                Designed for private individual self-screening. Check your personal symptoms in simple everyday language and receive immediate diagnostic guidance without requiring family relationship codes.
              </p>

              <div className="mt-5 space-y-2 pt-5 border-t border-border">
                <div className="flex items-center gap-2.5 text-xs text-text-primary font-semibold font-sans">
                  <span className="p-1 rounded bg-brand-primary/20 text-brand-primary"><IconCheck size={13} /></span>
                  <span><strong>Standalone Log:</strong> No relationship dropdowns or codes needed.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-primary font-semibold font-sans">
                  <span className="p-1 rounded bg-brand-primary/20 text-brand-primary"><IconCheck size={13} /></span>
                  <span><strong>Master Symptom Screening:</strong> Answer plain-language checks with duration timelines.</span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button size="md" variant="primary" className="w-full font-bold text-sm py-3 flex items-center justify-center gap-2 rounded-xl">
                <span>Open Personal Portal</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>

          {/* Gateway 2: Family Health Portal */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#0C211C] via-[#102C25] to-[#0A1A16] text-white p-7 border border-[#1C4B3E] hover:border-emerald-400 shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/family-health")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner flex items-center gap-2">
                  <IconHomeWellness size={24} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  HOUSEHOLD GROUP
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Family Health Portal
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                Connect your entire household under a single 4-digit family group code. Log health evaluations for parents, children, and spouses while keeping records securely organized together.
              </p>

              <div className="mt-5 space-y-2 pt-5 border-t border-emerald-800/60">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400"><IconCheck size={13} /></span>
                  <span><strong>Shared Group Code:</strong> Seamlessly switch or create household rooms.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400"><IconCheck size={13} /></span>
                  <span><strong>Relationship Tags:</strong> Keep track of loved ones (Father, Mother, Child).</span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button size="md" variant="subtle" className="w-full font-bold text-sm py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 rounded-xl">
                <span>Open Family Group Portal</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>

          {/* Gateway 3: Clinical & Health Worker Registry */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#0C1726] via-[#102035] to-[#0A1420] text-white p-7 border border-[#203754] hover:border-cyan-500 shadow-xl hover:shadow-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left transition-all"
            onClick={() => navigate("/dashboard")}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner flex items-center gap-2">
                  <IconDoctor size={24} />
                </div>
                <span className="text-[10px] font-extrabold font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  DOCTORS & NURSES
                </span>
              </div>

              <h3 className="font-display text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                Clinical Health Worker Registry
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                Built for village doctors and community health workers. Manage patient registries, perform clinical triage evaluations, and generate formal specialist hospital transfer letters.
              </p>

              <div className="mt-5 space-y-2 pt-5 border-t border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-400"><IconCheck size={13} /></span>
                  <span><strong>Clinical Roster:</strong> Comprehensive table of community screenings.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold font-sans">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-400"><IconCheck size={13} /></span>
                  <span><strong>Automated Doctor Letters:</strong> Formal specialist referral summary reports.</span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button size="md" variant="subtle" className="w-full font-bold text-sm py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center gap-2 rounded-xl">
                <span>Open Clinical Registry</span>
                <IconArrowRight size={16} className="text-current" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why Sahayak Section */}
      <div className="pt-6">
        <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-8">
          How Sahayak Protects Community & Family Health
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-4 border border-brand-primary/30">
              <IconMic size={26} />
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Voice & Audio Symptom Intake
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed font-sans font-medium">
              Not comfortable reading or writing complex symptoms? Simply tap the microphone and explain how you feel in English, Hindi, or Gujarati. Sahayak automatically understands and maps your expressions.
            </p>
          </Card>

          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/30">
              <IconShield size={26} />
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Verified Medical Health Rules
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed font-sans font-medium">
              We never let AI guess or invent numerical health scores. Every single risk alert is calculated using tested World Health Organization community check guidelines with non-negotiable test deadlines.
            </p>
          </Card>

          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-4 border border-purple-500/30">
              <IconClipboard size={26} />
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Prepared Hospital Doctor Letters
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed font-sans font-medium">
              If a checkup shows you need to visit a city specialist or hospital, Sahayak instantly drafts an official medical letter summarizing your symptoms and test deadlines, so the receiving doctor immediately knows how to help.
            </p>
          </Card>
        </div>
      </div>

      {/* Educational Clinical Guide & Transparency Section */}
      <div className="pt-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#122420] via-[#162D28] to-[#10201D] border border-[#265349] p-8 shadow-2xl text-white relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-extrabold font-mono">
                CLINICAL TRANSPARENCY & LEARNING GUIDE
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
              How Your Health Scores Are Calculated in the Risk Constellation
            </h3>
            <p className="text-sm text-emerald-100/90 mt-2 leading-relaxed font-normal font-sans">
              Unlike ordinary general chat tools, Sahayak relies entirely on validated international medical formulas and peer-reviewed guidelines to assign health check scores and urgency levels. Here is exactly where your diagnostic scores come from:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconHeart size={22} />
                  </div>
                  <span>Heart & Blood Flow (CVD)</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed font-sans">
                  Calculated using <strong>WHO / ISH SEAR-B Charts</strong> calibrated specially for South-East Asian communities. It combines age, systolic blood pressure, biological sex, smoking habits, and diabetic status into an exact 10-year cardiovascular safety percentage.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                BENCHMARK: WHO/ISH SEAR-B CHARTS
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconDiabetes size={22} />
                  </div>
                  <span>Blood Sugar Balance (Diabetes)</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed font-sans">
                  Evaluated using the verified <strong>IDRS (Indian Diabetes Risk Score)</strong> standard. Computes screening alerts by analyzing age group, conservative waist measurements, physical exercise activity routines, and direct parental/sibling diabetic history.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                BENCHMARK: INDIAN DIABETES RISK SCORE (IDRS)
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconBP size={22} />
                  </div>
                  <span>Blood Pressure (Hypertension)</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed font-sans">
                  Staged strictly according to <strong>JNC 8 Medical Guidelines</strong>. Automatically evaluates systolic and diastolic blood pressure readings against clear diagnostic thresholds: Normal (&lt;120/80), Elevated, Stage 1, Stage 2, and emergency Hypertensive Crisis.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                BENCHMARK: JNC 8 SCREENING RULES
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconKidney size={22} />
                  </div>
                  <span>Kidney Filtration Health (CKD)</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed font-sans">
                  Utilizes the modern <strong>CKD-EPI 2021 Creatinine Equation</strong>. Mathematically computes your estimated Glomerular Filtration Rate (eGFR) using lab values, age, and sex factors to detect even early changes in how smoothly your kidneys filter daily body waste.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                BENCHMARK: KDIGO / CKD-EPI 2021
              </div>
            </div>

            <div className="bg-[#1A3630]/90 p-5 rounded-2xl border border-emerald-400/30 shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#122622] text-emerald-300 border border-emerald-400/30 shrink-0">
                    <IconBrain size={22} />
                  </div>
                  <span>Brain & Stroke Alert (Cerebrovascular Triage)</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed font-sans">
                  Combines a dual-layer triage safeguard: (1) The acute <strong>FAST Protocol</strong> screening for emergency physical signs like sudden facial drooping, arm weakness, or speech difficulty, combined with (2) The clinical <strong>ABCD² Risk Staging</strong> model (Age, Blood Pressure, Clinical features, Duration of symptoms, and Diabetes) to evaluate protective prevention steps before vascular emergencies happen.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-500/20 flex flex-wrap items-center justify-between text-[10px] font-mono text-emerald-300 font-bold gap-2">
                <span>BENCHMARK: FAST PROTOCOL & ABCD² MODEL</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  AUTOMATICALLY INTEGRATED IN EVERY HEALTH CHECKUP
                </span>
              </div>
            </div>
          </div>

          {/* Explanation of the 4 Simplified Precision Urgency Tiers */}
          <div className="mt-8 pt-6 border-t border-emerald-500/30 relative z-10">
            <h4 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
              <IconSparkles size={20} className="text-emerald-400" />
              <span>Understanding the 4 Precision Urgency Tiers & Deadlines</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#16332D]/90 p-4 rounded-xl border border-emerald-400/40 shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 mb-2">
                  ALL CLEAR (ROUTINE)
                </span>
                <p className="text-[11px] text-emerald-100 font-medium leading-relaxed font-sans">
                  All checkup scores are healthy and within safe baseline limits. No immediate doctor consultation or diagnostic tests are required today; maintain daily nutritional balance and movement habits.
                </p>
              </div>
              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-400/40 shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono uppercase bg-amber-500/20 text-amber-200 border border-amber-400/40 mb-2">
                  NEEDS ATTENTION (MONITOR)
                </span>
                <p className="text-[11px] text-amber-100 font-medium leading-relaxed font-sans">
                  Moderate elevations in blood pressure, kidney, or sugar scores detected. We advise specific dietary modifications and recommend completing follow-up diagnostic lab screenings within 2–4 weeks.
                </p>
              </div>
              <div className="bg-orange-950/40 p-4 rounded-xl border border-orange-400/40 shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono uppercase bg-orange-500/20 text-orange-200 border border-orange-400/40 mb-2">
                  48 HOURS (URGENT CARE)
                </span>
                <p className="text-[11px] text-orange-100 font-medium leading-relaxed font-sans">
                  A prominent symptom or reading warrants priority clinical attention. A general specialist or doctor visit is strongly recommended within 3 days (48–72 hours) along with rest and symptom logging.
                </p>
              </div>
              <div className="bg-red-950/60 p-4 rounded-xl border border-red-500/50 shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono uppercase bg-red-500/25 text-red-200 border border-red-400/50 mb-2">
                  IMMEDIATE (EMERGENCY)
                </span>
                <p className="text-[11px] text-red-100 font-medium leading-relaxed font-sans">
                  Acute emergency markers detected (such as stroke FAST indicators or severe chest pain). Call emergency hospital services or go to an emergency center immediately with your Sahayak report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Banner */}
      <Card className="p-8 bg-gradient-to-r from-brand-primary/10 via-surface-elevated to-surface border border-brand-primary/30 rounded-3xl text-left shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl font-bold text-text-primary">
            Ready to perform a conversational health checkup?
          </h3>
          <p className="text-xs text-text-secondary mt-1 font-sans font-medium">
            No registration or appointments needed. Check your vital signs and receive concrete health advice with tested deadlines in just 3 minutes.
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          className="shrink-0 font-bold px-8 py-4 text-base shadow-md flex items-center gap-2"
          onClick={() => navigate("/patient/intake")}
        >
          <IconClipboard size={20} className="text-current shrink-0" />
          <span>Start Free Health Checkup</span>
          <IconArrowRight size={18} className="text-current shrink-0" />
        </Button>
      </Card>
    </motion.div>
  );
}
