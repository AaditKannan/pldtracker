"use client";

import { useMemo } from "react";
import { DepositionWithAnalyses, ColorMode, DISK_RADIUS } from "@/lib/types/database";
import { getLatestMetricValue } from "@/lib/utils/metrics";

interface Props {
  depositions: DepositionWithAnalyses[];
  metricName: string;
  colorMode: ColorMode;
}

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  weight: number;
}

const GRID_SIZE = 15;
const R = DISK_RADIUS;

function getHeatmapColor(value: number, mode: ColorMode): string {
  let t: number;
  switch (mode) {
    case "roughness":
      t = Math.min(1, value / 15);
      return interpolateRGB(t, [34, 197, 94], [239, 68, 68]);
    case "fwhm":
      t = Math.min(1, value / 0.5);
      return interpolateRGB(t, [34, 197, 94], [239, 68, 68]);
    case "thickness":
      t = Math.min(1, value / 500);
      return interpolateRGB(t, [191, 219, 254], [30, 58, 95]);
    case "quality":
      t = Math.min(1, (value - 1) / 4);
      return interpolateRGB(t, [239, 68, 68], [34, 197, 94]);
    default:
      return "rgb(148,163,184)";
  }
}

function interpolateRGB(t: number, from: number[], to: number[]): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function DiskHeatmap({ depositions, metricName, colorMode }: Props) {
  const cells = useMemo(() => {
    const step = (R * 2) / GRID_SIZE;
    const result: HeatmapCell[] = [];

    // Extract data points with metric values
    const points: { x: number; y: number; value: number }[] = [];
    for (const dep of depositions) {
      if (dep.x_position == null || dep.y_position == null) continue;
      let val: number | null;
      if (metricName === "quality_rating") {
        val = dep.quality_rating;
      } else {
        val = getLatestMetricValue(dep, metricName);
      }
      if (val == null) continue;
      points.push({ x: dep.x_position, y: dep.y_position, value: val });
    }

    if (points.length === 0) return [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const cx = -R + step * (i + 0.5);
        const cy = -R + step * (j + 0.5);

        if (Math.sqrt(cx * cx + cy * cy) > R) continue;

        let weightedSum = 0;
        let totalWeight = 0;

        for (const p of points) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const w = 1 / Math.max(dist * dist, 0.5);
          weightedSum += p.value * w;
          totalWeight += w;
        }

        if (totalWeight > 0) {
          result.push({
            x: cx,
            y: cy,
            value: weightedSum / totalWeight,
            weight: Math.min(totalWeight, 10),
          });
        }
      }
    }

    return result;
  }, [depositions, metricName]);

  if (cells.length === 0) return null;

  const step = (R * 2) / GRID_SIZE;

  return (
    <g>
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x - step / 2}
          y={-cell.y - step / 2}
          width={step}
          height={step}
          fill={getHeatmapColor(cell.value, colorMode)}
          fillOpacity={Math.min(0.5, cell.weight / 10 * 0.4 + 0.1)}
          rx={0.5}
        />
      ))}
    </g>
  );
}
