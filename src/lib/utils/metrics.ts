import { DepositionWithAnalyses } from "../types/database";

export function getLatestMetricValue(
  dep: DepositionWithAnalyses,
  metricName: string
): number | null {
  const allMetrics = dep.analyses.flatMap((a) => a.analysis_metrics);
  const matching = allMetrics.filter((m) => m.metric_name === metricName);
  return matching.length > 0
    ? matching[matching.length - 1].metric_value
    : null;
}

export function getMetricSummary(dep: DepositionWithAnalyses): Record<string, { value: number; unit: string | null }> {
  const summary: Record<string, { value: number; unit: string | null }> = {};
  for (const analysis of dep.analyses) {
    for (const m of analysis.analysis_metrics) {
      summary[m.metric_name] = { value: m.metric_value, unit: m.metric_unit };
    }
  }
  return summary;
}

export const KEY_METRICS = [
  { name: "fwhm", label: "FWHM", format: (v: number) => `${v.toFixed(3)} deg` },
  { name: "rms_roughness", label: "Roughness", format: (v: number) => `${v.toFixed(1)} nm` },
  { name: "film_thickness", label: "Thickness", format: (v: number) => `${v.toFixed(0)} nm` },
  { name: "d33", label: "d33", format: (v: number) => `${v.toFixed(1)} pm/V` },
  { name: "resistivity", label: "Resistivity", format: (v: number) => `${v.toExponential(1)} Ω·cm` },
  { name: "lattice_parameter", label: "Lattice Param", format: (v: number) => `${v.toFixed(3)} Å` },
] as const;
