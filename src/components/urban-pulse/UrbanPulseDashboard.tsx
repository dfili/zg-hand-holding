"use client";

import { useEffect, useMemo, useState } from "react";

import { MOCK_PROBLEMS } from "../../data/problems";
import { filterProblems, type FilterState } from "../../lib/filterProblems";
import type { Complexity, Theme } from "../../types/problem";
import { FilterSidebar } from "./FilterSidebar";
import { MapPanel } from "./MapPanel";
import { ProblemList } from "./ProblemList";
import { ResizableMapListSplit } from "./ResizableMapListSplit";

export function UrbanPulseDashboard() {
  const [priorityMin, setPriorityMin] = useState(0);
  const [priorityMax, setPriorityMax] = useState(100);
  const [complexity, setComplexity] = useState<"all" | Complexity>("all");
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [themes, setThemes] = useState<Set<Theme>>(new Set());

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panToVersion, setPanToVersion] = useState(0);

  const filterState: FilterState = useMemo(
    () => ({
      priorityMin,
      priorityMax,
      complexity,
      neighborhood,
      themes,
    }),
    [priorityMin, priorityMax, complexity, neighborhood, themes]
  );

  const visible = useMemo(
    () => filterProblems(MOCK_PROBLEMS, filterState),
    [filterState]
  );

  useEffect(() => {
    if (selectedId && !visible.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [visible, selectedId]);

  function toggleTheme(t: Theme) {
    setThemes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function handleListSelect(id: string) {
    setSelectedId(id);
    setPanToVersion((v) => v + 1);
  }

  function handleMarkerSelect(id: string) {
    setSelectedId(id);
  }

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-zinc-950 lg:flex-row">
      <FilterSidebar
        priorityMin={priorityMin}
        priorityMax={priorityMax}
        onPriorityMin={setPriorityMin}
        onPriorityMax={setPriorityMax}
        complexity={complexity}
        onComplexity={setComplexity}
        neighborhood={neighborhood}
        onNeighborhood={setNeighborhood}
        neighborhoodQuery={neighborhoodQuery}
        onNeighborhoodQuery={setNeighborhoodQuery}
        themes={themes}
        onToggleTheme={toggleTheme}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ResizableMapListSplit
          map={
            <MapPanel
              problems={visible}
              selectedId={selectedId}
              onMarkerSelect={handleMarkerSelect}
              panToVersion={panToVersion}
            />
          }
          list={
            <ProblemList
              problems={visible}
              selectedId={selectedId}
              onSelect={handleListSelect}
            />
          }
        />
      </div>
    </div>
  );
}
