"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DepositionWithAnalyses, ColorMode, DISK_RADIUS } from "@/lib/types/database";
import { getColorModeLabel } from "@/lib/utils/colors";
import { DepositionDot } from "./DepositionDot";
import { DiskTooltip } from "./DiskTooltip";
import { DiskLegend } from "./DiskLegend";
import { DiskHeatmap } from "./DiskHeatmap";

interface Props {
  depositions: DepositionWithAnalyses[];
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  highlightId?: string | null;
}

const R = DISK_RADIUS;
const PAD = 8;
const VB = R + PAD;

const COLOR_MODES: ColorMode[] = [
  "quality",
  "material",
  "temperature",
  "pressure",
  "roughness",
  "fwhm",
  "thickness",
];
const GRID_CIRCLES = [10, 20, 30];

/**
 * Spread mode: redistribute dots to fill the disk evenly.
 * Preserves angle, maps radial rank to evenly-spaced radii.
 */
function computeSpreadPositions(
  depositions: DepositionWithAnalyses[]
): Map<string, { x: number; y: number }> {
  const withPos = depositions.filter(
    (d) => d.x_position != null && d.y_position != null
  );
  const sorted = [...withPos].sort((a, b) => {
    const ra = Math.sqrt((a.x_position ?? 0) ** 2 + (a.y_position ?? 0) ** 2);
    const rb = Math.sqrt((b.x_position ?? 0) ** 2 + (b.y_position ?? 0) ** 2);
    return ra - rb;
  });

  const result = new Map<string, { x: number; y: number }>();
  const n = sorted.length;
  const maxR = R * 0.82;
  const minR = 5;

  sorted.forEach((dep, i) => {
    const ox = dep.x_position ?? 0;
    const oy = dep.y_position ?? 0;
    const angle = Math.atan2(-oy, ox); // SVG y is flipped
    const spreadR = n === 1 ? maxR / 2 : minR + ((maxR - minR) * i) / (n - 1);
    result.set(dep.id, {
      x: spreadR * Math.cos(angle),
      y: spreadR * Math.sin(angle),
    });
  });

  return result;
}

export function DiskVisualization({
  depositions,
  colorMode,
  onColorModeChange,
  highlightId,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [spread, setSpread] = useState(false);

  const activeId = hoveredId ?? highlightId ?? null;
  const hoveredDep = activeId
    ? depositions.find((d) => d.id === activeId)
    : null;

  const spreadPositions = useMemo(
    () => computeSpreadPositions(depositions),
    [depositions]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  // Determine heatmap metric from color mode
  const heatmapMetric =
    colorMode === "roughness"
      ? "rms_roughness"
      : colorMode === "fwhm"
        ? "fwhm"
        : colorMode === "thickness"
          ? "film_thickness"
          : colorMode === "quality"
            ? "quality_rating"
            : null;

  return (
    <div className="flex flex-col items-center">
      {/* Color mode selector */}
      <div className="flex flex-wrap gap-1 mb-3 justify-center">
        {COLOR_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onColorModeChange(mode)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer border ${
              colorMode === mode
                ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {getColorModeLabel(mode)}
          </button>
        ))}
        <span className="w-px bg-[var(--border-default)] mx-1" />
        <button
          onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer border ${
            heatmapEnabled
              ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          }`}
        >
          Heatmap
        </button>
      </div>

      {/* Disk + Legend side by side */}
      <div className="flex items-start gap-4 w-full">
        {/* Disk SVG */}
        <div
          ref={containerRef}
          className="relative flex-1 max-w-[600px] aspect-square select-none"
          onMouseMove={handleMouseMove}
        >
          <svg
            viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
            className="w-full h-full"
          >
            {/* Wafer boundary */}
            <circle
              cx={0}
              cy={0}
              r={R}
              fill="var(--bg-surface)"
              stroke="var(--border-default)"
              strokeWidth={0.4}
            />

            {/* Concentric reference circles */}
            {GRID_CIRCLES.map((r) => (
              <circle
                key={r}
                cx={0}
                cy={0}
                r={r}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth={0.2}
                strokeDasharray="1.5 1.5"
              />
            ))}

            {/* Crosshairs */}
            <line x1={-R} y1={0} x2={R} y2={0} stroke="var(--border-subtle)" strokeWidth={0.2} />
            <line x1={0} y1={-R} x2={0} y2={R} stroke="var(--border-subtle)" strokeWidth={0.2} />

            {/* Heatmap layer */}
            {heatmapEnabled && heatmapMetric && !spread && (
              <DiskHeatmap
                depositions={depositions}
                metricName={heatmapMetric}
                colorMode={colorMode}
              />
            )}

            {/* Plume center marker */}
            <circle cx={0} cy={0} r={0.8} fill="var(--text-muted)" />

            {/* Radial labels */}
            {!spread && GRID_CIRCLES.map((r) => (
              <text
                key={r}
                x={r + 0.5}
                y={-1}
                fontSize={2.5}
                fill="var(--text-muted)"
                textAnchor="start"
              >
                {r}mm
              </text>
            ))}

            {/* Spread mode: rank labels along radius */}
            {spread && (
              <text
                x={0}
                y={-R - 2}
                fontSize={2.5}
                fill="var(--text-muted)"
                textAnchor="middle"
              >
                Spread view — angle preserved, distance exaggerated
              </text>
            )}

            {/* Deposition dots */}
            {depositions.map((dep) => {
              const sp = spread ? spreadPositions.get(dep.id) : undefined;
              return (
                <DepositionDot
                  key={dep.id}
                  deposition={dep}
                  colorMode={colorMode}
                  isHovered={activeId === dep.id}
                  onHover={setHoveredId}
                  onClick={(id) => router.push(`/depositions/${id}`)}
                  overrideX={sp?.x}
                  overrideY={sp?.y}
                />
              );
            })}
          </svg>

          {/* Spread toggle overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              onClick={() => setSpread(!spread)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                spread
                  ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {spread ? "True Pos" : "Spread"}
            </button>
          </div>

          {/* Tooltip */}
          {hoveredDep && hoveredId && (
            <DiskTooltip deposition={hoveredDep} position={mousePos} />
          )}
        </div>

        {/* Legend — always visible beside disk */}
        <div className="w-[140px] shrink-0 pt-4">
          <DiskLegend colorMode={colorMode} />
          <div className="text-xs text-[var(--text-muted)] mt-3">
            {depositions.length} deposition{depositions.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
