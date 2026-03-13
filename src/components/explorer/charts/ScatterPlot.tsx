"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExplorerDataPoint, computeAdaptiveDomain, AXIS_OPTIONS } from "@/lib/utils/explorer-data";
import { linearRegression, formatEquation, RegressionResult } from "@/lib/utils/statistics";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  data: ExplorerDataPoint[];
  xField: string;
  yField: string;
  xLabel: string;
  yLabel: string;
  getColor: (d: ExplorerDataPoint) => string;
  /** Whether to show the best-fit line (controlled by parent toggle) */
  showBestFit?: boolean;
  /** Whether to show the deposition-sequence connected line */
  showSequence?: boolean;
}

interface PlotPoint {
  x: number;         // data value
  y: number;         // data value
  px: number;        // pixel x
  py: number;        // pixel y
  id: string;        // deposition_id
  runId: string;     // display run identifier
  date: string;
  material: string;
  researcher: string;
  color: string;
  seqIndex: number;  // chronological order index
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MARGIN = { top: 16, right: 24, bottom: 52, left: 56 };
const CHART_H = 400;

// ─── Axis tick helpers ────────────────────────────────────────────────────────

function niceTicks(min: number, max: number, count = 6): number[] {
  const range = max - min;
  if (range === 0) return [min];
  const rawStep = range / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceSteps = [1, 2, 2.5, 5, 10];
  const step = niceSteps.map((s) => s * mag).find((s) => s >= rawStep) ?? rawStep;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.001; v += step) {
    const rounded = Math.round(v / step) * step;
    if (rounded >= min - step * 0.001 && rounded <= max + step * 0.001) {
      ticks.push(Number(rounded.toPrecision(10)));
    }
  }
  return ticks;
}

function formatTick(v: number): string {
  if (Math.abs(v) >= 10000 || (Math.abs(v) < 0.01 && v !== 0)) {
    return v.toExponential(1);
  }
  // Remove trailing zeros after decimal
  return parseFloat(v.toPrecision(4)).toString();
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ScatterPlot({
  data,
  xField,
  yField,
  xLabel,
  yLabel,
  getColor,
  showBestFit = true,
  showSequence = false,
}: Props) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    point: PlotPoint;
    svgX: number;
    svgY: number;
  } | null>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  // Measure container width via ResizeObserver
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w);
    });
    ro.observe(node);
  }, []);

  const plotW = containerWidth - MARGIN.left - MARGIN.right;
  const plotH = CHART_H - MARGIN.top - MARGIN.bottom;

  // ── Domain / scale ─────────────────────────────────────────────────────────

  const xValues = useMemo(
    () => data.map((d) => d[xField] as number).filter((v) => v != null && isFinite(v)),
    [data, xField]
  );
  const yValues = useMemo(
    () => data.map((d) => d[yField] as number).filter((v) => v != null && isFinite(v)),
    [data, yField]
  );

  const [xMin, xMax] = useMemo(() => computeAdaptiveDomain(xValues, xField), [xValues, xField]);
  const [yMin, yMax] = useMemo(() => computeAdaptiveDomain(yValues, yField), [yValues, yField]);

  const xTicks = useMemo(() => niceTicks(xMin, xMax, 7), [xMin, xMax]);
  const yTicks = useMemo(() => niceTicks(yMin, yMax, 6), [yMin, yMax]);

  const scaleX = useCallback(
    (v: number) => ((v - xMin) / (xMax - xMin)) * plotW,
    [xMin, xMax, plotW]
  );
  const scaleY = useCallback(
    (v: number) => plotH - ((v - yMin) / (yMax - yMin)) * plotH,
    [yMin, yMax, plotH]
  );

  // ── Build plot points (sorted chronologically for sequence line) ───────────

  const sortedData = useMemo(() => {
    return [...data]
      .filter((d) => d[xField] != null && d[yField] != null)
      .sort((a, b) => {
        const dateDiff = (a.date ?? "").localeCompare(b.date ?? "");
        if (dateDiff !== 0) return dateDiff;
        return (a.deposition_id ?? "").localeCompare(b.deposition_id ?? "");
      });
  }, [data, xField, yField]);

  const points: PlotPoint[] = useMemo(() => {
    return sortedData.map((d, i) => {
      const xv = d[xField] as number;
      const yv = d[yField] as number;
      return {
        x: xv,
        y: yv,
        px: scaleX(xv),
        py: scaleY(yv),
        id: d.deposition_id,
        runId: d.deposition_id,
        date: d.date,
        material: d.material_system ?? "—",
        researcher: d.researcher,
        color: getColor(d),
        seqIndex: i,
      };
    });
  }, [sortedData, xField, yField, scaleX, scaleY, getColor]);

  // ── Regression / best fit ──────────────────────────────────────────────────

  const regression: RegressionResult | null = useMemo(() => {
    if (!showBestFit || points.length < 3) return null;
    return linearRegression(points.map((p) => ({ x: p.x, y: p.y })));
  }, [points, showBestFit]);

  const trendLine = useMemo(() => {
    if (!regression) return null;
    const xUnit = (xMax - xMin) * 0.02;
    const x1 = xMin + xUnit;
    const x2 = xMax - xUnit;
    return {
      x1: scaleX(x1),
      y1: scaleY(regression.slope * x1 + regression.intercept),
      x2: scaleX(x2),
      y2: scaleY(regression.slope * x2 + regression.intercept),
    };
  }, [regression, xMin, xMax, scaleX, scaleY]);

  // ── Sequence polyline ──────────────────────────────────────────────────────

  const sequencePolyline = useMemo(() => {
    if (!showSequence || points.length < 2) return "";
    return points.map((p) => `${p.px},${p.py}`).join(" ");
  }, [points, showSequence]);

  // ── Tooltip unit helpers ───────────────────────────────────────────────────

  const xUnit = AXIS_OPTIONS.find((o) => o.value === xField)?.label ?? xLabel;
  const yUnit = AXIS_OPTIONS.find((o) => o.value === yField)?.label ?? yLabel;

  // ── Early exit ────────────────────────────────────────────────────────────

  if (points.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-[var(--text-muted)]">
        No data points with both axes available
      </div>
    );
  }

  // ── Tooltip positioning ────────────────────────────────────────────────────

  // Keep tooltip on screen: flip to left if too close to right edge, flip up if near bottom
  const getTooltipStyle = (): React.CSSProperties => {
    if (!tooltip) return {};
    const tx = tooltip.svgX + MARGIN.left;
    const ty = tooltip.svgY + MARGIN.top;
    const flipX = tx > containerWidth * 0.6;
    const flipY = ty > CHART_H * 0.6;
    return {
      position: "absolute",
      left: flipX ? undefined : tx + 12,
      right: flipX ? containerWidth - tx + 12 : undefined,
      top: flipY ? undefined : ty + 12,
      bottom: flipY ? CHART_H - ty + 12 : undefined,
      pointerEvents: "none",
    };
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* SVG chart */}
      <div ref={containerRef} className="relative" style={{ height: CHART_H }}>
        <svg
          ref={svgRef}
          width={containerWidth}
          height={CHART_H}
          style={{ display: "block" }}
        >
          {/* Plot area group */}
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* Grid lines */}
            {xTicks.map((v) => (
              <line
                key={`gx-${v}`}
                x1={scaleX(v)}
                y1={0}
                x2={scaleX(v)}
                y2={plotH}
                stroke="#3a3a3a"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}
            {yTicks.map((v) => (
              <line
                key={`gy-${v}`}
                x1={0}
                y1={scaleY(v)}
                x2={plotW}
                y2={scaleY(v)}
                stroke="#3a3a3a"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}

            {/* Axis lines */}
            <line x1={0} y1={plotH} x2={plotW} y2={plotH} stroke="#6b6b6b" strokeWidth={1} />
            <line x1={0} y1={0} x2={0} y2={plotH} stroke="#6b6b6b" strokeWidth={1} />

            {/* X tick marks + labels */}
            {xTicks.map((v) => (
              <g key={`xt-${v}`} transform={`translate(${scaleX(v)},${plotH})`}>
                <line y2={5} stroke="#6b6b6b" />
                <text
                  y={18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#888888"
                >
                  {formatTick(v)}
                </text>
              </g>
            ))}

            {/* Y tick marks + labels */}
            {yTicks.map((v) => (
              <g key={`yt-${v}`} transform={`translate(0,${scaleY(v)})`}>
                <line x2={-5} stroke="#6b6b6b" />
                <text
                  x={-8}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="#888888"
                >
                  {formatTick(v)}
                </text>
              </g>
            ))}

            {/* X axis label */}
            <text
              x={plotW / 2}
              y={plotH + 42}
              textAnchor="middle"
              fontSize={12}
              fill="#aaaaaa"
            >
              {xLabel}
            </text>

            {/* Y axis label */}
            <text
              x={-(plotH / 2)}
              y={-42}
              textAnchor="middle"
              fontSize={12}
              fill="#aaaaaa"
              transform="rotate(-90)"
            >
              {yLabel}
            </text>

            {/* Deposition sequence line (drawn below points) */}
            {showSequence && sequencePolyline && (
              <polyline
                points={sequencePolyline}
                fill="none"
                stroke="#60a5fa"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
            )}

            {/* Best-fit trend line (dashed, drawn below points) */}
            {trendLine && (
              <line
                x1={trendLine.x1}
                y1={trendLine.y1}
                x2={trendLine.x2}
                y2={trendLine.y2}
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                strokeOpacity={0.85}
              />
            )}

            {/* Data points */}
            {points.map((p) => (
              <circle
                key={p.id}
                cx={p.px}
                cy={p.py}
                r={5}
                fill={p.color}
                fillOpacity={0.82}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={0.5}
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/depositions/${p.id}`)}
                onMouseEnter={(e) => {
                  const svgRect = svgRef.current?.getBoundingClientRect();
                  if (!svgRect) return;
                  setTooltip({
                    point: p,
                    svgX: p.px,
                    svgY: p.py,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}

            {/* Sequence index numbers (small) rendered on top if sequence active */}
            {showSequence &&
              points.map((p, i) => (
                <text
                  key={`seq-${p.id}`}
                  x={p.px + 7}
                  y={p.py - 6}
                  fontSize={8}
                  fill="#60a5fa"
                  fillOpacity={0.7}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {i + 1}
                </text>
              ))}
          </g>

          {/* Overlay legend (top-right inside plot area) */}
          {(showSequence || trendLine) && (
            <g transform={`translate(${MARGIN.left + plotW - 4},${MARGIN.top + 4})`}>
              {showSequence && (
                <g>
                  <line
                    x1={-90}
                    y1={8}
                    x2={-70}
                    y2={8}
                    stroke="#60a5fa"
                    strokeWidth={2}
                    strokeOpacity={0.5}
                  />
                  <text x={-66} y={12} fontSize={10} fill="#aaaaaa">
                    Deposition sequence
                  </text>
                </g>
              )}
              {trendLine && (
                <g transform={showSequence ? "translate(0,18)" : "translate(0,0)"}>
                  <line
                    x1={-90}
                    y1={8}
                    x2={-70}
                    y2={8}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    strokeOpacity={0.85}
                  />
                  <text x={-66} y={12} fontSize={10} fill="#aaaaaa">
                    Best fit
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Floating tooltip */}
        {tooltip && (
          <div
            style={getTooltipStyle()}
            className="z-50 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2.5 shadow-xl text-xs min-w-[160px]"
          >
            <div className="font-semibold text-white mb-1">{tooltip.point.runId}</div>
            <div className="space-y-0.5">
              <div className="text-[#aaaaaa]">{tooltip.point.date}</div>
              <div className="text-[#d1d5db]">
                <span className="text-[#888]">{xUnit}:</span>{" "}
                <span className="font-mono">{formatTick(tooltip.point.x)}</span>
              </div>
              <div className="text-[#d1d5db]">
                <span className="text-[#888]">{yUnit}:</span>{" "}
                <span className="font-mono">{formatTick(tooltip.point.y)}</span>
              </div>
              <div className="pt-0.5 border-t border-[#3a3a3a] mt-1 text-[#aaaaaa]">
                {tooltip.point.material}
              </div>
              <div className="text-[#aaaaaa]">{tooltip.point.researcher}</div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics bar */}
      {regression && (
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-[var(--text-muted)]">
          <span>
            <span className="text-[var(--text-secondary)] font-medium">r</span>{" "}
            = {regression.r.toFixed(3)}
          </span>
          <span>
            <span className="text-[var(--text-secondary)] font-medium">R²</span>{" "}
            = {regression.r2.toFixed(3)}
          </span>
          <span className="font-mono">{formatEquation(regression)}</span>
          <span>n = {regression.n}</span>
          {Math.abs(regression.r) >= 0.7 && (
            <span className="text-[var(--accent-success)] font-medium">
              Strong {regression.r > 0 ? "positive" : "negative"} correlation
            </span>
          )}
          {Math.abs(regression.r) >= 0.4 && Math.abs(regression.r) < 0.7 && (
            <span className="text-[var(--accent-warning)] font-medium">
              Moderate {regression.r > 0 ? "positive" : "negative"} correlation
            </span>
          )}
          {Math.abs(regression.r) < 0.4 && (
            <span className="text-[var(--text-muted)]">Weak correlation</span>
          )}
        </div>
      )}
    </div>
  );
}
