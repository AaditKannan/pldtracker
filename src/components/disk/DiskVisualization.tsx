"use client";

import { useState, useRef, useCallback } from "react";
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
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

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

  // Zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const activeId = hoveredId ?? highlightId ?? null;
  const hoveredDep = activeId
    ? depositions.find((d) => d.id === activeId)
    : null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (isPanning) {
        const dx = (e.clientX - panStart.current.x) / rect.width * (VB * 2) / zoom;
        const dy = (e.clientY - panStart.current.y) / rect.height * (VB * 2) / zoom;
        const maxPan = VB * (1 - 1 / zoom);
        setPan({
          x: Math.max(-maxPan, Math.min(maxPan, panStart.current.panX - dx)),
          y: Math.max(-maxPan, Math.min(maxPan, panStart.current.panY - dy)),
        });
      }
    },
    [isPanning, zoom]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      } else {
        const maxPan = VB * (1 - 1 / newZoom);
        setPan({
          x: Math.max(-maxPan, Math.min(maxPan, pan.x)),
          y: Math.max(-maxPan, Math.min(maxPan, pan.y)),
        });
      }
      setZoom(newZoom);
    },
    [zoom, pan]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    },
    [zoom, pan]
  );

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Compute viewBox from zoom/pan
  const viewSize = (VB * 2) / zoom;
  const vbX = -VB + pan.x + (VB * 2 - viewSize) / 2;
  const vbY = -VB + pan.y + (VB * 2 - viewSize) / 2;

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
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
              colorMode === mode
                ? "bg-[var(--accent-primary)] text-white"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {getColorModeLabel(mode)}
          </button>
        ))}
        <span className="w-px bg-[var(--border-subtle)] mx-1" />
        <button
          onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
            heatmapEnabled
              ? "bg-[var(--accent-primary)] text-white"
              : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          }`}
        >
          Heatmap
        </button>
      </div>

      {/* Disk SVG */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] aspect-square select-none"
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsPanning(false); }}
        style={{ cursor: isPanning ? "grabbing" : zoom > 1 ? "grab" : "default" }}
      >
        <svg
          viewBox={`${vbX} ${vbY} ${viewSize} ${viewSize}`}
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
          {heatmapEnabled && heatmapMetric && (
            <DiskHeatmap
              depositions={depositions}
              metricName={heatmapMetric}
              colorMode={colorMode}
            />
          )}

          {/* Plume center marker */}
          <circle cx={0} cy={0} r={0.8} fill="var(--text-muted)" />

          {/* Radial labels */}
          {GRID_CIRCLES.map((r) => (
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

          {/* Deposition dots */}
          {depositions.map((dep) => (
            <DepositionDot
              key={dep.id}
              deposition={dep}
              colorMode={colorMode}
              isHovered={activeId === dep.id}
              onHover={setHoveredId}
              onClick={(id) => router.push(`/depositions/${id}`)}
            />
          ))}
        </svg>

        {/* Zoom controls overlay */}
        {zoom > 1 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              onClick={() => setZoom(Math.min(MAX_ZOOM, zoom * 1.3))}
              className="w-7 h-7 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] text-sm font-bold flex items-center justify-center cursor-pointer"
            >
              +
            </button>
            <button
              onClick={() => {
                const nz = Math.max(MIN_ZOOM, zoom * 0.7);
                if (nz <= 1.05) resetZoom();
                else setZoom(nz);
              }}
              className="w-7 h-7 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] text-sm font-bold flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <button
              onClick={resetZoom}
              className="w-7 h-7 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] text-[9px] font-medium flex items-center justify-center cursor-pointer"
            >
              1:1
            </button>
          </div>
        )}

        {/* Tooltip */}
        {hoveredDep && hoveredId && (
          <DiskTooltip deposition={hoveredDep} position={mousePos} />
        )}
      </div>

      {/* Legend */}
      <div className="w-full max-w-[200px]">
        <DiskLegend colorMode={colorMode} />
      </div>

      {/* Count */}
      <div className="text-xs text-[var(--text-muted)] mt-2">
        {depositions.length} deposition{depositions.length !== 1 ? "s" : ""}
        {zoom > 1 && (
          <span className="ml-2 text-[var(--text-muted)]">{zoom.toFixed(1)}x</span>
        )}
      </div>
    </div>
  );
}
