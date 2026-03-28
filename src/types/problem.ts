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
  description: string;
  lat: number;
  lng: number;
}
