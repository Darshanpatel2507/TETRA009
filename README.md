<div align="center">

# 🩺 Nirog

**Rural primary-healthcare risk assessment — built for the village clinic, not the urban hospital.**

A fully wired, end-to-end web app that turns a primary-care visit into a structured, evidence-based risk score across **diabetes, hypertension, cardiovascular disease, chronic kidney disease, and stroke** — using published clinical instruments, no ML in the decision path, with realtime updates and a localised, low-literacy UI.

Five-condition risk engine · Supabase Postgres + Realtime · Gemini narration · Three languages (EN / हिन्दी / ગુજરાતી) · Responsive desktop + purpose-built mobile · Deterministic & reproducible.

[Features](#-features) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Clinical Engine](#-clinical-risk-engine) · [Security](#-security-model) · [Deployment](#-deployment) · [Verification](#-verification-checklist)

</div>

---

## 📸 What it does

A clinician opens the dashboard, sees a live list of every patient and their latest risk band. New assessments land in realtime via Supabase. They tap **+ New assessment**, walk through a five-step intake (demographics → vitals → symptoms → history → labs), save, and the deterministic engine produces a constellation view, a per-factor breakdown, a missing-investigations list, and a referral suggestion. A Gemini-powered narration card writes it all up in plain English (or हिन्दी or ગુજરાતી) with one click.

---

## ✨ Features

### 🧠 Clinical decision layer
- **Five-condition scoring** — diabetes (IDRS), hypertension (JNC8), CVD (WHO/ISH SEAR-B lookup), CKD (CKD-EPI 2021 race-free), stroke (FAST + ABCD²).
- **Deterministic priority engine** — FAST-positive → immediate, BP ≥180/120 → crisis, any critical condition → immediate, any high → 48h referral, any moderate → routine flagged, else routine annual.
- **Confidence rule** — lab-confirmed vs screened (no-lab) with explicit UI badge.
- **Gap analysis** — auto-detects missing labs per condition and offers to order them.
- **Specialist mapping** — primary + secondary referral suggestion per active condition.
- **Engine is reproducible** — same inputs always produce the same band. `npx tsx scripts/sanity.ts` smoke-tests against all 20 seed patients.

### 🎨 Design system
- **Single source of truth** — `src/styles/tokens.css` drives every color, radius, shadow, font, and easing. Tailwind reads the same custom properties.
- **Two non-confused palettes** — *risk-level* (urgency: low/mod/high/crit) vs *condition* (which condition: blue/magenta/burnt-orange/purple/teal).
- **Typography** — Space Grotesk display, Inter body, **IBM Plex Mono on every number** (no exceptions — enforced via `.num` and `.font-mono` rules).
- **Light app shell + dark navy-green sidebar + dark Risk Constellation panel** (intentional contrast).
- **Framer Motion** micro-interactions — sidebar active-item slide indicator, constellation node pulse (fastest on highest urgency), intake stepper slide+fade, card hover lift, route fade+slide, toasts, button-press scale.
- **WCAG AA** colour contrast on every text token.

### 🧑‍⚕️ Village / low-literacy usability
- **Every text/numeric input has a microphone button** (Web Speech API) — voice-to-text dictation works in the active UI language.
- **44px+ minimum touch targets** on all interactive elements.
- **One task per screen** on mobile — stacked, focused flows.
- **Plain-language labels** with `Tooltip`s for clinical terms (eGFR, IDRS, HbA1c, ABCD²).
- **Text paired with every icon** — no icon-only CTAs.

### 🌐 Internationalisation
- **Three locales** — English (en), Hindi (hi), Gujarati (gu).
- **Persistent language** — choice stored in `localStorage`, restored on next visit.
- **Live switching** — sidebar pill (desktop) and splash header (mobile).
- **Edge functions return copy in the same language** as the UI — alert text and narration are translated.

### 📱 Two layouts, purpose-built
- **Desktop / tablet (≥ md, ≥ 768px)** — `AppShell` with sticky dark sidebar, top bar, multi-column grids.
- **Mobile (< md)** — `MobileShell` with splash header, bottom nav, stacked single-column screens. **Not** a shrunk desktop layout.

### 🩺 Realtime clinical dashboard
- **Live updates** via Supabase `postgres_changes` on `risk_assessments` INSERT.
- **Three stat cards** — total patients, high-risk/critical today, assessed today.
- **Search** by name or village; **filter** by band; **sort** by name/age/band/last-assessed (clickable column toggle).
- **CSV export** of the current dashboard view.
- **High-risk assessment toast** — when a new high/critical row lands, the dashboard fetches a localised SMS-style alert from the `narrate-alert` edge function and surfaces it as an error-kind toast.

### 🧾 Intake wizard
- **Five steps** — Demographics → Vitals → Symptoms → History → Labs.
- **AnimatePresence slide-fade** between steps.
- **BMI auto-computed** as height & weight are entered (Asia-Pacific thresholds).
- **FAST flags highlighted** with red error styling when any are positive — they push the urgency band to critical immediately on save.
- **Save & assess** persists patient + assessment atomically and navigates to the constellation.

### 🌌 Risk Constellation
- **Five nodes** in a radial SVG layout, coloured by condition, with a pulsing ring whose speed is inversely proportional to urgency (critical pulses fastest).
- **Click a node** — selects it for emphasis in the side list.
- **Legend** — colour-coded urgency levels.

### 📊 Risk Breakdown
- **Overall urgency card** — band, action label, rationale, confidence badge.
- **Factor table** — each contributing factor with source algorithm (JNC8, IDRS, WHO-ISH, CKD-EPI, FAST) shown in a tooltip, weight bar, and value.
- **Missing investigations card** — per-condition gap labs with order button.
- **AI Insight card** — Gemini narration + alert one-liner, with "band decided deterministically" label.
- **Referral suggestion card** — primary + secondary specialist with one-click "Generate referral".

### 🔬 AI narration layer (Gemini)
- **Two edge functions**, both server-side:
  - `narrate-risk` — full structured `{ narration, alert, source }` for the breakdown page.
  - `narrate-alert` — ≤160-char SMS-style alert for the realtime toast.
- **Both return per-language fallback strings** if the Gemini call fails or no key is configured.
- **Clinical band is NEVER chosen by Gemini** — it's passed in from the deterministic engine. Gemini only rephrases.

### 🛠️ Developer experience
- **Type-safe** — strict TypeScript across the codebase, `npx tsc -b` clean.
- **No secrets in client bundle** — service-role key never appears in `dist/`.
- **Locally owned UI primitives** — Button, Card, Input, Select, Badge, Tabs, Stepper, Dialog, Tooltip, Switch, Progress, DataTable, Toast — all in `src/components/ui/`. No 21st.dev runtime imports.
- **Error boundary** wrapping the whole app — render failures show a recoverable card instead of a blank screen.
- **Seedable demo data** — 20 synthetic patients in `src/lib/mockData/patients.ts`, used ONLY by `scripts/seed.ts`.

---

## 🧰 Tech Stack

| Layer            | Choice                                                          |
|------------------|-----------------------------------------------------------------|
| Framework        | **React 18** + **TypeScript 5** (strict)                        |
| Build tool       | **Vite 5**                                                      |
| Routing          | **react-router-dom 6**                                          |
| Styling          | **Tailwind CSS 3** + custom CSS variables (token-driven)        |
| Motion           | **Framer Motion 11**                                            |
| Data layer       | **TanStack Query 5** + `@supabase/supabase-js`                  |
| Backend          | **Supabase** — Postgres, Realtime, Edge Functions (Deno)        |
| AI narration     | **Gemini 2.0 Flash** (`gemini-2.0-flash`) via Edge Functions     |
| i18n             | Custom `LanguageContext` + JSON dictionaries                    |
| Voice input      | **Web Speech API** (browser-native, no SDK)                     |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- A **Supabase** project (free tier is fine) — [supabase.com](https://supabase.com)
- *(Optional)* A **Gemini API key** from [aistudio.google.com](https://aistudio.google.com) for AI narration
- *(Optional)* The **Supabase CLI** for deploying edge functions

### 1. Clone and install

```bash
git clone <your-fork-url> nirog
cd nirog
npm install
```

### 2. Set up Supabase

In the Supabase dashboard, create a new project. Then, in **SQL Editor**, run these two files in order:

1. `supabase/schema.sql` — creates `patients`, `risk_assessments`, `referrals`, indexes, RLS policies.
2. `supabase/realtime.sql` — adds `risk_assessments` to the `supabase_realtime` publication.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only — used by `npm run seed`. NEVER prefix with VITE_.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server-side only — set on Supabase, not here. See step 5.
GEMINI_API_KEY=
```

> ⚠️ **Security:** `.env` and `.env.local` are in `.gitignore`. The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — it must NEVER be prefixed `VITE_` (Vite would inline it into the public client bundle).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The dashboard renders immediately — **no auth gate** in this build pass.

### 5. *(Optional)* Deploy edge functions with Gemini

The narration layer works out of the box with local fallback strings. To enable real Gemini narration:

```bash
# Install Supabase CLI if you haven't
brew install supabase/tap/supabase   # macOS
# or scoop install supabase          # Windows

supabase login
supabase link --project-ref your-project-ref

# Set the secret server-side
supabase secrets set GEMINI_API_KEY=your-gemini-api-key

# Deploy both functions
supabase functions deploy narrate-risk
supabase functions deploy narrate-alert
```

Restart the dev server. The "AI-generated" badge will switch from `fallback` to `gemini` source automatically.

### 6. *(Optional)* Seed demo data

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  VITE_SUPABASE_URL=https://your-project.supabase.co \
  npm run seed
```

Inserts 20 synthetic patients with clinically varied conditions. Useful for demoing the dashboard.

---

## 📜 Available Scripts

| Script              | What it does                                                  |
|---------------------|---------------------------------------------------------------|
| `npm run dev`       | Vite dev server with HMR on `:5173`                           |
| `npm run build`     | Type-check + production build into `dist/`                    |
| `npm run preview`   | Serve the production build locally                            |
| `npm run seed`      | Insert 20 demo patients into Supabase (needs service-role key)|
| `npm run lint`      | `tsc -b --noEmit` — pure type-check                           |
| `npx tsx scripts/sanity.ts` | Run the risk engine against all 20 seed patients and print bands |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React + Vite + Tailwind + Framer Motion)              │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │ AppShell /   │   │ TanStack     │   │  Web Speech API    │  │
│  │ MobileShell  │   │ Query        │   │  (voice input)     │  │
│  └──────┬───────┘   └──────┬───────┘   └────────────────────┘  │
│         │                  │                                    │
│         └────────┬─────────┘                                    │
│                  │                                              │
│         ┌────────▼─────────┐                                   │
│         │ Supabase Client  │                                   │
│         │  (anon key)      │                                   │
│         └────────┬─────────┘                                   │
└──────────────────┼──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────────────┐
   │ Postgres│ │Realtime│ │ Edge Functions │
   │ (RLS)   │ │ chan   │ │ (Deno)         │
   │         │ │        │ │                │
   │patients │ │INSERTs │ │ narrate-risk   │──► Gemini 2.0-flash
   │risk_ass.│ │        │ │ narrate-alert  │──► Gemini 2.0-flash
   │referrals│ │        │ │                │
   └────┬────┘ └────────┘ └────────────────┘
        │
   (local-only)
        │
   ┌────▼──────────┐
   │ scripts/seed  │
   │ (service-role)│
   └───────────────┘
```

**Request flow for a new assessment:**
1. User taps "Save & assess" in `IntakeStepper`.
2. `createAssessment` in `src/hooks/useAssessment.ts` runs `runRiskEngine(payload)` locally — deterministic, no network.
3. Two Supabase writes — `patients.insert` then `risk_assessments.insert`.
4. Realtime channel pushes a `postgres_changes` INSERT event to all connected dashboards.
5. Each dashboard's `usePatients` refetches and pushes a localised toast (via `narrate-alert` for high/critical rows).
6. The originating user navigates to `/patient/:id/constellation`.

---

## 🧠 Clinical Risk Engine

All scoring lives in `src/lib/riskEngine/`. No ML in the urgency path. Each module is pure and testable.

| Module             | Instrument                  | Reference                                     |
|--------------------|-----------------------------|-----------------------------------------------|
| `diabetes.ts`      | **IDRS**                    | Mohan et al, JAPI 2005                        |
| `hypertension.ts`  | **JNC8** staging            | 2014 ACC/AHA + JNC8 convention                |
| `cvd.ts`           | **WHO/ISH SEAR-B** lookup   | WHO/ISH risk prediction charts, SEAR-B        |
| `ckd.ts`           | **CKD-EPI 2021 (race-free)**| Inker et al, NEJM 2021                        |
| `stroke.ts`        | **FAST** + **ABCD²**        | FAST NIH; ABCD² Johnston et al, Lancet 2007    |
| `decisionEngine.ts`| **Priority combiner**       | FAST > hypertensive crisis > any critical > any high > any moderate > else |
| `specialistMap.ts` | Specialist referral routing | Condition-keyed primary + secondary            |
| `gapAnalysis.ts`   | Missing-investigation list  | `REQUIRED_LABS_PER_CONDITION`                  |

**Confidence rule:**
- Lab-confirmed: at least one of `fasting_glucose_mg_dl`, `hba1c_percent`, or `serum_creatinine_mg_dl` is provided.
- Screened (no lab): none of the above — band badge reads "Screened (no lab)".

**Decision priority (top wins):**
1. **FAST positive** → `critical` — immediate referral
2. **BP ≥ 180/120** → `critical` — hypertensive crisis
3. **Any condition `critical`** → `critical` — immediate referral
4. **Any condition `high`** → `high` — 48-hour referral
5. **Any condition `moderate`** → `moderate` — routine, flagged
6. **Else** → `low` — routine annual review

Try it locally:
```bash
npx tsx scripts/sanity.ts
```

---

## 🗂️ Folder Layout

```
nirog/
├── .env.example              # env template (committed)
├── .env.local                # your real keys (gitignored)
├── .gitignore
├── index.html                # Vite entry, font preconnects, viewport
├── package.json
├── postcss.config.js
├── tailwind.config.ts        # reads tokens.css as Tailwind theme
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
│
├── README.md                 # this file
│
├── public/
│   └── favicon.svg           # icon-only logo (gradient badge)
│
├── scripts/
│   ├── seed.ts               # local-only, uses SUPABASE_SERVICE_ROLE_KEY
│   └── sanity.ts             # smoke-test the risk engine
│
├── src/
│   ├── assets/
│   │   └── logo/
│   │       └── nirog-logo.svg    # full lockup
│   │
│   ├── components/
│   │   ├── ui/                   # locally-owned primitives
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Stepper.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── layout/                # desktop + mobile shells
│   │   │   ├── AppShell.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── LanguagePill.tsx
│   │   │   ├── MobileShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   │
│   │   ├── intake/                # intake stepper chunks
│   │   │   ├── DemographicsForm.tsx
│   │   │   ├── HistoryForm.tsx
│   │   │   ├── IntakeStepper.tsx
│   │   │   ├── LabsForm.tsx
│   │   │   ├── SymptomsForm.tsx
│   │   │   ├── VitalsForm.tsx
│   │   │   └── VoiceInputField.tsx
│   │   │
│   │   ├── constellation/         # Risk Constellation viz
│   │   │   ├── ConditionNode.tsx
│   │   │   └── RiskConstellation.tsx
│   │   │
│   │   ├── assessment/            # breakdown-page cards
│   │   │   ├── AIInsightCard.tsx
│   │   │   ├── FactorBreakdownTable.tsx
│   │   │   ├── MissingInvestigationsCard.tsx
│   │   │   ├── OverallUrgencyCard.tsx
│   │   │   └── ReferralSuggestionCard.tsx
│   │   │
│   │   └── dashboard/             # clinical dashboard widgets
│   │       ├── FilterBar.tsx
│   │       ├── PatientTable.tsx
│   │       ├── RiskDotsBadge.tsx
│   │       └── StatCard.tsx
│   │
│   ├── context/
│   │   └── LanguageContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAlertCopy.ts
│   │   ├── useAssessment.ts
│   │   ├── usePatients.ts
│   │   ├── useReferral.ts
│   │   └── useVoiceInput.ts
│   │
│   ├── i18n/
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── gu.json
│   │
│   ├── lib/
│   │   ├── mockData/
│   │   │   └── patients.ts            # demo data (used ONLY by scripts/seed.ts)
│   │   ├── riskEngine/
│   │   │   ├── ckd.ts
│   │   │   ├── cvd.ts
│   │   │   ├── decisionEngine.ts
│   │   │   ├── diabetes.ts
│   │   │   ├── gapAnalysis.ts
│   │   │   ├── hypertension.ts
│   │   │   ├── index.ts
│   │   │   ├── specialistMap.ts
│   │   │   └── stroke.ts
│   │   ├── utils/
│   │   │   ├── bmi.ts
│   │   │   └── formatters.ts
│   │   └── supabaseClient.ts
│   │
│   ├── pages/
│   │   ├── clinical/
│   │   │   └── ClinicalDashboardPage.tsx
│   │   ├── mobile/
│   │   │   ├── MobileDashboardScreen.tsx
│   │   │   ├── MobileIntakeScreen.tsx
│   │   │   ├── MobilePatientsScreen.tsx
│   │   │   ├── MobileReferralScreen.tsx
│   │   │   ├── MobileRiskDetailsScreen.tsx
│   │   │   ├── MobileRiskOverviewScreen.tsx
│   │   │   ├── MobileSymptomsScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   └── patient/
│   │       ├── PatientIntakePage.tsx
│   │       ├── RiskBreakdownPage.tsx
│   │       └── RiskConstellationPage.tsx
│   │
│   ├── styles/
│   │   └── tokens.css               # the single source of truth
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
└── supabase/
    ├── schema.sql                   # tables, indexes, RLS
    ├── realtime.sql                 # realtime publication
    └── functions/
        ├── narrate-risk/
        │   └── index.ts             # narration + alert copy
        └── narrate-alert/
            └── index.ts             # SMS-style alert
```

---

## 🔒 Security Model

Nirog's threat surface is small, but the boundaries matter.

| Boundary                       | What's enforced                                                    |
|--------------------------------|--------------------------------------------------------------------|
| **Browser → Supabase**         | RLS on all three tables (`anon_all_*` policies in `schema.sql`)    |
| **Browser → Gemini**           | **Never direct** — only via Edge Functions, which hold the key     |
| **Local dev → Supabase**       | `SUPABASE_SERVICE_ROLE_KEY` in `process.env`, **not** `VITE_*`     |
| **Service-role key**           | Used **only** by `scripts/seed.ts`. Bypasses RLS. Never in `src/`  |
| **Gemini API key**             | Set via `supabase secrets set`, **never** in any file in this repo |
| **`.env.local`**               | Gitignored. `.env` (no suffix) **also** gitignored                 |
| **Production bundle (`dist/`)**| Verified — no secrets present. Check with: `grep -r SUPABASE_SERVICE_ROLE_KEY dist/` |

**Why no client-side Gemini key?** Vite bundles anything prefixed `VITE_` into the public JS output. A client-side Gemini key is a publicly exposed key the moment you deploy. The Edge Function approach keeps the key on Supabase's server and adds a clean place to log, rate-limit, or rotate without re-deploying the app.

**Tightening for production:**
- Replace the permissive `anon_all_*` RLS policies with auth-scoped ones.
- Add per-user / per-clinic `WITH CHECK` clauses.
- Add an `INSERT`-only role for the browser if referrals should not be deletable.
- Add rate limits at the edge function level.

---

## 🌐 Deployment

### Build
```bash
npm run build
```
Outputs to `dist/` — static files, deployable anywhere (Vercel, Netlify, Cloudflare Pages, S3+CloudFront).

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```
Set environment variables in the Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. (No service-role, no Gemini — those live on Supabase.)

### Supabase Edge Functions
```bash
supabase functions deploy narrate-risk
supabase functions deploy narrate-alert
```

---

## ✅ Verification Checklist

All checks PASS as of the latest build.

| #  | Check                                                                     | Result |
|----|---------------------------------------------------------------------------|--------|
| 1  | Token system lives in `src/styles/tokens.css`                             | ✅     |
| 2  | Two color systems (risk vs condition) not mixed                            | ✅     |
| 3  | IBM Plex Mono on every numeric                                            | ✅     |
| 4  | No 21st.dev runtime imports anywhere                                       | ✅     |
| 5  | Gemini key only in Edge Functions (not in `src/`)                          | ✅     |
| 6  | Service-role key only in `scripts/seed.ts`                                 | ✅     |
| 7  | `.env` / `.env.local` in `.gitignore`                                     | ✅     |
| 8  | Supabase client uses only `VITE_*` envs                                    | ✅     |
| 9  | `schema.sql` + `realtime.sql` + 2 edge fns all present                     | ✅     |
| 10 | All 9 risk-engine modules present                                          | ✅     |
| 11 | Realtime INSERT subscription wired into `usePatients`                      | ✅     |
| 12 | No `SUPABASE_SERVICE_ROLE_KEY` / `GEMINI_API_KEY` in `dist/`               | ✅     |

You can reproduce checks 11 & 12 yourself:

```bash
# Check 11 — realtime subscription
grep -n "postgres_changes.*risk_assessments" src/hooks/usePatients.ts

# Check 12 — no secrets in production bundle
npm run build
grep -r "SUPABASE_SERVICE_ROLE_KEY\|GEMINI_API_KEY" dist/   # → nothing
```

---

## 📐 Roadmap (deliberately out of scope for this pass)

- **Auth** — currently no login. Add Supabase Auth + tighten RLS to `auth.uid()`.
- **ML module B** — `ml_probability` field exists on the CVD score; the model call is wired off. Flip on when the model is trained and validated.
- **Specialist lookup** — `pickSpecialist` returns a static string. Wire to a directory table.
- **Drug-interaction checks** — once `medications` is added to the schema.
- **Print/PDF** — for the breakdown page.

---

## 📄 License

MIT — see `LICENSE` (not yet committed; add before publishing).

---

## 🙏 Acknowledgements

- **IDRS** — Mohan V, Deepa R, Deepa M, et al. *J Assoc Physicians India.* 2005.
- **WHO/ISH SEAR-B risk prediction charts** — World Health Organization.
- **CKD-EPI 2021 (race-free)** — Inker LA, Eneanya ND, Coresh J, et al. *NEJM.* 2021.
- **FAST** — National Institute of Neurological Disorders and Stroke.
- **ABCD²** — Johnston SC, Rothwell PM, Nguyen-Huynh MN, et al. *Lancet.* 2007.

---

<div align="center">

Built for the village clinic. Every number in IBM Plex Mono. Every patient in their own language.

</div>