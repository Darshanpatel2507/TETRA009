import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useLang } from "../../context/LanguageContext";

export function LandingHomePage() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-10 pb-12"
    >
      {/* Hero Showcase Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0E2034] via-[#122A44] to-[#0A1A2B] border border-[#1F3752] p-8 md:p-12 text-white shadow-2xl overflow-hidden">
        {/* Decorative background lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 mb-5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>WELCOME TO SAHAYAK HEALTH · YOUR SMART COMMUNITY GUIDE</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Smart & Friendly Healthcare Support for Your Family & Village
          </h1>
          
          <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            Sahayak combines trusted medical health check rules with helpful AI explanations so anyone can understand their heart, blood sugar, and general wellness without confusing hospital terminology.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="px-8 py-4 font-bold text-base shadow-lg shadow-brand-primary/40 hover:scale-105 transition-all"
              onClick={() => navigate("/my-health")}
            >
              👤 Open My Personal Health Portal →
            </Button>
            <Button
              size="lg"
              variant="subtle"
              className="px-6 py-4 font-bold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
              onClick={() => navigate("/dashboard")}
            >
              🩺 For Doctors & Health Workers →
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs md:text-sm font-sans">
            <div>
              <span className="font-extrabold text-cyan-400 text-lg md:text-2xl font-mono block">5 Core</span>
              <span className="text-slate-400">Vital Health Checks</span>
            </div>
            <div>
              <span className="font-extrabold text-emerald-400 text-lg md:text-2xl font-mono block">3 Languages</span>
              <span className="text-slate-400">English, Hindi & Gujarati</span>
            </div>
            <div>
              <span className="font-extrabold text-amber-400 text-lg md:text-2xl font-mono block">100% Reliable</span>
              <span className="text-slate-400">Verified Medical Rule Check</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gateway 1: Personal & Family Health Portal */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated p-8 border-2 border-brand-primary/40 shadow-xl hover:shadow-2xl hover:border-brand-primary flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            onClick={() => navigate("/my-health")}
          >
            <div className="absolute top-0 right-0 bg-brand-primary/10 w-48 h-48 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-primary/20 transition-all" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="text-4xl p-3 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 shadow-inner">
                  👤 ❤️
                </span>
                <div className="flex flex-wrap gap-2 text-right">
                  <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    EASY LAYMAN WORDS
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl font-black text-text-primary group-hover:text-brand-primary transition-colors">
                Personal Patient & Family Portal
              </h3>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                Designed specifically for individuals and families. Check your personal health indicators, review your heart and blood sugar safety scores in simple everyday words, and read reassuring health advice without confusing hospital jargon.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-text-primary font-medium">
                  <span className="text-emerald-500 font-bold text-base">✓</span>
                  <span><strong>Simple Vital Explanations:</strong> Clear meanings for blood sugar and heart flow.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-primary font-medium">
                  <span className="text-emerald-500 font-bold text-base">✓</span>
                  <span><strong>Self-Checkup Toolkit:</strong> Start a quick 3-minute checkup anytime.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-primary font-medium">
                  <span className="text-emerald-500 font-bold text-base">✓</span>
                  <span><strong>Friendly Daily Health Coach:</strong> Simple diet, walking, and wellness guidance.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" variant="primary" className="w-full font-extrabold text-base py-4 group-hover:shadow-lg transition-all">
                Enter My Personal Health Dashboard →
              </Button>
            </div>
          </motion.div>

          {/* Gateway 2: Clinical & Health Worker Registry */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#0C1726] via-[#102035] to-[#0A1420] text-white p-8 border-2 border-[#203754] shadow-xl hover:shadow-2xl hover:border-cyan-500 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            onClick={() => navigate("/dashboard")}
          >
            <div className="absolute top-0 right-0 bg-cyan-500/10 w-48 h-48 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="text-4xl p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 shadow-inner text-cyan-300">
                  🩺 🏥
                </span>
                <div className="flex flex-wrap gap-2 text-right">
                  <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    FOR DOCTORS & NURSES
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                Clinical Health Worker Registry
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Built specifically for village doctors, nurses, and community healthcare providers (ASHA workers). Manage complete patient registries, conduct systematic triage checkups, and automatically generate formal hospital transfer referral letters.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                  <span className="text-cyan-400 font-bold text-base">✓</span>
                  <span><strong>Community Patient Roster:</strong> Track everyone assessed in your village or center.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                  <span className="text-cyan-400 font-bold text-base">✓</span>
                  <span><strong>Verified Rule Triage:</strong> Accurate urgency sorting (Low, Moderate, High, Critical).</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                  <span className="text-cyan-400 font-bold text-base">✓</span>
                  <span><strong>Automated Doctor Letters:</strong> Print or copy formal specialist referral summary reports.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" variant="subtle" className="w-full font-extrabold text-base py-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 group-hover:shadow-lg transition-all">
                Open Clinical Registry & Triage →
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
          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 text-brand-primary grid place-items-center text-2xl font-bold mb-4">
              🗣️
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Voice & Audio Symptom Intake
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Not comfortable reading or writing complex symptoms? Simply tap the microphone and explain how you feel in English, Hindi, or Gujarati. Sahayak automatically understands and records your signs.
            </p>
          </Card>

          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 grid place-items-center text-2xl font-bold mb-4">
              🛡️
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Verified Medical Health Rules
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              We never let AI guess or invent numerical health scores. Every single risk alert is calculated using tested World Health Organization community check guidelines, giving you complete safety and reliability.
            </p>
          </Card>

          <Card className="p-6 bg-surface border border-border shadow-md hover:border-brand-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-500 grid place-items-center text-2xl font-bold mb-4">
              📋
            </div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Prepared Hospital Doctor Letters
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              If a checkup shows you need to visit a city specialist or hospital, Sahayak instantly drafts an official medical letter summarizing your symptoms, so the receiving hospital doctor immediately knows how to help.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom Action Banner */}
      <Card className="p-8 bg-gradient-to-r from-brand-primary/10 via-surface-elevated to-surface border border-brand-primary/30 rounded-3xl text-center shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="font-display text-xl font-bold text-text-primary">
            Ready to perform a quick health checkup?
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            No registration or appointments needed. Check your vital signs and get simple health advice in just 3 minutes.
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          className="shrink-0 font-bold px-8 py-4 text-base shadow-md"
          onClick={() => navigate("/patient/intake")}
        >
          ✚ Start Free Health Checkup →
        </Button>
      </Card>
    </motion.div>
  );
}
