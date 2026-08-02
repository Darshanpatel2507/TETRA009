<div align="center">
  <img src="public/favicon.svg" alt="Sahayak Logo" width="84" height="84" />
  <h1>Sahayak · Early Diagnostic Prediction Engine & Community Triage Companion</h1>
  <p><strong>Bridging the Last-Mile Healthcare Gap with Deterministic Clinical Stratification & Duration-Weighted Symptom Intelligence.</strong></p>

  <p>
    <a href="#-executive-abstract-the-problem--solution">Abstract</a> • 
    <a href="#-why-this-wins-business--clinical-perspective">Why This Wins</a> • 
    <a href="#-system-workflow">System Workflow</a> • 
    <a href="#-architecture-of-the-early-prediction-engine">Engine Architecture</a> • 
    <a href="#-technical-stack--security">Tech Stack</a> • 
    <a href="#-quick-start">Quick Start</a>
  </p>
</div>

---

## 💡 Executive Abstract: The Problem & Solution

### The Global Primary Care Problem
Over **70% of chronic disease emergencies** (diabetology, stroke, renal failure, hypertensive crisis) occur in semi-urban and rural communities due to **delayed early intervention**. Typical modern health apps fail in these environments for three core reasons:
1. **Lab Dependency:** Conventional medical software halts when formal blood panels (HbA1c, serum creatinine, lipid profiles) are missing—a daily reality in community health clinics.
2. **Black-Box AI Guessing:** Relying on generative LLMs or statistical guessing to score medical risk introduces hallucinations and destroys clinical trust and legal defensibility.
3. **Symptom & Duration Blindness:** Traditional checklists treat a symptom that *"started today"* identically to one persisting *"longer than 3 months"*, ignoring critical temporal degradation signals while risking cross-disease confusion in triage software.

### The Sahayak Solution
**Sahayak** is an advanced, early-warning diagnostic prediction engine and patient management system built for community health workers, primary village doctors, and family caregivers. 

Instead of guessing, Sahayak combines **internationally validated clinical instruments** (IDRS, JNC8, WHO/ISH SEAR-B, CKD-EPI, FAST/ABCD²) with our breakthrough **Duration-Weighted Symptom Cluster Score (DWSCS)**. It actively extracts structural intelligence from plain-language symptom descriptions, quantifies chronological persistence, and automatically generates concrete diagnostic lab orders and specialist referrals with **mandatory timeline deadlines**—*operating seamlessly even in zero-lab environments.*

---

## 🏆 Why This Wins: Business & Clinical Perspective

### 1. Zero-Lab Diagnostic Resilience
In underdeveloped or frontline settings, blood test results take days. Sahayak is architected to operate on **Screened vs. Lab-Confirmed** confidence tracks. When formal diagnostic labs are missing, the system seamlessly leverages chronic symptom patterns and fundamental vitals to establish actionable triage tiers without blocking care delivery.

### 2. Defensible Clinical AI — No Black-Box Risk Scoring
Hackathon judges and healthcare administrators alike demand precision and patient safety. **In Sahayak, Artificial Intelligence never calculates or overrides an urgency tier.** 
* **The AI Role:** Google’s **Gemini 2.0 Flash** operates strictly inside secure server-side Edge Functions to translate clinical medical terms into empathetic, low-literacy patient summaries across native regional languages (English, Hindi हिन्दी, Gujarati ગુજરાતી) and to transcribe spoken dialect via voice-to-text.
* **The Engine Role:** Every medical risk tier is **100% deterministic, mathematically traceable, and reproducible**. If an early risk prediction is surfaced, the UI displays the exact physical symptom, duration multiplier, and clinical threshold that produced it.

### 3. The Cross-Condition Isolation Guarantee
In legacy patient intake systems, reporting numerous severe diabetes symptoms (e.g., extreme thirst, frequent urination, weight loss) often accidentally triggers false alarms in adjacent cardiovascular or hypertension scoring algorithms due to shared form variables. Sahayak implements a hard programmatic **Boundary Isolation Guarantee**—ensuring that data fields not assigned to a disease's verified clinical taxonomy physically cannot penetrate or distort that condition's risk computation.

### 4. Concrete Action Deadlines Over Vague Advice
We eliminate open-ended "see a doctor sometime" suggestions. Sahayak incorporates an automated diagnostic recommendation matrix where **every single identified risk carries a non-negotiable timeframe** (e.g., *"HbA1c fasting blood test recommended within 2 weeks"*, *"Emergency nephrology triage required immediately / now"*).

---

## 🔄 System Workflow: How Sahayak Operates

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. INTAKE & DIALECT DICTION (Hospital Clinician / Family Member)                       │
│    • Voice-to-Text (Web Speech API) fills out plain-language master questions          │
│    • Real-time BMI & Asia-Pacific metabolic threshold autocomputation                   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. TAXONOMY ISOLATION & DWSCS MULTIPLIER (Deterministic Edge Triage)                    │
│    • Inputs filtered through selectInputsForCondition boundary allowlists              │
│    • Chronological duration multipliers applied (Today: 1.0x ──► >3 Months: 1.75x)    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. MULTI-LAYER PREDICTION ENGINE EVALUATION (5-Condition Evaluation)                   │
│    • STEP 1: Hard Override check (FAST+ Stroke signs, Hypertensive Crisis BP ≥180/120) │
│    • STEP 2: Longitudinal Trend Analysis (Comparing trajectories over prior visits)    │
│    • STEP 3: Snapshot Fallback & DWSCS score pattern consolidation                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. REALTIME NETWORK SYNC & ACTIONABLE TRIAGE DISPATCH                                  │
│    • Supabase Realtime pushes instant alerts to all connected clinical hospital rooms  │
│    • Interactive Constellation Visualization maps multi-system vulnerability           │
│    • Gemini AI Edge Function generates empathy-driven native language audio summary    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Effortless Intake:** Whether conducted by an emergency hospital nurse or an individual tracking family health, the interface breaks down complex clinical histories into stage-wise, accessible questions.
2. **Master Symptom Wizard:** Instead of asking redundant questions per disease, every symptom is asked once in humanized language, coupled with a dynamic duration picker (*Started today · Last few days · 1–4 weeks · 1–3 months · Longer than 3 months*).
3. **Atomic Evaluation & Realtime Triage:** The moment an intake completes, the evaluation pipeline generates an immediate medical status across all five disease vectors, broadcasting emergency alerts via Supabase Realtime WebSockets directly to active clinical monitoring stations.

---

## 🧬 Architecture of the Early Prediction Engine

The computational heart of Sahayak lives in `src/lib/riskEngine/`. It operates via a strict **3-Step Hierarchical Pipeline** that evaluates Diabetes, Hypertension, Cardiovascular Disease (CVD), Chronic Kidney Disease (CKD), and Stroke independently:

```
                  ┌───────────────────────────────┐
                  │    Isolated Condition Input    │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
             ┌────┤  STEP 1: Hard Emergency Check ├────┐
             │    └───────────────────────────────┘    │
        [YES: Acute Crisis]                       [NO Acute Signs]
             │                                         │
             ▼                                         ▼
   🚨 IMMEDIATE TRIAGE               ┌─────────────────────────────────┐
   (e.g., FAST+ Stroke,              │ STEP 2: Longitudinal Trend Data │
    BP ≥ 180/120 Crisis)             └────────┬──────────────┬─────────┘
                                     [Escalating Trend]  [No Trend Data]
                                              │              │
                                              ▼              ▼
                                    📈 TREND ESCALATOR  ┌───────────────────────────────┐
                                    (Persistent Degrad) │ STEP 3: DWSCS Snapshot Engine │
                                                        └───────────────┬───────────────┘
                                                                        │
                                                                        ▼
                                                             🎯 PRECISION RECOMMENDATION
                                                             (Symptom Pattern Score + Deadline)
```

### STEP 1: Instant Hard Overrides (Duration-Blind Emergencies)
When acute, emergency clinical symptoms appear, chronological duration is immediately bypassed. The patient is elevated to **Immediate Emergency Triage (`"now"`)** without waiting for scores or lab work:
* **Stroke:** Positive screening on any FAST sign (facial droop, arm weakness, slurred speech, sudden balance loss).
* **Hypertension:** Acute crisis readings where Systolic BP $\ge 180$ mmHg or Diastolic BP $\ge 120$ mmHg.
* **Diabetes:** Signs of acute Diabetic Ketoacidosis (DKA), including fruity breath odor, fast/deep respiration, or acute mental confusion.
* **CKD:** Acute renal failure indicators such as complete anuria (zero urine output in 24 hours).

### STEP 2: Longitudinal Trend Engine
If a patient has $\ge 2$ historical checkups recorded in Supabase, the engine actively analyzes trajectory rather than viewing visits in isolation. For instance, two consecutive consultations showing borderline hypertension without reduction automatically escalates the patient to a **Firm Priority Consultation**, identifying progressive decompensation early.

### STEP 3: Duration-Weighted Symptom Cluster Score (DWSCS)
When no acute emergency is present and formal lab tests are absent, Sahayak employs the DWSCS algorithm to transform qualitative complaints into mathematically weighted quantitative early predictions.

#### How DWSCS Works:
1. **Symptom Base Weights:** Non-emergency chronic symptoms are weighted by diagnostic specificity (e.g., in Diabetes, polydipsia [thirst] and polyuria [frequent urination] carry a base weight of `3.0`, whereas generalized fatigue carries `1.0`).
2. **Duration Multiplier Scale:** To recognize that persistence correlates with physiological strain, weights are multiplied by an explicit heuristic duration coefficient:
   * **Started today / Last few days:** $\times 1.0$
   * **About 1–4 weeks:** $\times 1.25$
   * **Comes and goes (Intermittent):** $\times 1.4$
   * **About 1–3 months:** $\times 1.5$
   * **Longer than 3 months:** $\times 1.75$
3. **Transparent Terminology & Traceability:** DWSCS results are explicitly labeled as `"symptom pattern score"` in the UI and reports—never misrepresented as a verified lab test. Every contributing symptom is displayed directly in the UI with its exact decimal score contribution.
4. **Clinical Safety Ceiling Rules:** To ensure medical integrity, built-in ceiling invariants prevent false alarms:
   * **Hypertension Ceiling Rule:** Symptoms alone (such as headache or mild dizziness) without an actual elevated BP reading can only nudge a patient from *All Clear* to *Monitor/Soft*—they are strictly barred from reaching *Firm* or *Immediate* emergency tiers without elevated vital readings.
   * **CKD Sensitivity OR-Rule:** A patient reporting persistent uremic signs (e.g., swelling and foamy urine lasting $>3$ months) reaches DWSCS threshold $\ge 5$ or $\ge 9$, triggering urgent nephrology checkups within 3–4 weeks even if their raw symptom count was lower than traditional heuristic floors.

---

## 🛡️ Technical Stack & Security Model

| Component | Engineering Implementation |
| :--- | :--- |
| **Frontend & Branding** | React 18, Vite 5, TypeScript (Strict Mode), Tailwind CSS, Framer Motion animations, custom SVG branding (`/favicon.svg`). |
| **Database & Realtime** | Supabase Postgres (with strict Row Level Security), Realtime WebSockets via `postgres_changes` subscriptions. |
| **Artificial Intelligence** | **Google Gemini 2.0 Flash** server-side via Supabase Edge Functions (`Deno`) with fallback language dictionary reserves. |
| **Voice Dictation** | Browser-native **Web Speech API** enabling real-time microphone dictation across regional dialects without external third-party audio SDKs. |
| **Quality Assurance** | Automated property-based mathematical testing suite (`tsx scripts/verify_engine.ts`) proving strict cross-condition boundary isolation. |

### Security & Secret Protection
* **No Secrets in Public Bundles:** Service role keys (`SUPABASE_SERVICE_ROLE_KEY`) and AI model keys (`GEMINI_API_KEY`) are permanently excluded from client bundles (`VITE_*`). Gemini keys exist exclusively within protected Edge Functions.
* **Row-Level Security (RLS):** Database queries undergo automatic verification at the Postgres level to protect patient records.
* **Zero Runtime Dependency Lock-ins:** All components and styling primitives are owned directly in `src/components/ui`, avoiding unstable dynamic runtime CSS imports.

---

## 🚀 Quick Start & Deployment

### Prerequisites
* **Node.js 18+** & npm
* A free **Supabase** instance ([supabase.com](https://supabase.com))
* *(Optional)* A **Gemini API Key** for real-time AI translation & audio narration

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/nirog.git sahayak-nirog
cd sahayak-nirog
npm install
```

### 2. Configure Environment Variables
Create a local `.env.local` file from the provided template:
```bash
cp .env.example .env.local
```
Populate your Supabase URL and public anonymized key:
```dotenv
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# Used ONLY by local seeding scripts — never bundled into client JavaScript
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Initialize Supabase Database Schema
In your Supabase project dashboard, navigate to the **SQL Editor** and execute the schema files in order:
1. `supabase/schema.sql` (Creates clinical tables, indexes, and security policies)
2. `supabase/realtime.sql` (Enables instant WebSockets broadcast on assessments)

### 4. Run Automated Engine & Isolation Verifications (100% Guaranteed)
Test our deterministic clinical calculations and cross-condition boundary isolation directly from terminal:
```bash
npm run test:engine
```
*(Produces automated proof that all 8 clinical mathematical invariants and DWSCS rules pass cleanly).*

### 5. Launch Development Server
```bash
npm run dev
```
Navigate to **http://localhost:5173**. Experience the interactive dashboard instantly!

---

## 📜 Available Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Spins up local Vite development server with hot module reloading on `:5173`. |
| `npm run test:engine` | Executes automated property regression and DWSCS mathematical verification checks. |
| `npm run build` | Performs strict type verification and outputs an optimized static build to `dist/`. |
| `npm run lint` | Runs `tsc -b --noEmit` to verify type cleanliness with zero syntax defects. |
| `npm run seed` | Populates Supabase with 20 clinically varied demonstration patient case studies. |

---

<div align="center">
  <p><strong>Sahayak · Designed for real community clinics, actionable early diagnosis, and zero guesswork.</strong></p>
  <p><em>MIT License · Hackathon Ready · Engineered for Accuracy</em></p>
</div>