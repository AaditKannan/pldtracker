"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Deposition } from "@/lib/types/database";

interface DepositionRow extends Deposition {
  analysis_count: number;
}

interface Props {
  depositions: DepositionRow[];
}

type SortField = "date" | "material_system" | "researcher" | "substrate_temperature" | "quality_rating" | "analysis_count";
type SortDir = "asc" | "desc";

export function DepositionTable({ depositions }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = depositions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        [d.researcher, d.material_system, d.substrate_type, d.target_material, d.notes, d.run_id]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [depositions, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-secondary)] select-none"
      onClick={() => toggleSort(field)}
    >
      {label}
      {sortField === field && (
        <span className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>
      )}
    </th>
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search depositions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 border border-[var(--border-subtle)] rounded-md text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
        />
      </div>

      <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Run ID
                </th>
                <SortHeader field="date" label="Date" />
                <SortHeader field="material_system" label="Material" />
                <SortHeader field="researcher" label="Researcher" />
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Substrate
                </th>
                <SortHeader field="substrate_temperature" label="Temp (°C)" />
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  O₂ (mTorr)
                </th>
                <SortHeader field="quality_rating" label="Quality" />
                <SortHeader field="analysis_count" label="Analyses" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((dep) => (
                <tr
                  key={dep.id}
                  className="hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <td className="px-3 py-2.5 text-xs font-mono text-[var(--accent-primary)]">
                    {dep.run_id ?? ""}
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    <Link
                      href={`/depositions/${dep.id}`}
                      className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
                    >
                      {dep.date}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-sm font-medium text-[var(--text-primary)]">
                    {dep.material_system ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)]">
                    {dep.researcher}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)]">
                    {dep.substrate_type ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)] tabular-nums">
                    {dep.substrate_temperature ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)] tabular-nums">
                    {dep.oxygen_pressure ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-amber-400">
                    {dep.quality_rating != null
                      ? "★".repeat(dep.quality_rating) +
                        "☆".repeat(5 - dep.quality_rating)
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)] tabular-nums">
                    {dep.analysis_count}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-8 text-center text-sm text-[var(--text-muted)]"
                  >
                    No depositions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-2">
        {filtered.length} of {depositions.length} depositions
      </div>
    </div>
  );
}
