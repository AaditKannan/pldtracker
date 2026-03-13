import { DepositionWithAnalyses } from "../types/database";
import { getLatestMetricValue } from "./metrics";

export interface ExplorerDataPoint {
  deposition_id: string;
  date: string;
  researcher: string;
  material_system: string | null;
  substrate_type: string | null;
  substrate_temperature: number | null;
  oxygen_pressure: number | null;
  laser_fluence: number | null;
  pulse_count: number | null;
  quality_rating: number | null;
  radial_distance: number | null;
  x_position: number | null;
  y_position: number | null;
  angle: number | null;
  // Analysis metrics (flattened)
  fwhm: number | null;
  rms_roughness: number | null;
  film_thickness: number | null;
  d33: number | null;
  resistivity: number | null;
  lattice_parameter: number | null;
  [key: string]: string | number | null | undefined;
}

export interface AxisOption {
  value: string;
  label: string;
  group: "Deposition" | "Metrics";
}

export const AXIS_OPTIONS: AxisOption[] = [
  { value: "substrate_temperature", label: "Temperature (°C)", group: "Deposition" },
  { value: "oxygen_pressure", label: "O₂ Pressure (mTorr)", group: "Deposition" },
  { value: "laser_fluence", label: "Laser Fluence (J/cm²)", group: "Deposition" },
  { value: "pulse_count", label: "Pulse Count", group: "Deposition" },
  { value: "quality_rating", label: "Quality Rating", group: "Deposition" },
  { value: "radial_distance", label: "Radial Distance (mm)", group: "Deposition" },
  { value: "angle", label: "Angle (°)", group: "Deposition" },
  { value: "fwhm", label: "FWHM (deg)", group: "Metrics" },
  { value: "rms_roughness", label: "Roughness (nm)", group: "Metrics" },
  { value: "film_thickness", label: "Film Thickness (nm)", group: "Metrics" },
  { value: "d33", label: "d33 (pm/V)", group: "Metrics" },
  { value: "resistivity", label: "Resistivity (Ω·cm)", group: "Metrics" },
  { value: "lattice_parameter", label: "Lattice Parameter (Å)", group: "Metrics" },
];

export const COLOR_BY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "material_system", label: "Material" },
  { value: "researcher", label: "Researcher" },
  { value: "quality_rating", label: "Quality" },
] as const;

export function flattenDepositionsForExplorer(
  depositions: DepositionWithAnalyses[]
): ExplorerDataPoint[] {
  return depositions.map((dep) => ({
    deposition_id: dep.id,
    date: dep.date,
    researcher: dep.researcher,
    material_system: dep.material_system,
    substrate_type: dep.substrate_type,
    substrate_temperature: dep.substrate_temperature,
    oxygen_pressure: dep.oxygen_pressure,
    laser_fluence: dep.laser_fluence,
    pulse_count: dep.pulse_count,
    quality_rating: dep.quality_rating,
    radial_distance: dep.radial_distance,
    x_position: dep.x_position,
    y_position: dep.y_position,
    angle: dep.angle,
    fwhm: getLatestMetricValue(dep, "fwhm"),
    rms_roughness: getLatestMetricValue(dep, "rms_roughness"),
    film_thickness: getLatestMetricValue(dep, "film_thickness"),
    d33: getLatestMetricValue(dep, "d33"),
    resistivity: getLatestMetricValue(dep, "resistivity"),
    lattice_parameter: getLatestMetricValue(dep, "lattice_parameter"),
  }));
}
