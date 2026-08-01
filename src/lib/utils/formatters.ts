/** Tiny string helpers used across the UI. Centralised so copy is consistent. */

export function bandLabel(b: "low" | "moderate" | "high" | "critical"): string {
  switch (b) {
    case "low":
      return "Routine";
    case "moderate":
      return "Routine, flagged";
    case "high":
      return "48-hour referral";
    case "critical":
      return "Immediate";
  }
}

export function csvEscape(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function downloadBlob(filename: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function classNames(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(" ");
}
