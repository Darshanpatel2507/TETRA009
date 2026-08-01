import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { IconMic, IconSparkles, IconCheck, IconInfo } from "../ui/SahayakIcons";
import { SymptomConfirmChip } from "./SymptomConfirmChip";

interface Props {
  onSymptomAdd: (id: string, duration?: string) => void;
  onUnclassifiedAdd: (verbatim: string) => void;
}

interface PendingMatch {
  id: string;
  label: string;
  isEmergency: boolean;
  matchedPhrase: string;
}

const EMERGENCY_IDS = ["face_droop", "arm_weakness", "speech_difficulty", "chest_pain", "shortness_of_breath"];

const TAXONOMY_LABELS: Record<string, string> = {
  face_droop: "Facial Drooping or Numbness (FAST Alert)",
  arm_weakness: "Sudden Arm Weakness or Numbness (FAST Alert)",
  speech_difficulty: "Slurred Speech or Word Difficulty (FAST Alert)",
  chest_pain: "Acute Chest Heaviness or Pain",
  shortness_of_breath: "Sudden Shortness of Breath or Breathing Struggle",
  polyuria: "Frequent Nightly Urination",
  polydipsia: "Unusual Excessive Thirst",
  fatigue: "Persistent Unexplained Fatigue",
  swelling_legs: "Noticeable Ankle or Leg Swelling",
};

export function FreeTextSymptomInput({ onSymptomAdd, onUnclassifiedAdd }: Props) {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [listening, setListening] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<PendingMatch[]>([]);
  const [addedChips, setAddedChips] = useState<Array<{ label: string; tag: string }>>([]);

  // Handle Speech API (Mic)
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported on this browser version. Please type your symptoms below.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognizer = new SpeechRecognition();
    recognizer.lang = "en-IN";
    recognizer.continuous = false;
    recognizer.interimResults = false;

    setListening(true);
    recognizer.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setListening(false);
    };
    recognizer.onerror = () => setListening(false);
    recognizer.onend = () => setListening(false);
    recognizer.start();
  };

  const handleAnalyze = async () => {
    const clean = text.trim();
    if (!clean) return;

    setAnalyzing(true);
    try {
      const apiKey = (import.meta as any).env?.GEMINI_API_KEY || "";
      
      // 1. Try Supabase Edge Function
      let results = [];
      const { data: edgeRes, error } = await supabase.functions.invoke("classify-symptom", {
        body: { description: clean, apiKey }
      });

      if (!error && edgeRes?.results) {
        results = edgeRes.results;
      } else if (apiKey) {
        // 2. Client-side fallback if edge function is unreachable
        const prompt = `Map this patient description to ONLY the symptom IDs in this fixed list: [face_droop, arm_weakness, speech_difficulty, chest_pain, shortness_of_breath, polyuria, polydipsia, fatigue, swelling_legs].
Return matches with a confidence level ('high' or 'low'). If nothing matches confidently, return symptomId 'unclassified' with confidence 'low'. Never infer a diagnosis. Never invent a symptom not implied by the text. Never estimate severity beyond what's stated.
Patient description: "${clean}"
Return ONLY valid JSON: {"results":[{"symptomId":"id or unclassified","confidence":"high or low","matchedPhrase":"words"}]}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
        });
        if (res.ok) {
          const json = await res.json();
          const raw = json.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g, "").trim();
          results = JSON.parse(raw || "{}").results || [];
        }
      }

      if (results.length === 0) {
        // Local keyword fallback
        const lower = clean.toLowerCase();
        if (lower.includes("droop") || lower.includes("face")) results.push({ symptomId: "face_droop", confidence: "high", matchedPhrase: clean });
        else if (lower.includes("chest") || lower.includes("heart pain")) results.push({ symptomId: "chest_pain", confidence: "high", matchedPhrase: clean });
        else if (lower.includes("tired") || lower.includes("fatigue") || lower.includes("weak")) results.push({ symptomId: "fatigue", confidence: "high", matchedPhrase: clean });
        else results.push({ symptomId: "unclassified", confidence: "low", matchedPhrase: clean });
      }

      // 3. Apply safety routing rules
      const newPending: PendingMatch[] = [];
      const newAdded: Array<{ label: string; tag: string }> = [];

      for (const item of results) {
        if (item.symptomId === "unclassified" || item.confidence === "low") {
          const note = `Other — noted for health worker review: "${item.matchedPhrase || clean}"`;
          onUnclassifiedAdd(note);
          newAdded.push({ label: `Logged for clinical review: "${item.matchedPhrase || clean}"`, tag: "Human Review Required" });
        } else if (EMERGENCY_IDS.includes(item.symptomId)) {
          // SAFETY GUARD: Never auto-add acute emergency items! Require explicit user confirmation.
          newPending.push({
            id: item.symptomId,
            label: TAXONOMY_LABELS[item.symptomId] || item.symptomId,
            isEmergency: true,
            matchedPhrase: item.matchedPhrase || clean
          });
        } else {
          // High confidence non-emergency item: auto-add with default "Started today" duration
          onSymptomAdd(item.symptomId, "Started today");
          const lbl = TAXONOMY_LABELS[item.symptomId] || item.symptomId;
          newAdded.push({ label: lbl, tag: "Added to checkup (Started today)" });
        }
      }

      if (newPending.length > 0) {
        setPendingConfirm((prev) => [...prev, ...newPending]);
      }
      if (newAdded.length > 0) {
        setAddedChips((prev) => [...prev, ...newAdded]);
      }
      setText("");
    } catch {
      // Safe fallback on network failure: log verbatim for health worker review
      const fallbackNote = `Other — noted for health worker review: "${clean}"`;
      onUnclassifiedAdd(fallbackNote);
      setAddedChips((prev) => [...prev, { label: `Logged for clinical review: "${clean}"`, tag: "Human Review Required" }]);
      setText("");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#122520] via-[#152E28] to-[#10221E] border border-emerald-400/40 shadow-xl text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
          <IconSparkles size={26} />
        </div>
        <div>
          <h3 className="font-display text-xl font-black text-white tracking-tight">
            Anything else you're feeling today?
          </h3>
          <p className="text-xs text-emerald-100/80 font-medium">
            Describe any aches, discomfort, or bodily habits in your own everyday words — or tap the microphone to speak!
          </p>
        </div>
      </div>

      {/* Input Field + Audio Recorder Toolbar */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={analyzing}
            placeholder="For example: 'My ankles look puffy after standing' or 'Feeling unusually exhausted after lunch...'"
            className="w-full bg-[#0E201C] text-white placeholder-emerald-300/40 rounded-2xl p-4 pr-14 border border-emerald-400/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-sans resize-none shadow-inner"
          />
          <button
            type="button"
            onClick={startListening}
            title={listening ? "Listening to your voice..." : "Tap to speak in everyday words"}
            disabled={analyzing}
            className={`absolute right-3.5 bottom-3.5 p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center border ${
              listening
                ? "bg-red-500 text-white animate-bounce border-red-300 shadow-red-500/40"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300"
            }`}
          >
            <IconMic size={20} className="text-current" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-mono text-emerald-300/80 flex items-center gap-1.5 font-semibold">
            <IconInfo size={14} className="text-emerald-400 shrink-0" />
            Sahayak AI structures your observations without altering diagnostic equations.
          </span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !text.trim()}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 border border-emerald-300 shrink-0 flex items-center gap-2"
          >
            <IconSparkles size={16} className="text-current" />
            Analyze & Add
          </button>
        </div>
      </div>

      {/* Warm, human village-friendly animated indicator while reading */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 rounded-2xl bg-[#16332C]/90 border border-emerald-400/40 flex items-center gap-3 shadow-md"
          >
            <span className="animate-spin text-emerald-400 text-2xl font-black">◎</span>
            <div>
              <p className="text-sm font-extrabold text-emerald-200 animate-pulse font-display">
                Reading what you told us…
              </p>
              <p className="text-xs text-emerald-200/70 font-sans">
                Our smart village assistant is translating your words into our verified health checkup taxonomy.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mandatory Emergency Confirm Chips */}
      {pendingConfirm.length > 0 && (
        <div className="mt-6 space-y-4 pt-4 border-t border-white/10">
          {pendingConfirm.map((pending) => (
            <SymptomConfirmChip
              key={pending.id}
              symptomLabel={pending.label}
              isEmergency={pending.isEmergency}
              matchedPhrase={pending.matchedPhrase}
              onConfirm={() => {
                onSymptomAdd(pending.id, "Started today");
                setPendingConfirm((prev) => prev.filter((p) => p.id !== pending.id));
                setAddedChips((prev) => [...prev, { label: pending.label, tag: "Confirmed by patient (Started today)" }]);
              }}
              onReject={() => {
                setPendingConfirm((prev) => prev.filter((p) => p.id !== pending.id));
              }}
            />
          ))}
        </div>
      )}

      {/* Confirmed & Logged Chips */}
      {addedChips.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <IconCheck size={14} /> Added to Today's Checkup Registry:
          </p>
          <div className="space-y-2">
            {addedChips.map((chip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-xl bg-[#17342C] border border-emerald-400/30 flex items-center justify-between text-xs font-semibold text-white shadow-sm"
              >
                <span className="flex-1 font-sans pr-2 font-extrabold">{chip.label}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase font-black border border-emerald-400/40 shrink-0">
                  {chip.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
