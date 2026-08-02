/**
 * Isolation module — filters form payloads at the boundary before condition evaluation.
 * Enforces invariant: condition evaluation output is provably unchanged under any mutation
 * of input fields not in TAXONOMY_FIELDS_FOR[condition].
 */
import type { ConditionKey } from "../../types";
import { TAXONOMY_FIELDS_FOR } from "./taxonomy";

export function selectInputsForCondition(
  condition: ConditionKey | string,
  fullFormResponse: Record<string, any> = {}
): Record<string, any> {
  const cond = condition as ConditionKey;
  const allowed = new Set(TAXONOMY_FIELDS_FOR[cond] || []);
  const filtered: Record<string, any> = {};

  for (const [key, value] of Object.entries(fullFormResponse)) {
    // 1. Exact field ID match in allow-list
    if (allowed.has(key)) {
      filtered[key] = value;
    }
    // 2. Flat duration syntax match (e.g. "thirst_duration" allowed if "thirst" is allowed)
    else if (key.endsWith("_duration")) {
      const baseKey = key.replace(/_duration$/, "");
      if (allowed.has(baseKey)) {
        filtered[key] = value;
      }
    }
    // 3. Nested UI durations dictionary match
    else if (key === "durations" && typeof value === "object" && value !== null) {
      const filteredDurations: Record<string, any> = {};
      for (const [durKey, durVal] of Object.entries(value)) {
        if (allowed.has(durKey)) {
          filteredDurations[durKey] = durVal;
        }
      }
      filtered.durations = filteredDurations;
    }
  }

  return filtered;
}
