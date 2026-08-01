import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Assessment, IntakePayload, Patient } from "../types";
import { runRiskEngine } from "../lib/riskEngine";
import { lookupDemoOrLocalPatient, savePatientMetadata, saveLocalPersonalMember } from "../lib/metadataAdapter";

export function useAssessment(patientId: string | undefined) {
  return useQuery<Assessment | null>({
    enabled: !patientId === false,
    queryKey: ["assessment", patientId],
    queryFn: async () => {
      if (!patientId) return null;

      // 1. Check if this is a demo or local family member record
      const localOrDemo = lookupDemoOrLocalPatient(patientId);
      if (localOrDemo.assessment) {
        return localOrDemo.assessment;
      }

      // 2. Otherwise fetch from Supabase
      const { data, error } = await supabase
        .from("risk_assessments")
        .select("*")
        .eq("patient_id", patientId)
        .order("assessed_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as Assessment) ?? null;
    },
  });
}

/**
 * Run the risk engine locally + persist a new assessment row with portal and family metadata.
 */
export async function createAssessment(p: IntakePayload): Promise<{ patientId: string; assessment: Assessment }> {
  const engine = runRiskEngine(p);
  const portalType = p.portal_type || "community";
  const familyCode = p.family_code;
  const relationship = p.relationship;

  // Step 1 — insert patient (try with new metadata columns, fallback if cloud schema hasn't migrated)
  let pat: Patient | null = null;
  let perr: any = null;

  try {
    const res = await supabase
      .from("patients")
      .insert({
        full_name: p.full_name,
        age: p.age,
        sex: p.sex,
        village: p.village ?? null,
        phone: p.phone ?? null,
        portal_type: portalType,
        family_code: familyCode ?? null,
        relationship: relationship ?? null,
      })
      .select()
      .single();
    pat = res.data as Patient;
    perr = res.error;
  } catch (err) {
    perr = err;
  }

  // Fallback insert without extra SQL columns if Supabase schema migration is pending
  if (perr || !pat) {
    const resFallback = await supabase
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
    if (resFallback.error || !resFallback.data) {
      throw resFallback.error ?? new Error("Failed to create patient");
    }
    pat = resFallback.data as Patient;
  }

  // Save metadata to hybrid local adapter so separation is 100% guaranteed everywhere
  savePatientMetadata(pat.id, { portal_type: portalType, family_code: familyCode, relationship });
  pat = { ...pat, portal_type: portalType, family_code: familyCode, relationship };

  // Step 2 — insert assessment
  let ass: Assessment | null = null;
  const { data: assData, error: aerr } = await supabase
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

  if (aerr || !assData) {
    // If working offline/demo in personal portal, create synthetic local assessment
    if (portalType === "personal" || portalType === "family") {
      ass = {
        id: `local-ass-${Date.now()}`,
        patient_id: pat.id,
        assessed_at: new Date().toISOString(),
        band: engine.decision.band,
        scores: engine.scores,
        factors: engine.factors,
        gap_labs: engine.gap_labs,
        specialist: engine.specialist,
        decision: engine.decision,
        confidence: engine.confidence,
        notes: null,
      };
    } else {
      throw aerr ?? new Error("Failed to save assessment");
    }
  } else {
    ass = assData as Assessment;
  }

  if (portalType === "personal" || portalType === "family") {
    saveLocalPersonalMember(pat, ass!);
  }

  return { patientId: pat.id, assessment: ass! };
}

/** Realtime subscription to a single patient's latest assessment. */
export function useAssessmentLive(patientId: string | undefined) {
  const q = useAssessment(patientId);
  useEffect(() => {
    if (!patientId || patientId.startsWith("demo-") || patientId.startsWith("local-")) return;
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
