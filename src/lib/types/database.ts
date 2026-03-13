export interface Deposition {
  id: string;
  created_at: string;
  date: string;
  researcher: string;
  material_system: string | null;
  film_composition: string | null;
  substrate_type: string | null;
  substrate_orientation: string | null;
  substrate_size: string | null;
  laser_fluence: number | null;
  laser_frequency: number | null;
  oxygen_pressure: number | null;
  substrate_temperature: number | null;
  target_material: string | null;
  target_rotation_speed: number | null;
  target_substrate_distance: number | null;
  pulse_count: number | null;
  x_position: number | null;
  y_position: number | null;
  radial_distance: number | null;
  angle: number | null;
  notes: string | null;
  quality_rating: number | null;
  run_id: string | null;
  laser_energy_mj: number | null;
  deposition_time_min: number | null;
  heater_current_a: number | null;
  post_deposition_pressure_torr: number | null;
  cooling_rate_c_per_min: number | null;
}

export type DepositionInsert = Omit<Deposition, "id" | "created_at">;

// --- Analysis types ---

export const ANALYSIS_TYPES = [
  "XRD",
  "AFM",
  "PFM",
  "SEM",
  "XRR",
  "Raman",
  "profilometry",
  "electrical",
  "Other",
] as const;

export type AnalysisType = (typeof ANALYSIS_TYPES)[number];

export interface Analysis {
  id: string;
  deposition_id: string;
  analysis_type: AnalysisType;
  uploaded_at: string;
  operator_name: string | null;
  notes: string | null;
  raw_file_url: string | null;
  preview_file_url: string | null;
}

export type AnalysisInsert = Omit<Analysis, "id" | "uploaded_at">;

export interface AnalysisMetric {
  id: string;
  analysis_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string | null;
}

export type AnalysisMetricInsert = Omit<AnalysisMetric, "id">;

export interface AnalysisImage {
  id: string;
  analysis_id: string;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  scan_size_value: number | null;
  scan_size_unit: string | null;
  image_order: number;
  highlight_note: string | null;
  created_at: string;
}

export interface AnalysisWithMetrics extends Analysis {
  analysis_metrics: AnalysisMetric[];
  analysis_images?: AnalysisImage[];
}

export interface DepositionWithAnalyses extends Deposition {
  analyses: AnalysisWithMetrics[];
}

// --- Metric definitions per analysis type ---

export interface MetricDefinition {
  name: string;
  label: string;
  unit: string;
}

export const METRIC_DEFINITIONS: Record<AnalysisType, MetricDefinition[]> = {
  XRD: [
    { name: "peak_position", label: "Peak Position", unit: "2θ (deg)" },
    { name: "fwhm", label: "FWHM", unit: "deg" },
    { name: "lattice_parameter", label: "Lattice Parameter", unit: "Å" },
    { name: "d_spacing", label: "d-spacing", unit: "Å" },
  ],
  AFM: [
    { name: "rms_roughness", label: "RMS Roughness", unit: "nm" },
    { name: "peak_to_valley", label: "Peak-to-Valley", unit: "nm" },
    { name: "scan_size", label: "Scan Size", unit: "µm" },
    { name: "grain_size", label: "Avg Grain Size", unit: "nm" },
  ],
  PFM: [
    { name: "d33", label: "d33", unit: "pm/V" },
    { name: "coercive_voltage", label: "Coercive Voltage", unit: "V" },
  ],
  SEM: [
    { name: "magnification", label: "Magnification", unit: "x" },
    { name: "film_thickness", label: "Film Thickness", unit: "nm" },
  ],
  XRR: [
    { name: "thickness", label: "Thickness", unit: "nm" },
    { name: "density", label: "Density", unit: "g/cm³" },
    { name: "roughness", label: "Surface Roughness", unit: "nm" },
  ],
  Raman: [
    { name: "peak_position", label: "Peak Position", unit: "cm⁻¹" },
    { name: "peak_intensity", label: "Peak Intensity", unit: "a.u." },
    { name: "fwhm", label: "FWHM", unit: "cm⁻¹" },
  ],
  profilometry: [
    { name: "step_height", label: "Step Height", unit: "nm" },
    { name: "film_thickness", label: "Film Thickness", unit: "nm" },
  ],
  electrical: [
    { name: "resistivity", label: "Resistivity", unit: "Ω·cm" },
    { name: "sheet_resistance", label: "Sheet Resistance", unit: "Ω/sq" },
    { name: "carrier_density", label: "Carrier Density", unit: "cm⁻³" },
  ],
  Other: [],
};

// --- Color modes ---

export type ColorMode =
  | "quality"
  | "material"
  | "temperature"
  | "pressure"
  | "roughness"
  | "fwhm"
  | "thickness";

// --- Filter state ---

export interface FilterState {
  researcher: string;
  material_system: string;
  substrate_type: string;
  temperature_min: string;
  temperature_max: string;
  pressure_min: string;
  pressure_max: string;
  search: string;
}

export const EMPTY_FILTERS: FilterState = {
  researcher: "",
  material_system: "",
  substrate_type: "",
  temperature_min: "",
  temperature_max: "",
  pressure_min: "",
  pressure_max: "",
  search: "",
};

export interface AnalysisFilterState {
  analysis_type: string;
  operator_name: string;
  search: string;
}

export const EMPTY_ANALYSIS_FILTERS: AnalysisFilterState = {
  analysis_type: "",
  operator_name: "",
  search: "",
};

export const DISK_RADIUS = 38.1; // 3-inch heater stage, mm
