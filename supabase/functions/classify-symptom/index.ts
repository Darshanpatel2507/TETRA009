// Supabase Edge Function: classify-symptom
// Maps patient descriptions strictly to fixed taxonomy IDs without diagnosing or scoring.

// @ts-ignore: Deno runtime URL import not recognized by Node TS compiler
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

declare const Deno: any;

const SYMPTOM_TAXONOMY = [
  "face_droop",
  "arm_weakness",
  "speech_difficulty",
  "chest_pain",
  "shortness_of_breath",
  "polyuria",
  "polydipsia",
  "fatigue",
  "swelling_legs"
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { description, apiKey } = await req.json();
    const key = apiKey || Deno.env.get("GEMINI_API_KEY") || "";

    if (!description || typeof description !== "string") {
      return new Response(JSON.stringify({ error: "No description provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!key) {
      // Return unclassified fallback when offline/no API key exists
      return new Response(JSON.stringify({
        results: [{
          symptomId: "unclassified",
          confidence: "low",
          matchedPhrase: description.trim()
        }]
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const prompt = `Map this patient description to ONLY the symptom IDs in this fixed list: [${SYMPTOM_TAXONOMY.join(", ")}].
Return matches with a confidence level ('high' or 'low').
If nothing matches confidently, return symptomId 'unclassified' with confidence 'low'.
Never infer a diagnosis. Never invent a symptom not implied by the text. Never estimate severity beyond what's stated.

Patient description: "${description}"

Return ONLY valid JSON format:
{
  "results": [
    {
      "symptomId": "one of the fixed IDs or unclassified",
      "confidence": "high or low",
      "matchedPhrase": "the exact words from the patient description that triggered this match"
    }
  ]
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Classification failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
