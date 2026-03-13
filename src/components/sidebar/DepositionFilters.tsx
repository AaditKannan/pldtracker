"use client";

import { DepositionWithAnalyses, FilterState } from "@/lib/types/database";
import { Button } from "@/components/ui/Button";
import { EMPTY_FILTERS } from "@/lib/types/database";

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  depositions: DepositionWithAnalyses[];
}

const selectClass =
  "flex-1 min-w-0 px-2 py-1.5 border border-[var(--border-subtle)] rounded text-xs bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]";

const inputClass =
  "flex-1 min-w-0 px-2 py-1.5 border border-[var(--border-subtle)] rounded text-xs bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]";

export function DepositionFilters({ filters, onChange, depositions }: Props) {
  const researchers = unique(depositions.map((d) => d.researcher));
  const materials = unique(
    depositions.map((d) => d.material_system).filter(Boolean) as string[]
  );
  const substrates = unique(
    depositions.map((d) => d.substrate_type).filter(Boolean) as string[]
  );

  const set = (field: keyof FilterState, value: string) =>
    onChange({ ...filters, [field]: value });

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <select
          value={filters.researcher}
          onChange={(e) => set("researcher", e.target.value)}
          className={selectClass}
        >
          <option value="">All Researchers</option>
          {researchers.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={filters.material_system}
          onChange={(e) => set("material_system", e.target.value)}
          className={selectClass}
        >
          <option value="">All Materials</option>
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <select
          value={filters.substrate_type}
          onChange={(e) => set("substrate_type", e.target.value)}
          className={selectClass}
        >
          <option value="">All Substrates</option>
          {substrates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mt-1">
        Temperature Range
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min °C"
          value={filters.temperature_min}
          onChange={(e) => set("temperature_min", e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Max °C"
          value={filters.temperature_max}
          onChange={(e) => set("temperature_max", e.target.value)}
          className={inputClass}
        />
      </div>
      <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mt-1">
        Laser Energy Range
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min mJ"
          value={filters.energy_min}
          onChange={(e) => set("energy_min", e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Max mJ"
          value={filters.energy_max}
          onChange={(e) => set("energy_max", e.target.value)}
          className={inputClass}
        />
      </div>
      {hasFilters && (
        <Button
          variant="secondary"
          className="text-xs py-1 mt-1"
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)].sort();
}
