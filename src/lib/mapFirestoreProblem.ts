import type { Complexity, Theme, UrbanProblem } from "../types/problem";

const THEMES: Theme[] = [
  "transport",
  "waste",
  "environment",
  "housing",
  "safety",
  "infrastructure",
];

const COMPLEXITIES: Complexity[] = ["simple", "moderate", "complex"];

const DEFAULT_CENTER = { lat: 45.815399, lng: 15.966568 };

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Map a Firestore document (from upload_to_firebase.py) to UrbanProblem.
 */
export function firestoreDocToUrbanProblem(
  docId: string,
  data: Record<string, unknown>
): UrbanProblem | null {
  const title = str(data.title);
  if (!title.trim()) return null;

  const rawTheme = str(data.theme);
  const theme: Theme = THEMES.includes(rawTheme as Theme)
    ? (rawTheme as Theme)
    : "infrastructure";

  const rawCx = str(data.complexity);
  const complexity: Complexity = COMPLEXITIES.includes(rawCx as Complexity)
    ? (rawCx as Complexity)
    : "moderate";

  const priorityRaw =
    data.priorityScore ?? data.priority_score ?? data.priority;
  let priorityScore = num(priorityRaw);
  if (priorityScore === null) priorityScore = 50;
  priorityScore = Math.max(0, Math.min(100, Math.round(priorityScore)));

  let lat = num(data.lat);
  let lng = num(data.lng);
  if (lat === null || lng === null) {
    lat = DEFAULT_CENTER.lat;
    lng = DEFAULT_CENTER.lng;
  }

  return {
    id: docId,
    title,
    category: str(data.category) || "Grad",
    theme,
    priorityScore,
    complexity,
    neighborhood: str(data.neighborhood) || "Zagreb",
    description: str(data.description),
    lat,
    lng,
  };
}
