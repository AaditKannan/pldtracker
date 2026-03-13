"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { ExplorerDataPoint, computeAdaptiveDomain } from "@/lib/utils/explorer-data";

interface Props {
  data: ExplorerDataPoint[];
  field: string;
  label: string;
  getColor: (d: ExplorerDataPoint) => string;
}

// ─── Bin count: Sturges' rule, clamped to [5, 25] ─────────────────────────

function sturgesBinCount(n: number): number {
  if (n <= 1) return 5;
  return Math.min(25, Math.max(5, Math.ceil(1 + 3.322 * Math.log10(n))));
}

// ─── Nice tick helpers ─────────────────────────────────────────────────────

function formatTick(v: number): string {
  if (Math.abs(v) >= 10000 || (Math.abs(v) < 0.01 && v !== 0)) {
    return v.toExponential(1);
  }
  return parseFloat(v.toPrecision(4)).toString();
}

function niceTicks(min: number, max: number, count = 6): number[] {
  const range = max - min;
  if (range === 0) return [min];
  const rawStep = range / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceSteps = [1, 2, 2.5, 5, 10];
  const step =
    niceSteps.map((s) => s * mag).find((s) => s >= rawStep) ?? rawStep;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.001; v += step) {
    const rounded = Math.round(v / step) * step;
    if (
      rounded >= min - step * 0.001 &&
      rounded <= max + step * 0.001
    ) {
      ticks.push(Number(rounded.toPrecision(10)));
    }
  }
  return ticks;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const MARGIN = { top: 16, right: 24, bottom: 52, left: 52 };
const CHART_H = 400;

// ─── Component ─────────────────────────────────────────────────────────────

export function Histogram({ data, field, label }: Props) {
  const [containerWidth, setContainerWidth] = useState(700);
  const [tooltipBin, setTooltipBin] = useState<{
    binMin: number;
    binMax: number;
    count: number;
    barX: number;
    barY: number;
  } | null>(null);

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

  // ── Bins computation ────────────────────────────────────────────────────

  const { bins, domainMin, domainMax, countMax } = useMemo(() => {
    const values = data
      .map((d) => d[field] as number)
      .filter((v) => v != null && isFinite(v));

    if (values.length === 0) {
      return { bins: [], domainMin: 0, domainMax: 1, countMax: 1 };
    }

    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);

    // All-same value — show a single centered bar
    if (rawMin === rawMax) {
      return {
        bins: [{ binMin: rawMin, binMax: rawMin, count: values.length }],
        domainMin: rawMin - 1,
        domainMax: rawMax + 1,
        countMax: values.length,
      };
    }

    const binCount = sturgesBinCount(values.length);
    const step = (rawMax - rawMin) / binCount;

    const result: { binMin: number; binMax: number; count: number }[] = [];
    for (let i = 0; i < binCount; i++) {
      const binMin = rawMin + step * i;
      const binMax = rawMin + step * (i + 1);
      const count = values.filter((v) =>
        i === binCount - 1 ? v >= binMin && v <= binMax : v >= binMin && v < binMax
      ).length;
      result.push({ binMin, binMax, count });
    }

    const [domMin, domMax] = computeAdaptiveDomain(values, field);

    return {
      bins: result,
      domainMin: domMin,
      domainMax: domMax,
      countMax: Math.max(...result.map((b) => b.count), 1),
    };
  }, [data, field]);

  // ── Scales ─────────────────────────────────────────────────────────────

  const scaleX = useCallback(
    (v: number) => ((v - domainMin) / (domainMax - domainMin)) * plotW,
    [domainMin, domainMax, plotW]
  );
  const scaleY = useCallback(
    (count: number) => plotH - (count / countMax) * plotH,
    [countMax, plotH]
  );
  const barW = useCallback(
    (binMin: number, binMax: number) => scaleX(binMax) - scaleX(binMin),
    [scaleX]
  );

  const xTicks = useMemo(
    () => niceTicks(domainMin, domainMax, 7),
    [domainMin, domainMax]
  );
  const yTicks = useMemo(
    () =>
      niceTicks(0, countMax, 5).filter(
        (v) => v === Math.floor(v)
      ),
    [countMax]
  );

  // ── Tooltip position ────────────────────────────────────────────────────

  const getTooltipStyle = (): React.CSSProperties => {
    if (!tooltipBin) return {};
    const tx = tooltipBin.barX + MARGIN.left;
    const ty = tooltipBin.barY + MARGIN.top;
    const flipX = tx > containerWidth * 0.6;
    const flipY = ty > CHART_H * 0.55;
    return {
      position: "absolute",
      left: flipX ? undefined : tx + 8,
      right: flipX ? containerWidth - tx + 8 : undefined,
      top: flipY ? undefined : ty - 8,
      bottom: flipY ? CHART_H - ty + 8 : undefined,
      pointerEvents: "none",
    };
  };

  // ── Early exit ──────────────────────────────────────────────────────────

  if (bins.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-[var(--text-muted)]">
        No data available for histogram
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative" style={{ height: CHART_H }}>
      <svg width={containerWidth} height={CHART_H} style={{ display: "block" }}>
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

          {/* Bars */}
          {bins.map((bin, i) => {
            const bx = scaleX(bin.binMin);
            const bw = Math.max(1, barW(bin.binMin, bin.binMax) - 1);
            const by = scaleY(bin.count);
            const bh = plotH - by;
            return (
              <rect
                key={i}
                x={bx}
                y={by}
                width={bw}
                height={bh}
                fill="#6366f1"
                fillOpacity={0.75}
                rx={2}
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setTooltipBin({
                    binMin: bin.binMin,
                    binMax: bin.binMax,
                    count: bin.count,
                    barX: bx + bw / 2,
                    barY: by,
                  })
                }
                onMouseLeave={() => setTooltipBin(null)}
              />
            );
          })}

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
                {v}
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
            {label}
          </text>

          {/* Y axis label */}
          <text
            x={-(plotH / 2)}
            y={-38}
            textAnchor="middle"
            fontSize={12}
            fill="#aaaaaa"
            transform="rotate(-90)"
          >
            Count
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltipBin && (
        <div
          style={getTooltipStyle()}
          className="z-50 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 shadow-xl text-xs"
        >
          <div className="text-[#aaaaaa]">
            {formatTick(tooltipBin.binMin)} – {formatTick(tooltipBin.binMax)}
          </div>
          <div className="font-semibold text-white">
            Count: {tooltipBin.count}
          </div>
        </div>
      )}
    </div>
  );
}
