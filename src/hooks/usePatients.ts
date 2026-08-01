import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Assessment, Patient, Referral } from "../types";
import { useToast } from "../components/ui/Toast";
import { useLang } from "../context/LanguageContext";
import { bandLabel } from "../lib/utils/formatters";

export interface DashboardRow {
  patient: Patient;
  last_assessment: Assessment | null;
  last_referral: Referral | null;
}

/**
 * Clinical dashboard hook — fetches all patients and joins their most
 * recent assessment + referral. Subscribes to realtime INSERTs on
 * risk_assessments and prepends the new row + a localised toast.
 *
 * The toast copy comes from the narrate-alert edge function so the
 * clinician sees the alert in the active UI language. The urgency
 * band itself is always set deterministically — the edge function
 * only rephrases.
 */
export function usePatients() {
  const q = useQuery<DashboardRow[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data: patients, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const ids = (patients ?? []).map((p: Patient) => p.id);

      const { data: assessments } = await supabase
        .from("risk_assessments")
        .select("*")
        .in("patient_id", ids)
        .order("assessed_at", { ascending: false });

      const { data: referrals } = await supabase
        .from("referrals")
        .select("*")
        .in("patient_id", ids)
        .order("created_at", { ascending: false });

      const latestAssess = new Map<string, Assessment>();
      (assessments ?? []).forEach((a: Assessment) => {
        if (!latestAssess.has(a.patient_id)) latestAssess.set(a.patient_id, a);
      });

      const latestRef = new Map<string, Referral>();
      (referrals ?? []).forEach((r: Referral) => {
        if (!latestRef.has(r.patient_id)) latestRef.set(r.patient_id, r);
      });

      return (patients ?? []).map((p: Patient) => ({
        patient: p,
        last_assessment: latestAssess.get(p.id) ?? null,
        last_referral: latestRef.get(p.id) ?? null,
      }));
    },
    staleTime: 60_000,
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
