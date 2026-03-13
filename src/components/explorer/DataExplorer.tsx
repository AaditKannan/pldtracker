"use client";

import { useState, useMemo } from "react";
import {
  ExplorerDataPoint,
  AXIS_OPTIONS,
  COLOR_BY_OPTIONS,
} from "@/lib/utils/explorer-data";
import { MATERIAL_COLORS, QUALITY_COLORS } from "@/lib/utils/colors";
import { linearRegression } from "@/lib/utils/statistics";
import { ScatterPlot } from "./charts/ScatterPlot";
import { Histogram } from "./charts/Histogram";

type PlotType = "scatter" | "histogram";

const RESEARCHER_COLORS: Record<string, string> = {
  "Alice Chen": "#8b5cf6",
  "Bob Martinez": "#3b82f6",
  "Priya Sharma": "#f59e0b",
  "Aadit": "#22c55e",
};

const controlClass =
  "w-full px-2 py-1.5 border border-[var(--border-subtle)] rounded text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]";

export function DataExplorer({ data }: { data: ExplorerDataPoint[] }) {
  const [plotType, setPlotType] = useState<PlotType>("scatter");
  const [xAxis, setXAxis] = useState("substrate_temperature");
  const [yAxis, setYAxis] = useState("fwhm");
  const [colorBy, setColorBy] = useState("material_system");
  const [showTrend, setShowTrend] = useState(true);
  const [filterMaterial, setFilterMaterial] = useState("");
  const [filterResearcher, setFilterResearcher] = useState("");

  const materials = useMemo(
    () =>
      [...new Set(data.map((d) => d.material_system).filter(Boolean))].sort(),
    [data]
  );
  const researchers = useMemo(
    () => [...new Set(data.map((d) => d.researcher))].sort(),
    [data]
  );

  const filtered = useMemo(() => {
    let result = data;
    if (filterMaterial) {
      result = result.filter((d) => d.material_system === filterMaterial);
    }
    if (filterResearcher) {
      result = result.filter((d) => d.researcher === filterResearcher);
    }
    return result;
  }, [data, filterMaterial, filterResearcher]);

  const scatterData = useMemo(() => {
    return filtered.filter(
      (d) => d[xAxis] != null && d[yAxis] != null
    );
  }, [filtered, xAxis, yAxis]);

  const histogramData = useMemo(() => {
    return filtered.filter((d) => d[xAxis] != null);
  }, [filtered, xAxis]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const xVals = filtered.map((d) => d[xAxis] as number).filter((v) => v != null && !isNaN(v));
    const yVals = filtered.map((d) => d[yAxis] as number).filter((v) => v != null && !isNaN(v));

    const stats = (vals: number[]) => {
      if (vals.length === 0) return null;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sorted = [...vals].sort((a, b) => a - b);
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      const variance = vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / vals.length;
      const std = Math.sqrt(variance);
      return {
        n: vals.length,
        mean: Number(mean.toPrecision(4)),
        median: Number(median.toPrecision(4)),
        std: Number(std.toPrecision(3)),
        min: Number(Math.min(...vals).toPrecision(4)),
        max: Number(Math.max(...vals).toPrecision(4)),
      };
    };

    return { x: stats(xVals), y: stats(yVals) };
  }, [filtered, xAxis, yAxis]);

  const getColor = (d: ExplorerDataPoint): string => {
    if (colorBy === "material_system") {
      return MATERIAL_COLORS[d.material_system ?? ""] ?? "#6366f1";
    }
    if (colorBy === "researcher") {
      return RESEARCHER_COLORS[d.researcher] ?? "#6b7280";
    }
    if (colorBy === "quality_rating") {
      const q = d.quality_rating;
      if (q == null || q < 1 || q > 5) return "#6b7280";
      return QUALITY_COLORS[q - 1];
    }
    return "#6366f1";
  };

  const xLabel =
    AXIS_OPTIONS.find((o) => o.value === xAxis)?.label ?? xAxis;
  const yLabel =
    AXIS_OPTIONS.find((o) => o.value === yAxis)?.label ?? yAxis;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4">
        {/* Plot type */}
        <div className="flex gap-2 mb-4">
          {(["scatter", "histogram"] as PlotType[]).map((t) => (
            <button
              key={t}
              onClick={() => setPlotType(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                plotType === t
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {t === "scatter" ? "Scatter Plot" : "Histogram"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* X Axis */}
          <div>
            <label className="block text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
              X Axis
            </label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className={controlClass}
            >
              <optgroup label="Deposition">
                {AXIS_OPTIONS.filter((o) => o.group === "Deposition").map(
                  (o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label="Metrics">
                {AXIS_OPTIONS.filter((o) => o.group === "Metrics").map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Y Axis (scatter only) */}
          {plotType === "scatter" && (
            <div>
              <label className="block text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Y Axis
              </label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className={controlClass}
              >
                <optgroup label="Deposition">
                  {AXIS_OPTIONS.filter((o) => o.group === "Deposition").map(
                    (o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup label="Metrics">
                  {AXIS_OPTIONS.filter((o) => o.group === "Metrics").map(
                    (o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    )
                  )}
                </optgroup>
              </select>
            </div>
          )}

          {/* Color by */}
          <div>
            <label className="block text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Color By
            </label>
            <select
              value={colorBy}
              onChange={(e) => setColorBy(e.target.value)}
              className={controlClass}
            >
              {COLOR_BY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Material
              </label>
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className={controlClass}
              >
                <option value="">All</option>
                {materials.map((m) => (
                  <option key={m} value={m!}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Researcher
              </label>
              <select
                value={filterResearcher}
                onChange={(e) => setFilterResearcher(e.target.value)}
                className={controlClass}
              >
                <option value="">All</option>
                {researchers.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4">
        {/* Trend toggle (scatter only) */}
        {plotType === "scatter" && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowTrend(!showTrend)}
              className={`px-3 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                showTrend
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              }`}
            >
              Trend Line
            </button>
          </div>
        )}

        {plotType === "scatter" ? (
          <ScatterPlot
            data={scatterData}
            xField={xAxis}
            yField={yAxis}
            xLabel={xLabel}
            yLabel={yLabel}
            getColor={getColor}
            showTrend={showTrend}
          />
        ) : (
          <Histogram
            data={histogramData}
            field={xAxis}
            label={xLabel}
            getColor={getColor}
          />
        )}

        <div className="text-xs text-[var(--text-muted)] mt-2 text-center">
          {plotType === "scatter"
            ? `${scatterData.length} data points`
            : `${histogramData.length} data points`}{" "}
          | Click a point to view deposition
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Summary Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <StatBlock label={xLabel} stats={summaryStats.x} />
          {plotType === "scatter" && (
            <StatBlock label={yLabel} stats={summaryStats.y} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  stats,
}: {
  label: string;
  stats: { n: number; mean: number; median: number; std: number; min: number; max: number } | null;
}) {
  if (!stats) {
    return (
      <div className="text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-secondary)]">{label}</span>
        <span className="ml-2">— no data</span>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
        <Stat name="Mean" value={stats.mean} />
        <Stat name="Median" value={stats.median} />
        <Stat name="Std Dev" value={stats.std} />
        <Stat name="Min" value={stats.min} />
        <Stat name="Max" value={stats.max} />
        <Stat name="N" value={stats.n} />
      </div>
    </div>
  );
}

function Stat({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-muted)]">{name}</span>
      <span className="font-mono text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
