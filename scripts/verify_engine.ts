/**
 * Automated verification script for Cross-Condition Isolation Guarantee
 * and Duration-Weighted Symptom Cluster Score (DWSCS) engine.
 *
 * Runs all 8 mandatory checkpoints from Section 6 of the specification.
 */

import { selectInputsForCondition, evaluateCondition, computeDWSCS, mapCkdDWSCS, TAXONOMY_FIELDS_FOR } from "../src/lib/riskEngine";

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] Check ${totalTests}: ${message}`);
  } else {
    console.error(`[FAIL] Check ${totalTests}: ${message}`);
    process.exitCode = 1;
  }
}

console.log("=== Running Sahayak Risk Engine & Isolation Verification ===\n");

// ----------------------------------------------------------------------------
// CHECK 1: Literal Fixture Test (Section 1)
// ----------------------------------------------------------------------------
const heavyDiabetesLightBP = {
  thirst: "yes", thirst_duration: "about1to4weeks",
  frequentUrination: "yes", frequentUrination_duration: "about1to4weeks",
  weightLoss: "yes", weightLoss_duration: "about1to4weeks",
  hunger: "yes", hunger_duration: "about1to4weeks",
  poorAppetite: "yes", poorAppetite_duration: "about1to4weeks",
  headache: "yes", headache_duration: "startedToday", // the one BP item
};
const bpScoped = selectInputsForCondition("hypertension", heavyDiabetesLightBP);
const bpResult = evaluateCondition("hypertension", bpScoped, []);

assert(
  bpResult.tier !== "firm" && bpResult.tier !== "immediate" && (bpResult.tier === "routine" || bpResult.tier === "soft"),
  `Literal fixture test: 5 diabetes items + 1 low-weight same-day BP item produces BP tier '${bpResult.tier}' (never firm or immediate)`
);

// ----------------------------------------------------------------------------
// CHECK 2: Property-based isolation test for all 5 conditions
// ----------------------------------------------------------------------------
const conditions = ["diabetes", "hypertension", "cvd", "ckd", "stroke"] as const;
const basePayload: Record<string, any> = {
  thirst: "yes", thirst_duration: "about1to4weeks",
  headache: "yes", headache_duration: "lastFewDays",
  palpitations: "yes", palpitations_duration: "longerThan3Months",
  swelling: "yes", swelling_duration: "about1to3months",
  tiaEpisode90d: "yes",
};

let propertySuccess = true;
for (const cond of conditions) {
  const scoped1 = selectInputsForCondition(cond, basePayload);
  const res1 = evaluateCondition(cond, scoped1, []);

  // Programmatically inject heavy symptom noise ONLY for fields that do NOT belong to cond
  const mutatedPayload: Record<string, any> = { ...basePayload };
  const condFields = new Set(TAXONOMY_FIELDS_FOR[cond] || []);
  
  for (const otherCond of conditions) {
    if (otherCond === cond) continue;
    for (const field of (TAXONOMY_FIELDS_FOR[otherCond] || [])) {
      if (!condFields.has(field)) {
        mutatedPayload[field] = "yes";
        mutatedPayload[`${field}_duration`] = "Longer than 3 months";
      }
    }
  }

  const scoped2 = selectInputsForCondition(cond, mutatedPayload);
  const res2 = evaluateCondition(cond, scoped2, []);

  if (JSON.stringify(res1) !== JSON.stringify(res2)) {
    propertySuccess = false;
    console.error(`Mismatch for condition '${cond}':`, res1, res2);
  }
}
assert(propertySuccess, "Property check: mutating condition-B inputs never changes condition-A output across all 5 conditions");

// ----------------------------------------------------------------------------
// CHECK 3: Single low-weight symptom started today does not escalate past lowest non-routine tier
// ----------------------------------------------------------------------------
const singleDayDiabetes = evaluateCondition("diabetes", selectInputsForCondition("diabetes", { fatigue: "yes", fatigue_duration: "Started today" }));
const singleDayCvd = evaluateCondition("cvd", selectInputsForCondition("cvd", { anxious: "yes", anxious_duration: "Started today" }));
const singleDayCkd = evaluateCondition("ckd", selectInputsForCondition("ckd", { fatigue: "yes", fatigue_duration: "Started today" }));
const singleDayBp = evaluateCondition("hypertension", selectInputsForCondition("hypertension", { dizziness: "yes", dizziness_duration: "Started today" }));
const singleDayStroke = evaluateCondition("stroke", selectInputsForCondition("stroke", { headache: "yes", headache_duration: "Started today" }));

assert(
  singleDayDiabetes.tier === "routine" &&
  singleDayCvd.tier === "routine" &&
  singleDayCkd.tier === "routine" &&
  (singleDayBp.tier === "routine" || singleDayBp.tier === "soft") &&
  (singleDayStroke.tier === "routine" || singleDayStroke.tier === "soft"),
  "Single low-weight symptom reported 'started today' alone does not escalate past lowest non-routine tier for all 5 conditions"
);

// ----------------------------------------------------------------------------
// CHECK 4: Thirst + Frequent Urination for 1-3 months reaches firm for diabetes
// ----------------------------------------------------------------------------
const firmDiabetes = evaluateCondition(
  "diabetes",
  selectInputsForCondition("diabetes", {
    thirst: "yes", thirst_duration: "About 1–3 months",
    frequentUrination: "yes", frequentUrination_duration: "About 1–3 months",
  })
);
assert(
  firmDiabetes.tier === "firm",
  `Two primary-weight symptoms (thirst + frequent urination, 1-3 months) reach tier '${firmDiabetes.tier}' for diabetes (score: ${firmDiabetes.score})`
);

// ----------------------------------------------------------------------------
// CHECK 5: Hypertension ceiling rule — never firm or immediate from DWSCS alone
// ----------------------------------------------------------------------------
const maxHpSymptoms = evaluateCondition(
  "hypertension",
  selectInputsForCondition("hypertension", {
    headache: "yes", headache_duration: "Longer than 3 months",
    blurredVision: "yes", blurredVision_duration: "Longer than 3 months",
    dizziness: "yes", dizziness_duration: "Longer than 3 months",
  })
);
assert(
  maxHpSymptoms.tier !== "firm" && maxHpSymptoms.tier !== "immediate",
  `Hypertension ceiling rule: max symptoms alone without elevated BP reading capped at '${maxHpSymptoms.tier}' (never firm or immediate)`
);

// ----------------------------------------------------------------------------
// CHECK 6: CKD score-based OR-condition triggers where old raw-count alone would not
// ----------------------------------------------------------------------------
// Test DWSCS OR logic: e.g., score >= 5 with rawCount 1 or score >= 9 with rawCount 2
const ckdOrModerate = mapCkdDWSCS(5.25, 1); // rawCount 1 would be routine under old rule, score 5.25 triggers moderate
const ckdOrAdvanced = mapCkdDWSCS(9.5, 2);  // rawCount 2 would be moderate under old rule, score 9.5 triggers advanced
assert(
  ckdOrModerate === "moderate" && ckdOrAdvanced === "advanced",
  `CKD DWSCS OR-condition triggers CKD-2/CKD-3 (${ckdOrModerate}/${ckdOrAdvanced}) where old raw count alone would not have`
);

// ----------------------------------------------------------------------------
// CHECK 7: matchedCriteria traceability
// ----------------------------------------------------------------------------
const traceTest = computeDWSCS("ckd", {
  swelling: "yes", swelling_duration: "About 1–4 weeks",
  jointPain: "yes", jointPain_duration: "Longer than 3 months",
});
let traceable = traceTest.matched.every(m =>
  m.formatted.includes(m.symptom) &&
  m.formatted.includes(m.duration) &&
  m.formatted.includes(m.contribution.toFixed(1)) &&
  m.formatted.includes("symptom pattern score contribution")
);
assert(
  traceable,
  "matchedCriteria for every DWSCS item names the exact symptom, duration, and contribution point value"
);

// ----------------------------------------------------------------------------
// CHECK 8: Terminology verification ('symptom pattern score', never 'clinical score')
// ----------------------------------------------------------------------------
const sampleOutput = firmDiabetes.matchedCriteria.join(" ") + traceTest.matched.map(m => m.formatted).join(" ");
const hasPatternScore = sampleOutput.includes("symptom pattern score");
const noClinicalScore = !sampleOutput.toLowerCase().includes("clinical score");
assert(
  hasPatternScore && noClinicalScore,
  "Every DWSCS-derived label explicitly reads 'symptom pattern score' and never 'clinical score'"
);

console.log(`\n=== Verification Complete: ${passedTests}/${totalTests} Checks Passed Successfully! ===`);
if (process.exitCode !== 1) {
  process.exit(0);
} else {
  process.exit(1);
}
