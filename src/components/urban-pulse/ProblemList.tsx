"use client";

import type { UrbanProblem } from "../../types/problem";

const THEME_LABELS: Record<string, string> = {
  transport: "Transport",
  waste: "Waste",
  environment: "Environment",
  housing: "Housing",
  safety: "Safety",
  infrastructure: "Infrastructure",
};

function truncate(text: string, max = 160) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export interface ProblemListProps {
  problems: UrbanProblem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProblemList({
  problems,
  selectedId,
  onSelect,
}: ProblemListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">Reports</h2>
        <p className="text-xs text-zinc-500">
          {problems.length} issue{problems.length === 1 ? "" : "s"} match filters
        </p>
      </div>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {problems.map((p) => {
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-brand/50 bg-brand/10 ring-1 ring-brand/25"
                    : "border-zinc-200 bg-zinc-50/80 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-medium text-zinc-900">
                    {p.title}
                  </span>
                  <span className="shrink-0 rounded bg-brand/15 px-2 py-0.5 font-mono text-xs text-brand">
                    {p.priorityScore}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700">
                    {p.category}
                  </span>
                  <span>{THEME_LABELS[p.theme] ?? p.theme}</span>
                  <span>·</span>
                  <span>{p.neighborhood}</span>
                </div>
                {p.summary ? (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-800">
                    <span className="font-medium text-zinc-600">Sažetak: </span>
                    {truncate(p.summary, 220)}
                  </p>
                ) : (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {truncate(p.description)}
                  </p>
                )}
              </button>
            </li>
          );
        })}
        {problems.length === 0 && (
          <li className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
            No problems match your filters.
          </li>
        )}
      </ul>
    </div>
  );
}
