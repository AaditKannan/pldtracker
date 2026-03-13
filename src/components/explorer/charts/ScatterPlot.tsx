"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ExplorerDataPoint } from "@/lib/utils/explorer-data";
import { linearRegression, formatEquation, RegressionResult } from "@/lib/utils/statistics";

interface Props {
  data: ExplorerDataPoint[];
  xField: string;
  yField: string;
  xLabel: string;
  yLabel: string;
  getColor: (d: ExplorerDataPoint) => string;
  showTrend?: boolean;
}

export function ScatterPlot({
  data,
  xField,
  yField,
  xLabel,
  yLabel,
  getColor,
  showTrend = true,
}: Props) {
  const router = useRouter();

  const chartData = data.map((d) => ({
    x: d[xField] as number,
    y: d[yField] as number,
    id: d.deposition_id,
    material: d.material_system ?? "—",
    researcher: d.researcher,
    color: getColor(d),
  }));

  const regression: RegressionResult | null = useMemo(() => {
    if (!showTrend || chartData.length < 3) return null;
    return linearRegression(chartData.map((d) => ({ x: d.x, y: d.y })));
  }, [chartData, showTrend]);

  // Trend line data (sorted by x so the line draws correctly)
  const trendData = useMemo(() => {
    if (!regression) return [];
    return regression.linePoints.sort((a, b) => a.x - b.x);
  }, [regression]);

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-[var(--text-muted)]">
        No data points with both axes available
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d0cfcc" />
          <XAxis
            dataKey="x"
            type="number"
            name={xLabel}
            label={{ value: xLabel, position: "insideBottom", offset: -15, fontSize: 12, fill: "#555555" }}
            tick={{ fontSize: 11, fill: "#999999" }}
            stroke="#b5b4b1"
            allowDuplicatedCategory={false}
          />
          <YAxis
            dataKey="y"
            type="number"
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 5, fontSize: 12, fill: "#555555" }}
            tick={{ fontSize: 11, fill: "#999999" }}
            stroke="#b5b4b1"
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const d = payload[0].payload;
              if (!d.material) return null; // Skip trend line tooltip
              return (
                <div className="bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs rounded-lg px-3 py-2 shadow-lg border border-[var(--border-subtle)]">
                  <div className="font-semibold">{d.material}</div>
                  <div className="text-[var(--text-secondary)]">{d.researcher}</div>
                  <div className="text-[var(--text-secondary)]">
                    {xLabel}: {d.x}
                  </div>
                  <div className="text-[var(--text-secondary)]">
                    {yLabel}: {d.y}
                  </div>
                </div>
              );
            }}
          />
          {/* Trend line (rendered first so dots appear on top) */}
          {trendData.length > 0 && (
            <Line
              data={trendData}
              dataKey="y"
              stroke="#999999"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
              tooltipType="none"
            />
          )}
          <Scatter
            data={chartData}
            onClick={(point) => {
              if (point && point.id) {
                router.push(`/depositions/${point.id}`);
              }
            }}
            cursor="pointer"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Statistics bar */}
      {regression && (
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-[var(--text-muted)]">
          <span>
            <span className="text-[var(--text-secondary)] font-medium">r</span> = {regression.r.toFixed(3)}
          </span>
          <span>
            <span className="text-[var(--text-secondary)] font-medium">R²</span> = {regression.r2.toFixed(3)}
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
