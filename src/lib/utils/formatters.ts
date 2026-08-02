/** Tiny string helpers used across the UI. Centralised so copy is consistent. */

export function bandLabel(b: "low" | "moderate" | "high" | "critical" | string): string {
  switch (b) {
    case "low":
    case "none":
    case "safe":
    case "routine":
      return "All Clear";
    case "moderate":
    case "soft":
    case "needs monitoring":
      return "Needs Attention";
    case "high":
    case "firm":
    case "advanced":
    case "high alert":
      return "48 Hours";
    case "critical":
    case "immediate":
      return "Immediate";
    default:
      return "All Clear";
  }
}

export function getBandColorClass(b: string | null | undefined): string {
  if (!b) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-bold";
  const lbl = bandLabel(b);
  switch (lbl) {
    case "Immediate":
      return "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/50 font-black animate-pulse shadow-2xs";
    case "48 Hours":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/50 font-extrabold shadow-2xs";
    case "Needs Attention":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50 font-bold shadow-2xs";
    case "All Clear":
    default:
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-bold shadow-2xs";
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
