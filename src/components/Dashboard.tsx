"use client";

import { useState, useMemo, useCallback } from "react";
import { DepositionWithAnalyses, ColorMode, FilterState, EMPTY_FILTERS } from "@/lib/types/database";
import { DiskVisualization } from "@/components/disk/DiskVisualization";
import { DepositionList } from "@/components/sidebar/DepositionList";
import { DepositionFilters } from "@/components/sidebar/DepositionFilters";
import { SearchBar } from "@/components/sidebar/SearchBar";
import { applyFilters } from "@/lib/utils/filters";

interface Props {
  depositions: DepositionWithAnalyses[];
}

function StatsBar({ depositions }: { depositions: DepositionWithAnalyses[] }) {
  const count = depositions.length;
  const rated = depositions.filter((d) => d.quality_rating != null);
  const avgQuality =
    rated.length > 0
      ? (rated.reduce((s, d) => s + d.quality_rating!, 0) / rated.length).toFixed(1)
      : "—";

  const materialCounts: Record<string, number> = {};
  depositions.forEach((d) => {
    const m = d.material_system ?? "Unknown";
    materialCounts[m] = (materialCounts[m] || 0) + 1;
  });
  const topMaterial =
    Object.entries(materialCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-[var(--bg-elevated)] rounded-lg text-xs mb-4">
      <div>
        <span className="text-[var(--text-muted)]">Showing </span>
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">{count}</span>
      </div>
      <div>
        <span className="text-[var(--text-muted)]">Avg Quality </span>
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">{avgQuality}</span>
      </div>
      <div className="truncate">
        <span className="text-[var(--text-muted)]">Top </span>
        <span className="font-semibold text-[var(--text-primary)]">{topMaterial}</span>
      </div>
    </div>
  );
}

export function Dashboard({ depositions }: Props) {
  const [colorMode, setColorMode] = useState<ColorMode>("quality");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const filtered = useMemo(
    () => applyFilters(depositions, filters),
    [depositions, filters]
  );

  const handleSearchChange = useCallback(
    (search: string) => setFilters((prev) => ({ ...prev, search })),
    []
  );

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <aside className="w-[360px] border-r border-[var(--border-subtle)] flex flex-col bg-[var(--bg-surface)] shrink-0">
        <div className="p-3 border-b border-[var(--border-subtle)] flex flex-col gap-2">
          <SearchBar value={filters.search} onChange={handleSearchChange} />
          <DepositionFilters
            filters={filters}
            onChange={setFilters}
            depositions={depositions}
          />
        </div>
        <DepositionList
          depositions={filtered}
          highlightId={highlightId}
          onHover={setHighlightId}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center pt-6 px-8 pb-8 overflow-auto">
        <div className="w-full max-w-[700px]">
          <StatsBar depositions={filtered} />
          <DiskVisualization
            depositions={filtered}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
            highlightId={highlightId}
          />
        </div>
      </main>
    </div>
  );
}
