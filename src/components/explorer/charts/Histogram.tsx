"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ExplorerDataPoint } from "@/lib/utils/explorer-data";

interface Props {
  data: ExplorerDataPoint[];
  field: string;
  label: string;
  getColor: (d: ExplorerDataPoint) => string;
}

const BIN_COUNT = 12;

export function Histogram({ data, field, label }: Props) {
  const bins = useMemo(() => {
    const values = data
      .map((d) => d[field] as number)
      .filter((v) => v != null && !isNaN(v));

    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
      return [{ range: `${min}`, count: values.length, min, max: min }];
    }

    const step = (max - min) / BIN_COUNT;
    const result: { range: string; count: number; min: number; max: number }[] =
      [];

    for (let i = 0; i < BIN_COUNT; i++) {
      const binMin = min + step * i;
      const binMax = min + step * (i + 1);
      const count = values.filter(
        (v) => (i === BIN_COUNT - 1 ? v >= binMin && v <= binMax : v >= binMin && v < binMax)
      ).length;
      result.push({
        range: `${binMin.toPrecision(3)}`,
        count,
        min: binMin,
        max: binMax,
      });
    }

    return result;
  }, [data, field]);

  if (bins.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-[var(--text-muted)]">
        No data available for histogram
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={bins}
        margin={{ top: 10, right: 30, bottom: 30, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
        <XAxis
          dataKey="range"
          label={{
            value: label,
            position: "insideBottom",
            offset: -15,
            fontSize: 12,
            fill: "#9ba1b0",
          }}
          tick={{ fontSize: 10, fill: "#6b7280" }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          stroke="#363a4a"
        />
        <YAxis
          label={{
            value: "Count",
            angle: -90,
            position: "insideLeft",
            offset: 5,
            fontSize: 12,
            fill: "#9ba1b0",
          }}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          allowDecimals={false}
          stroke="#363a4a"
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs rounded-lg px-3 py-2 shadow-lg border border-[var(--border-subtle)]">
                <div>
                  Range: {Number(d.min).toPrecision(3)} \u2013{" "}
                  {Number(d.max).toPrecision(3)}
                </div>
                <div className="font-semibold">Count: {d.count}</div>
              </div>
            );
          }}
        />
        <Bar dataKey="count" fill="#6366f1" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
