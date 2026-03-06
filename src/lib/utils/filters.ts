import {
  AnalysisFilterState,
  AnalysisWithMetrics,
  DepositionWithAnalyses,
  FilterState,
} from "@/lib/types/database";

export function applyFilters(
  depositions: DepositionWithAnalyses[],
  filters: FilterState
): DepositionWithAnalyses[] {
  return depositions.filter((dep) => {
    if (filters.researcher && dep.researcher !== filters.researcher)
      return false;

    if (
      filters.material_system &&
      dep.material_system !== filters.material_system
    )
      return false;

    if (filters.substrate_type && dep.substrate_type !== filters.substrate_type)
      return false;

    if (filters.temperature_min) {
      const min = parseFloat(filters.temperature_min);
      if (dep.substrate_temperature == null || dep.substrate_temperature < min)
        return false;
    }

    if (filters.temperature_max) {
      const max = parseFloat(filters.temperature_max);
      if (dep.substrate_temperature == null || dep.substrate_temperature > max)
        return false;
    }

    if (filters.pressure_min) {
      const min = parseFloat(filters.pressure_min);
      if (dep.oxygen_pressure == null || dep.oxygen_pressure < min)
        return false;
    }

    if (filters.pressure_max) {
      const max = parseFloat(filters.pressure_max);
      if (dep.oxygen_pressure == null || dep.oxygen_pressure > max)
        return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [
        dep.researcher,
        dep.material_system,
        dep.film_composition,
        dep.substrate_type,
        dep.target_material,
        dep.notes,
        dep.run_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

export function applyAnalysisFilters(
  analyses: (AnalysisWithMetrics & { depositions?: { material_system: string | null; date: string; researcher: string } })[],
  filters: AnalysisFilterState
): typeof analyses {
  return analyses.filter((a) => {
    if (filters.analysis_type && a.analysis_type !== filters.analysis_type)
      return false;

    if (filters.operator_name && a.operator_name !== filters.operator_name)
      return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [
        a.analysis_type,
        a.operator_name,
        a.notes,
        a.depositions?.material_system,
        a.depositions?.researcher,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}
