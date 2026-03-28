import type { Complexity, Theme, UrbanProblem } from "../types/problem";

export interface FilterState {
  priorityMin: number;
  priorityMax: number;
  complexity: "all" | Complexity;
  neighborhood: string; // "" = all
  themes: Set<Theme>; // empty = all themes
}

export function filterProblems(
  problems: UrbanProblem[],
  f: FilterState
): UrbanProblem[] {
  return problems.filter((p) => {
    if (p.priorityScore < f.priorityMin || p.priorityScore > f.priorityMax) {
      return false;
    }
    if (f.complexity !== "all" && p.complexity !== f.complexity) {
      return false;
    }
    if (f.neighborhood && p.neighborhood !== f.neighborhood) {
      return false;
    }
    if (f.themes.size > 0 && !f.themes.has(p.theme)) {
      return false;
    }
    return true;
  });
}
