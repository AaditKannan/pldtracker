"use client";

import { DepositionWithAnalyses } from "@/lib/types/database";
import { getLatestMetricValue } from "@/lib/utils/metrics";

interface Props {
  deposition: DepositionWithAnalyses;
  position: { x: number; y: number };
}

export function DiskTooltip({ deposition, position }: Props) {
  const fwhm = getLatestMetricValue(deposition, "fwhm");
  const roughness = getLatestMetricValue(deposition, "rms_roughness");
  const thickness = getLatestMetricValue(deposition, "film_thickness");

  return (
    <div
      className="absolute z-50 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none border border-[var(--border-subtle)]"
      style={{
        left: position.x + 12,
        top: position.y - 10,
      }}
    >
      <div className="font-semibold">{deposition.material_system ?? "\u2014"}</div>
      <div className="text-[var(--text-secondary)] mt-0.5">{deposition.date}</div>
      <div className="text-[var(--text-secondary)]">{deposition.researcher}</div>
      {deposition.substrate_temperature != null && (
        <div className="text-[var(--text-secondary)]">{deposition.substrate_temperature}\u00B0C</div>
      )}
      {deposition.pulse_count != null && (
        <div className="text-[var(--text-secondary)]">{deposition.pulse_count} pulses</div>
      )}
      {deposition.quality_rating != null && (
        <div className="text-[var(--text-secondary)]">
          Quality: {"\u2605".repeat(deposition.quality_rating)}
          {"\u2606".repeat(5 - deposition.quality_rating)}
        </div>
      )}
      {(fwhm != null || roughness != null || thickness != null) && (
        <div className="border-t border-[var(--border-subtle)] mt-1 pt-1">
          {fwhm != null && (
            <div className="text-[var(--text-muted)]">FWHM: {fwhm.toFixed(3)} deg</div>
          )}
          {roughness != null && (
            <div className="text-[var(--text-muted)]">Roughness: {roughness.toFixed(1)} nm</div>
          )}
          {thickness != null && (
            <div className="text-[var(--text-muted)]">Thickness: {thickness.toFixed(0)} nm</div>
          )}
        </div>
      )}
    </div>
  );
}
