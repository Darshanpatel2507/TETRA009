import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Assessment, IntakePayload } from "../types";
import { runRiskEngine } from "../lib/riskEngine";

export function useAssessment(patientId: string | undefined) {
  return useQuery<Assessment | null>({
    enabled: !!patientId,
    queryKey: ["assessment", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risk_assessments")
        .select("*")
        .eq("patient_id", patientId!)
        .order("assessed_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as Assessment) ?? null;
    },
  });
}

/**
 * Run the risk engine locally + persist a new assessment row.
 * Returns the persisted assessment and the patient's id.
 *
 * Why two writes (patient + risk_assessment): the schema keeps
 * demographics in `patients` (so we can list/track them on the
 * dashboard) and the clinically-scored result in `risk_assessments`.
 */
export async function createAssessment(p: IntakePayload): Promise<{ patientId: string; assessment: Assessment }> {
  const engine = runRiskEngine(p);

  // Step 1 — insert patient
  const { data: pat, error: perr } = await supabase
    .from("patients")
    .insert({
      full_name: p.full_name,
      age: p.age,
      sex: p.sex,
      village: p.village ?? null,
      phone: p.phone ?? null,
    })
    .select()
    .single();
  if (perr || !pat) throw perr ?? new Error("Failed to create patient");

  // Step 2 — insert assessment
  const { data: ass, error: aerr } = await supabase
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
    })
    .select()
    .single();
  if (aerr || !ass) throw aerr ?? new Error("Failed to save assessment");

  return { patientId: pat.id, assessment: ass as Assessment };
}

/** Realtime subscription to a single patient's latest assessment. */
export function useAssessmentLive(patientId: string | undefined) {
  const q = useAssessment(patientId);
  useEffect(() => {
    if (!patientId) return;
    const channel = supabase
      .channel(`ass:${patientId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "risk_assessments", filter: `patient_id=eq.${patientId}` },
        () => q.refetch(),
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [patientId]); // eslint-disable-line react-hooks/exhaustive-deps
  return q;
}
