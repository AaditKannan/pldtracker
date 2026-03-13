"use client";

import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ExplorerDataPoint } from "@/lib/utils/explorer-data";

interface Props {
  data: ExplorerDataPoint[];
  xField: string;
  yField: string;
  xLabel: string;
  yLabel: string;
  getColor: (d: ExplorerDataPoint) => string;
}

export function ScatterPlot({
  data,
  xField,
  yField,
  xLabel,
  yLabel,
  getColor,
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

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-[var(--text-muted)]">
        No data points with both axes available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
        <XAxis
          dataKey="x"
          type="number"
          name={xLabel}
          label={{ value: xLabel, position: "insideBottom", offset: -15, fontSize: 12, fill: "#9ba1b0" }}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          stroke="#363a4a"
        />
        <YAxis
          dataKey="y"
          type="number"
          name={yLabel}
          label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 5, fontSize: 12, fill: "#9ba1b0" }}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          stroke="#363a4a"
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const d = payload[0].payload;
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
      </ScatterChart>
    </ResponsiveContainer>
  );
}
