/**
 * scripts/sanity.ts — quick smoke-test of the risk engine without
 * needing Supabase. Runs `runRiskEngine` against the seed payloads
 * and prints the band/action. Not part of the build.
 *
 * Run: npx tsx scripts/sanity.ts
 */
import { seedPatients } from "../src/lib/mockData/patients";
import { runRiskEngine } from "../src/lib/riskEngine";

let i = 0;
for (const { payload } of seedPatients) {
  i++;
  const r = runRiskEngine(payload);
  const condKeys = (["diabetes", "hypertension", "cvd", "ckd", "stroke"] as const);
  const flags = condKeys.filter((k) => r.scores[k].band !== "low").join(",") || "—";
  console.log(
    String(i).padStart(2, " ") +
    " " + payload.full_name.padEnd(22) +
    " age=" + String(payload.age).padStart(2) +
    " BP=" + payload.vitals.systolic_bp + "/" + payload.vitals.diastolic_bp +
    " → band=" + r.decision.band.padEnd(8) +
    " active=[" + flags + "]"
  );
}
