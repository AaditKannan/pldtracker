import { ColorMode, DepositionWithAnalyses } from "@/lib/types/database";
import { getLatestMetricValue } from "./metrics";

const QUALITY_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

const MATERIAL_COLORS: Record<string, string> = {
  BiFeO3: "#8b5cf6",
  SrTiO3: "#3b82f6",
  PZT: "#f97316",
  BaTiO3: "#14b8a6",
  ZnO: "#84cc16",
  LaNiO3: "#ec4899",
  SrRuO3: "#f43f5e",
  "La0.7Sr0.3MnO3": "#f59e0b",
};

const GRAY = "#94a3b8";

function interpolate(t: number, from: string, to: string): string {
  const f = hexToRgb(from);
  const toC = hexToRgb(to);
  const r = Math.round(f.r + (toC.r - f.r) * t);
  const g = Math.round(f.g + (toC.g - f.g) * t);
  const b = Math.round(f.b + (toC.b - f.b) * t);
  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function getDepositionColor(
  dep: DepositionWithAnalyses,
  mode: ColorMode
): string {
  switch (mode) {
    case "quality": {
      if (!dep.quality_rating) return GRAY;
      return QUALITY_COLORS[dep.quality_rating - 1];
    }
    case "material": {
      if (!dep.material_system) return GRAY;
      return MATERIAL_COLORS[dep.material_system] ?? "#6366f1";
    }
    case "temperature": {
      if (dep.substrate_temperature == null) return GRAY;
      const t = Math.max(
        0,
        Math.min(1, (dep.substrate_temperature - 200) / 700)
      );
      return interpolate(t, "#3b82f6", "#ef4444");
    }
    case "pressure": {
      if (dep.oxygen_pressure == null) return GRAY;
      const p = Math.max(
        0,
        Math.min(1, Math.log10(dep.oxygen_pressure + 1) / 3)
      );
      return interpolate(p, "#bfdbfe", "#1e3a5f");
    }
    case "roughness": {
      const v = getLatestMetricValue(dep, "rms_roughness");
      if (v == null) return GRAY;
      const t = Math.min(1, v / 15);
      return interpolate(t, "#22c55e", "#ef4444");
    }
    case "fwhm": {
      const v = getLatestMetricValue(dep, "fwhm");
      if (v == null) return GRAY;
      const t = Math.min(1, v / 0.5);
      return interpolate(t, "#22c55e", "#ef4444");
    }
    case "thickness": {
      const v = getLatestMetricValue(dep, "film_thickness");
      if (v == null) return GRAY;
      const t = Math.min(1, v / 500);
      return interpolate(t, "#bfdbfe", "#1e3a5f");
    }
  }
}

export function getColorModeLabel(mode: ColorMode): string {
  switch (mode) {
    case "quality":
      return "Film Quality";
    case "material":
      return "Material";
    case "temperature":
      return "Temperature";
    case "pressure":
      return "O\u2082 Pressure";
    case "roughness":
      return "Roughness";
    case "fwhm":
      return "FWHM";
    case "thickness":
      return "Thickness";
  }
}

export { MATERIAL_COLORS, QUALITY_COLORS, GRAY };
