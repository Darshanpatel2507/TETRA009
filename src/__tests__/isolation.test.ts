/**
 * Regression Test Suite: Cross-Condition Isolation Guarantee & DWSCS
 * Ensures condition isolation is programmatically guaranteed at the architecture boundary.
 */

import {
  selectInputsForCondition,
  evaluateCondition,
  computeDWSCS,
  TAXONOMY_FIELDS_FOR,
  CONDITIONS,
} from "../lib/riskEngine";

declare const describe: ((name: string, fn: () => void) => void) | undefined;
declare const it: ((name: string, fn: () => void) => void) | undefined;

// Lightweight test wrapper compatible with Jest / Vitest and standalone execution
const testRunner = {
  runAll: () => {
    console.log("Running regression tests for Isolation Guarantee & DWSCS...");

    // Test 1: Literal Fixture Test
    const heavyDiabetesLightBP = {
      thirst: "yes", thirst_duration: "about1to4weeks",
      frequentUrination: "yes", frequentUrination_duration: "about1to4weeks",
      weightLoss: "yes", weightLoss_duration: "about1to4weeks",
      hunger: "yes", hunger_duration: "about1to4weeks",
      poorAppetite: "yes", poorAppetite_duration: "about1to4weeks",
      headache: "yes", headache_duration: "startedToday",
    };
    const bpScoped = selectInputsForCondition("hypertension", heavyDiabetesLightBP);
    const bpResult = evaluateCondition("hypertension", bpScoped, []);
    if (bpResult.tier === "firm" || bpResult.tier === "immediate") {
      throw new Error("Violation of isolation: BP reached firm/immediate due to diabetes inputs");
    }

    // Test 2: Property-based Cross-Condition Isolation
    for (const cond of CONDITIONS) {
      const base = { thirst: "yes", headache: "yes", swelling: "yes" };
      const res1 = evaluateCondition(cond, selectInputsForCondition(cond, base), []);
      
      const mutated: Record<string, any> = { ...base };
      const condFields = new Set(TAXONOMY_FIELDS_FOR[cond] || []);
      for (const otherCond of CONDITIONS) {
        if (otherCond === cond) continue;
        for (const field of (TAXONOMY_FIELDS_FOR[otherCond] || [])) {
          if (!condFields.has(field)) {
            mutated[field] = "yes";
            mutated[`${field}_duration`] = "Longer than 3 months";
          }
        }
      }
      const res2 = evaluateCondition(cond, selectInputsForCondition(cond, mutated), []);
      if (JSON.stringify(res1) !== JSON.stringify(res2)) {
        throw new Error(`Isolation invariant violated for condition: ${cond}`);
      }
    }

    // Test 3: Terminology accuracy
    const dwscs = computeDWSCS("diabetes", { thirst: "yes", thirst_duration: "Longer than 3 months" });
    for (const match of dwscs.matched) {
      if (!match.formatted.includes("symptom pattern score") || match.formatted.toLowerCase().includes("clinical score")) {
        throw new Error("Terminology violation: must use 'symptom pattern score', never 'clinical score'");
      }
    }

    console.log("All isolation and DWSCS regression unit tests passed successfully.");
  },
};

if (typeof describe === "function" && typeof it === "function") {
  describe("Cross-Condition Isolation & DWSCS", () => {
    it("guarantees isolation and DWSCS threshold invariants", () => {
      testRunner.runAll();
    });
  });
} else {
  testRunner.runAll();
}
