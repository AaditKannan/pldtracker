"use client";

import Link from "next/link";
import { DepositionWithAnalyses } from "@/lib/types/database";

interface Props {
  depositions: DepositionWithAnalyses[];
  highlightId: string | null;
  onHover: (id: string | null) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-2.5 h-2.5 ${i <= rating ? "text-amber-400" : "text-[var(--border-subtle)]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function DepositionList({ depositions, highlightId, onHover }: Props) {
  if (depositions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)] p-6">
        No depositions found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {depositions.map((dep) => (
        <Link
          key={dep.id}
          href={`/depositions/${dep.id}`}
          className={`block px-4 py-2.5 border-b border-[var(--border-subtle)] transition-colors ${
            highlightId === dep.id
              ? "bg-[var(--accent-primary)]/10 border-l-2 border-l-[var(--accent-primary)]"
              : "hover:bg-[var(--bg-hover)]"
          }`}
          onMouseEnter={() => onHover(dep.id)}
          onMouseLeave={() => onHover(null)}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-sm text-[var(--text-primary)] truncate">
              {dep.material_system ?? "Untitled"}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {dep.run_id && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary-hover)]">
                  {dep.run_id}
                </span>
              )}
              <span className="text-[10px] text-[var(--text-muted)] tabular-nums">{dep.date}</span>
            </div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
            {dep.researcher}
            {dep.substrate_type && ` · ${dep.substrate_type}`}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
            {dep.substrate_temperature != null && (
              <span>{dep.substrate_temperature}°C</span>
            )}
            {dep.oxygen_pressure != null && (
              <span>{dep.oxygen_pressure} mTorr</span>
            )}
            {dep.quality_rating != null && (
              <StarRating rating={dep.quality_rating} />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
