// supabase/functions/narrate-risk
// Edge function — calls Gemini 2.0-flash to produce TWO pieces of
// human-readable text from an already-decided assessment:
//
//   narration  — 2-3 sentence clinician-style summary
//   alert      — short, action-oriented one-liner
//
// The clinical band/action is NEVER chosen by Gemini — it is taken
// verbatim from the deterministic engine's output that the client
// passes in. Gemini only rephrases.
//
// IMPORTANT: GEMINI_API_KEY is read via Deno.env inside the Supabase
// runtime. Set it with:
//   supabase secrets set GEMINI_API_KEY=...

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const fallbackNarration = (decision: any) =>
  `An urgent review is recommended based on the current risk markers (${decision?.action ?? "—"})`;

const fallbackAlert = (decision: any, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    en: {
      critical: "Refer immediately — suspected acute event.",
      high:     "48-hour referral recommended.",
      moderate: "Routine, flagged — follow up within 2 weeks.",
      low:      "Routine annual review.",
    },
    hi: {
      critical: "तुरंत रेफर करें — गंभीर घटना का संदेह।",
      high:     "48 घंटे में रेफरल सुझाया गया।",
      moderate: "रूटीन, फ़्लैग किया गया — 2 सप्ताह में अनुवर्ती।",
      low:      "रूटीन वार्षिक समीक्षा।",
    },
    gu: {
      critical: "તાત્કાલિક રેફરલ — ગંભીર ઘટનાની શક્યતા.",
      high:     "48 કલાકમાં રેફરલ સૂચવેલ છે.",
      moderate: "રૂટીન, ફ્લેગ કરેલ — 2 અઠવાડિયામાં ફોલો-અપ.",
      low:      "રૂટીન વાર્ષિક સમીક્ષા.",
    },
  };
  const band = (decision?.band ?? "low") as keyof typeof map.en;
  return map[lang]?.[band] ?? map.en[band];
};

Deno.serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    return json({ narration: "", alert: "" }, 400);
  }

  const a = payload?.assessment;
  if (!a) return json({ narration: "", alert: "" }, 400);

  const lang = (payload?.lang ?? "en") as "en" | "hi" | "gu";
  const key = Deno.env.get("GEMINI_API_KEY") || payload?.apiKey;
  if (!key) {
    return json({
      narration: fallbackNarration(a.decision),
      alert: fallbackAlert(a.decision, lang),
      source: "fallback",
    });
  }

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: buildPrompt(a, lang) }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 320 },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const raw = String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
    return json(parseStructured(raw, a, lang, /*source*/ "gemini"));
  } catch {
    return json({
      narration: fallbackNarration(a.decision),
      alert: fallbackAlert(a.decision, lang),
      source: "fallback",
    });
  }
});

function parseStructured(raw: string, a: any, lang: string, source: string) {
  // We ask Gemini to return NARRATION: ... | ALERT: ...
  // If it doesn't follow the format, fall back to a sensible split.
  if (!raw) {
    return {
      narration: fallbackNarration(a.decision),
      alert: fallbackAlert(a.decision, lang),
      source,
    };
  }
  const narrationMatch = raw.match(/NARRATION:\s*([\s\S]*?)\s*(?:ALERT:|$)/i);
  const alertMatch = raw.match(/ALERT:\s*([\s\S]*?)$/i);
  const narration = narrationMatch?.[1]?.trim() || raw;
  const alert = alertMatch?.[1]?.trim() || fallbackAlert(a.decision, lang);
  return { narration, alert, source };
}

function buildPrompt(a: any, lang: string): string {
  return [
    "You are a clinical scribe summarising a deterministic risk assessment.",
    "Write 2 fields and return them on their own lines, exactly:",
    "NARRATION: <2-3 sentences in plain language for a rural primary-healthcare worker>",
    "ALERT: <one short imperative sentence, max ~120 chars, action-oriented>",
    "",
    `Language: ${lang}. Use the same language for both fields.`,
    "Use only the numbers provided. Do not invent findings.",
    "",
    `Patient: age ${a?.patient?.age ?? "?"}, sex ${a?.patient?.sex ?? "?"}`,
    `Overall urgency: ${a?.decision?.band ?? "?"} — ${a?.decision?.action ?? "?"}`,
    `Conditions: ${JSON.stringify(a?.scores ?? {})}`,
    `Factors: ${JSON.stringify(a?.factors ?? [])}`,
  ].join("\n");
}

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
