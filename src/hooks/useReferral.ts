import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Referral } from "../types";
import { useToast } from "../components/ui/Toast";

export function useReferrals(patientId?: string) {
  return useQuery<Referral[]>({
    enabled: !!patientId,
    queryKey: ["referrals", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Referral[];
    },
  });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: async (input: {
      patient_id: string;
      assessment_id: string;
      specialist: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("referrals")
        .insert({ ...input, status: "pending" })
        .select()
        .single();
      if (error) throw error;
      return data as Referral;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      push({ kind: "success", title: "Referral created" });
    },
  });
}

export function useUpdateReferralStatus() {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Referral["status"] }) => {
      const { data, error } = await supabase
        .from("referrals")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Referral;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["referrals"] });
      push({ kind: "success", title: `Referral ${vars.status}` });
    },
  });
}
