"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnalysisWithMetrics, ANALYSIS_TYPES } from "@/lib/types/database";
import { Badge } from "@/components/ui/Badge";

interface AnalysisRow extends AnalysisWithMetrics {
  depositions?: {
    material_system: string | null;
    date: string;
    researcher: string;
  };
}

interface Props {
  analyses: AnalysisRow[];
}

const controlClass =
  "px-3 py-1.5 border border-[var(--border-subtle)] rounded-md text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]";

export function AnalysisListView({ analyses }: Props) {
  const [typeFilter, setTypeFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");
  const [search, setSearch] = useState("");

  const operators = useMemo(() => {
    const ops = analyses
      .map((a) => a.operator_name)
      .filter(Boolean) as string[];
    return [...new Set(ops)].sort();
  }, [analyses]);

  const filtered = useMemo(() => {
    return analyses.filter((a) => {
      if (typeFilter && a.analysis_type !== typeFilter) return false;
      if (operatorFilter && a.operator_name !== operatorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const searchable = [
          a.analysis_type,
          a.operator_name,
          a.notes,
          a.depositions?.material_system,
          a.depositions?.researcher,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [analyses, typeFilter, operatorFilter, search]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search analyses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${controlClass} w-64`}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={controlClass}
        >
          <option value="">All Types</option>
          {ANALYSIS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
          className={controlClass}
        >
          <option value="">All Operators</option>
          {operators.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Deposition
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Key Metrics
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-3 py-2.5">
                    <Link href={`/analyses/${a.id}`}>
                      <Badge type={a.analysis_type} />
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    <Link
                      href={`/depositions/${a.deposition_id}`}
                      className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
                    >
                      {a.depositions?.material_system ?? "\u2014"}{" "}
                      <span className="text-[var(--text-muted)]">
                        {a.depositions?.date}
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text-secondary)]">
                    {a.operator_name ?? "\u2014"}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-muted)] font-mono">
                    {a.analysis_metrics
                      .slice(0, 3)
                      .map(
                        (m) =>
                          `${m.metric_name}: ${m.metric_value}${m.metric_unit ? " " + m.metric_unit : ""}`
                      )
                      .join(", ")}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-muted)]">
                    {a.uploaded_at
                      ? new Date(a.uploaded_at).toLocaleDateString()
                      : "\u2014"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-[var(--text-muted)]"
                  >
                    No analyses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-2">
        {filtered.length} of {analyses.length} analyses
      </div>
    </div>
  );
}
