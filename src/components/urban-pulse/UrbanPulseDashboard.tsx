"use client";

import { useEffect, useMemo, useState } from "react";

import { filterProblems, type FilterState } from "../../lib/filterProblems";
import { initFirebaseAnalytics } from "../../lib/firebaseAnalytics";
import { useProblemsFromFirestore } from "../../hooks/useProblemsFromFirestore";
import type { Complexity, Theme } from "../../types/problem";
import { FilterSidebar } from "./FilterSidebar";
import { MapPanel } from "./MapPanel";
import { ProblemList } from "./ProblemList";
import { ResizableMapListSplit } from "./ResizableMapListSplit";

export function UrbanPulseDashboard() {
  const { problems: sourceProblems, loading, error } = useProblemsFromFirestore();

  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

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
    () => filterProblems(sourceProblems, filterState),
    [sourceProblems, filterState]
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
    <div className="relative flex h-svh w-full flex-col overflow-hidden bg-white lg:flex-row">
      {error && (
        <div
          className="absolute left-0 right-0 top-0 z-40 border-b border-amber-900/60 bg-amber-950/90 px-4 py-2 text-center text-sm text-amber-100"
          role="alert"
        >
          {error}
        </div>
      )}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm">
            Loading problems from Firestore…
          </p>
        </div>
      )}

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
