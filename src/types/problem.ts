export type Complexity = "simple" | "moderate" | "complex";

export type Theme =
  | "transport"
  | "waste"
  | "environment"
  | "housing"
  | "safety"
  | "infrastructure";

export interface UrbanProblem {
  id: string;
  title: string;
  category: string;
  theme: Theme;
  priorityScore: number;
  complexity: Complexity;
  neighborhood: string;
  /** Full post body (often HTML from Reddit). */
  description: string;
  /** Short AI or extractive summary for UI cards and map popups. */
  summary?: string;
  lat: number;
  lng: number;
}
