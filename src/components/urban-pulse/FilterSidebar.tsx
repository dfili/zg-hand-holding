"use client";

import type { Complexity, Theme } from "../../types/problem";
import { ZAGREB_NEIGHBORHOODS } from "../../data/zagreb";

const THEME_LABELS: Record<Theme, string> = {
  transport: "Transport",
  waste: "Waste",
  environment: "Environment",
  housing: "Housing",
  safety: "Safety",
  infrastructure: "Infrastructure",
};

const ALL_THEMES = Object.keys(THEME_LABELS) as Theme[];

export interface FilterSidebarProps {
  priorityMin: number;
  priorityMax: number;
  onPriorityMin: (v: number) => void;
  onPriorityMax: (v: number) => void;
  complexity: "all" | Complexity;
  onComplexity: (v: "all" | Complexity) => void;
  neighborhood: string;
  onNeighborhood: (v: string) => void;
  neighborhoodQuery: string;
  onNeighborhoodQuery: (v: string) => void;
  themes: Set<Theme>;
  onToggleTheme: (t: Theme) => void;
}

export function FilterSidebar({
  priorityMin,
  priorityMax,
  onPriorityMin,
  onPriorityMax,
  complexity,
  onComplexity,
  neighborhood,
  onNeighborhood,
  neighborhoodQuery,
  onNeighborhoodQuery,
  themes,
  onToggleTheme,
}: FilterSidebarProps) {
  const filteredHoods = ZAGREB_NEIGHBORHOODS.filter((n) =>
    n.toLowerCase().includes(neighborhoodQuery.trim().toLowerCase())
  );

  return (
    <aside className="flex max-h-[min(42vh,380px)] w-full shrink-0 flex-col gap-6 overflow-y-auto border-b border-zinc-800 bg-zinc-950 p-5 text-zinc-100 lg:max-h-none lg:h-svh lg:w-72 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div>
        <h1 className="font-semibold tracking-tight text-emerald-400">
          Urban Pulse
        </h1>
        <p className="mt-1 text-xs text-zinc-500">Zagreb civic signals</p>
      </div>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Priority
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="text-zinc-400">Min</span>
            <span className="font-mono text-emerald-300">{priorityMin}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={priorityMin}
            onChange={(e) => {
              const v = Number(e.target.value);
              onPriorityMin(v);
              if (v > priorityMax) onPriorityMax(v);
            }}
            className="w-full accent-emerald-500"
          />
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="text-zinc-400">Max</span>
            <span className="font-mono text-emerald-300">{priorityMax}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={priorityMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              onPriorityMax(v);
              if (v < priorityMin) onPriorityMin(v);
            }}
            className="w-full accent-emerald-500"
          />
          <p className="text-[11px] text-zinc-500">
            Show scores between {priorityMin} and {priorityMax}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Complexity
        </h2>
        <select
          value={complexity}
          onChange={(e) =>
            onComplexity(e.target.value as "all" | Complexity)
          }
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          <option value="all">All</option>
          <option value="simple">Simple</option>
          <option value="moderate">Moderate</option>
          <option value="complex">Complex</option>
        </select>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Location
        </h2>
        <input
          type="search"
          placeholder="Search neighborhoods…"
          value={neighborhoodQuery}
          onChange={(e) => onNeighborhoodQuery(e.target.value)}
          className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none"
        />
        <select
          value={neighborhood}
          onChange={(e) => onNeighborhood(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          <option value="">All neighborhoods</option>
          {filteredHoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Theme
        </h2>
        <ul className="space-y-2">
          {ALL_THEMES.map((t) => (
            <li key={t}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={themes.has(t)}
                  onChange={() => onToggleTheme(t)}
                  className="rounded border-zinc-600 accent-emerald-500"
                />
                <span>{THEME_LABELS[t]}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-zinc-500">
          None selected = show all themes
        </p>
      </section>
    </aside>
  );
}
