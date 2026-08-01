// supabase/functions/narrate-alert
// Standalone edge function for SMS-style alert text — invoked when a
// new high/critical assessment lands in realtime. Returns a single
// short string (≤160 chars) suitable for an SMS gateway or push
// notification body.
//
// Same constraints as narrate-risk: Gemini only writes copy from the
// already-decided numbers. The band is NEVER chosen by Gemini.

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FALLBACKS: Record<string, Record<string, string>> = {
  en: {
    critical: "URGENT: refer now. Suspected acute event.",
    high:     "48-hour referral recommended for this patient.",
    moderate: "Routine, flagged. Follow up within 2 weeks.",
    low:      "Routine annual review.",
  },
  hi: {
    critical: "अति-आवश्यक: तुरंत रेफर करें।",
    high:     "48 घंटे में रेफरल सुझाया गया।",
    moderate: "रूटीन, फ़्लैग किया गया। 2 सप्ताह में अनुवर्ती।",
    low:      "रूटीन वार्षिक समीक्षा।",
  },
  gu: {
    critical: "તાત્કાલિક: તરત જ રેફર કરો.",
    high:     "48 કલાકમાં રેફરલ સૂચવેલ છે.",
    moderate: "રૂટીન, ફ્લેગ કરેલ. 2 અઠવાડિયામાં ફોલો-અપ.",
    low:      "રૂટીન વાર્ષિક સમીક્ષા.",
  },
};

const fallback = (band: string, lang: string) => {
  const m = FALLBACKS[lang] ?? FALLBACKS.en;
  return m[band] ?? m.low;
};

Deno.serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let payload: any = {};
  try { payload = await req.json(); } catch { return json({ text: "" }, 400); }

  const a = payload?.assessment;
  if (!a) return json({ text: "" }, 400);

  const lang = (payload?.lang ?? "en") as "en" | "hi" | "gu";
  const band = a?.decision?.band ?? "low";
  const key = Deno.env.get("GEMINI_API_KEY") || payload?.apiKey;
  if (!key) {
    return json({ text: fallback(band, lang), source: "fallback" });
  }

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: buildSmsPrompt(a, lang) }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 80 },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const raw = String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
    const text = raw.length > 0 && raw.length <= 160 ? raw : fallback(band, lang);
    return json({ text, source: "gemini" });
  } catch {
    return json({ text: fallback(band, lang), source: "fallback" });
  }
});

function buildSmsPrompt(a: any, lang: string): string {
  return [
    "Write ONE SMS-style alert line (max 160 chars) for a clinician.",
    "Output language: " + lang + ".",
    "Do NOT include the band name verbatim. Be specific about action.",
    "Use only the numbers provided.",
    "",
    `Band: ${a?.decision?.band ?? "low"}`,
    `Action: ${a?.decision?.action ?? "—"}`,
    `Patient age/sex: ${a?.patient?.age ?? "?"} / ${a?.patient?.sex ?? "?"}`,
  ].join("\n");
}

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
