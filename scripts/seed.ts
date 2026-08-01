/* eslint-disable no-console */
/**
 * scripts/seed.ts
 *
 * Local-only data seeding. Uses the SUPABASE_SERVICE_ROLE_KEY from
 * the environment (NOT VITE_, so Vite will not inline it). NEVER
 * imported from src/ — see package.json script.
 *
 * Run with:
 *   SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import { seedPatients } from "../src/lib/mockData/patients";
import { runRiskEngine } from "../src/lib/riskEngine";

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env before running seed.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(`Seeding ${seedPatients.length} demo patients…`);
  for (const { payload } of seedPatients) {
    const engine = runRiskEngine(payload);

    const { data: pat, error: perr } = await admin
      .from("patients")
      .insert({
        full_name: payload.full_name,
        age: payload.age,
        sex: payload.sex,
        village: payload.village ?? null,
        phone: payload.phone ?? null,
      })
      .select()
      .single();
    if (perr) throw perr;

    const { error: aerr } = await admin
      .from("risk_assessments")
      .insert({
        patient_id: pat.id,
        band: engine.decision.band,
        scores: engine.scores,
        factors: engine.factors,
        gap_labs: engine.gap_labs,
        specialist: engine.specialist,
        decision: engine.decision,
        confidence: engine.confidence,
        notes: null,
      });
    if (aerr) throw aerr;
    console.log(`  ${payload.full_name.padEnd(20)} → ${engine.decision.band}`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
