/**
 * Transform layer for converting raw JSON deposition data
 * (from handwritten notebook transcription) to the database schema.
 *
 * Usage:
 *   import data from '@/public/ashish_omar_march_2026_depositions_v2.json';
 *   const rows = data.rows.map(transformJsonRow);
 */

import { DepositionInsert } from "@/lib/types/database";
import { pidToReal } from "./temperature";

interface RawJsonRow {
  date: string;
  sample_id: string;
  stack: string;
  gc_target: string;
  duration_min: number;
  energy_mJ: string;
  frequency_Hz: string;
  pressure_mT: string;
  current: string;
  actual_temp_c: string | null;
  offset_temp_c: string | null;
  pd_pressure_torr: string | null;
  pd_ramp_c_per_min: string | null;
  pd_temp_c: string | null;
  z: string | null;
  notes: string | null;
  temp_status: string;
}

const COMPOSITION_MAP: Record<string, string> = {
  LBiO: "La-doped BiFeO3",
  STO: "SrTiO3",
  BFO: "BiFeO3",
};

function parseNum(v: string | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function parseEnergy(v: string): number | null {
  if (v.includes("-")) {
    const parts = v.split("-").map(Number);
    if (parts.length === 2 && parts.every((p) => !isNaN(p))) {
      return (parts[0] + parts[1]) / 2;
    }
  }
  return parseNum(v);
}

function parseCurrent(v: string): number | null {
  const match = v.match(/^(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function inferSubstrate(stack: string): {
  type: string;
  orientation: string;
  size: string;
  fluence: number;
} {
  if (stack.includes("STO/Si")) {
    return { type: "STO/Si", orientation: "(001)", size: "10x10 mm", fluence: 1.5 };
  }
  return { type: "DSO", orientation: "(110)", size: "5x5 mm", fluence: 2.0 };
}

function inferComposition(stack: string, gcTarget: string): string | null {
  const base = COMPOSITION_MAP[gcTarget];
  if (!base) return null;
  const pctMatch = stack.match(/^(\d+%)\s/);
  return pctMatch ? `${pctMatch[1]} ${base}` : base;
}

export function transformJsonRow(row: RawJsonRow): DepositionInsert {
  const substrate = inferSubstrate(row.stack);
  const freq = parseNum(row.frequency_Hz) ?? 0;
  const duration = row.duration_min;
  const pulseCount = freq * duration * 60;

  const actualTemp = parseNum(row.actual_temp_c);
  const offsetTemp = parseNum(row.offset_temp_c);

  let substrateTemp: number | null;
  let pidTemp: number | null;

  if (actualTemp != null) {
    substrateTemp = actualTemp;
    pidTemp = offsetTemp;
  } else if (offsetTemp != null) {
    pidTemp = offsetTemp;
    substrateTemp = pidToReal(offsetTemp);
  } else {
    substrateTemp = null;
    pidTemp = null;
  }

  const noteParts: string[] = [];
  if (offsetTemp != null && actualTemp == null) {
    noteParts.push(`PID setpoint ${offsetTemp}. Substrate temp calibrated from PID.`);
  }
  if (row.z != null) {
    noteParts.push(`z = ${row.z}.`);
  }
  if (row.notes) {
    noteParts.push(row.notes);
  }
  const pdParts: string[] = [];
  if (row.pd_ramp_c_per_min) pdParts.push(`${row.pd_ramp_c_per_min}C/min`);
  if (row.pd_pressure_torr) pdParts.push(`${row.pd_pressure_torr} Torr`);
  if (row.pd_temp_c) pdParts.push(`pd_temp ${row.pd_temp_c}C`);
  if (pdParts.length > 0) noteParts.push(`PD: ${pdParts.join(", ")}.`);

  return {
    date: row.date,
    researcher: "Ashish",
    material_system: row.stack,
    film_composition: inferComposition(row.stack, row.gc_target),
    substrate_type: substrate.type,
    substrate_orientation: substrate.orientation,
    substrate_size: substrate.size,
    laser_fluence: substrate.fluence,
    laser_frequency: freq,
    oxygen_pressure: parseNum(row.pressure_mT),
    substrate_temperature: substrateTemp,
    pid_temperature: pidTemp,
    target_material: row.gc_target,
    target_rotation_speed: 12,
    target_substrate_distance: 55,
    pulse_count: pulseCount,
    x_position: null,
    y_position: null,
    radial_distance: null,
    angle: null,
    notes: noteParts.length > 0 ? noteParts.join(" ") : null,
    quality_rating: null,
    run_id: row.sample_id,
    laser_energy_mj: parseEnergy(row.energy_mJ),
    deposition_time_min: duration,
    heater_current_a: parseCurrent(row.current),
    post_deposition_pressure_torr: parseNum(row.pd_pressure_torr),
    cooling_rate_c_per_min: parseNum(row.pd_ramp_c_per_min),
  };
}
