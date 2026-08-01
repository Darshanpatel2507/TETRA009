import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Assessment, Patient, Referral } from "../types";
import { useToast } from "../components/ui/Toast";
import { useLang } from "../context/LanguageContext";
import { bandLabel } from "../lib/utils/formatters";
import { mergePatientWithMetadata, DEMO_FAMILY_MEMBERS, getLocalPersonalMembers, lookupDemoOrLocalPatient } from "../lib/metadataAdapter";

export interface DashboardRow {
  patient: Patient;
  last_assessment: Assessment | null;
  last_referral: Referral | null;
}

/**
 * Feeds dashboards with both community database records and personal family members.
 * Proper filtering by portal_type is applied in the views.
 */
export function usePatients() {
  const q = useQuery<DashboardRow[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      let dbPatients: Patient[] = [];
      try {
        const { data: patients, error } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && patients) {
          dbPatients = patients as Patient[];
        }
      } catch (e) {
        console.warn("Could not load from Supabase patients, using local storage/demo fallback", e);
      }

      const ids = dbPatients.map((p) => p.id);

      let assessments: Assessment[] = [];
      let referrals: Referral[] = [];
      if (ids.length > 0) {
        try {
          const resAss = await supabase
            .from("risk_assessments")
            .select("*")
            .in("patient_id", ids)
            .order("assessed_at", { ascending: false });
          assessments = (resAss.data ?? []) as Assessment[];

          const resRef = await supabase
            .from("referrals")
            .select("*")
            .in("patient_id", ids)
            .order("created_at", { ascending: false });
          referrals = (resRef.data ?? []) as Referral[];
        } catch (e) {
          console.warn("Could not load assessments/referrals from DB", e);
        }
      }

      const latestAssess = new Map<string, Assessment>();
      assessments.forEach((a) => {
        if (!latestAssess.has(a.patient_id)) latestAssess.set(a.patient_id, a);
      });

      const latestRef = new Map<string, Referral>();
      referrals.forEach((r) => {
        if (!latestRef.has(r.patient_id)) latestRef.set(r.patient_id, r);
      });

      const dbRows: DashboardRow[] = dbPatients.map((p) => ({
        patient: mergePatientWithMetadata(p),
        last_assessment: latestAssess.get(p.id) ?? null,
        last_referral: latestRef.get(p.id) ?? null,
      }));

      // Combine with local personal members and demo family members
      const existingIds = new Set(dbRows.map((r) => r.patient.id));
      const localAndDemo: DashboardRow[] = [];

      [...getLocalPersonalMembers(), ...DEMO_FAMILY_MEMBERS].forEach((m) => {
        if (!existingIds.has(m.patient.id)) {
          existingIds.add(m.patient.id);
          localAndDemo.push({
            patient: mergePatientWithMetadata(m.patient),
            last_assessment: m.assessment ?? null,
            last_referral: null,
          });
        }
      });

      return [...dbRows, ...localAndDemo];
    },
    staleTime: 30_000,
  });

  // Realtime — when a new assessment lands anywhere, refetch + toast.
  const qc = useQueryClient();
  const { push } = useToast();
  const { locale } = useLang();

  useEffect(() => {
    const channel = supabase
      .channel(`risk_assessments:insert-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "risk_assessments" },
        async (payload) => {
          const row = payload.new as Assessment;
          const isUrgent = row.band === "high" || row.band === "critical";

          let body: string | undefined = row.id.slice(0, 8);
          if (isUrgent) {
            try {
              const { data } = await supabase.functions.invoke("narrate-alert", {
                body: { assessment: row, lang: locale },
              });
              if (data?.text) body = String(data.text);
            } catch {
              body = bandLabel(row.band);
            }
          }

          push({
            kind: isUrgent ? "error" : "info",
            title: isUrgent
              ? `⚠ ${bandLabel(row.band)} — new assessment`
              : "New assessment added",
            body,
          });
          qc.invalidateQueries({ queryKey: ["patients"] });
        },
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [qc, push, locale]);

  return q;
}

/** Helper hook to obtain a patient's demographic profile (Name, age, relationship) by ID */
export function usePatient(patientId: string | undefined): Patient | null {
  const { data: rows } = usePatients();
  if (!patientId) return null;
  const row = rows?.find((r) => r.patient.id === patientId);
  if (row) return row.patient;
  const demo = lookupDemoOrLocalPatient(patientId);
  return demo.patient ?? null;
}
