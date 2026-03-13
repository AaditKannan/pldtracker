"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RangeInput } from "@/components/ui/RangeInput";
import { createClient } from "@/lib/supabase/client";
import { DepositionInsert, DISK_RADIUS } from "@/lib/types/database";
import { cartesianToPolar, polarToCartesian, round2 } from "@/lib/utils/coordinates";

const SUBSTRATE_TYPES = [
  "SrTiO3",
  "LaAlO3",
  "MgO",
  "Si",
  "Sapphire",
  "Glass",
  "DSO",
  "STO / Si",
  "Other",
].map((s) => ({ value: s, label: s }));

const SUBSTRATE_ORIENTATIONS = ["(001)", "(110)", "(111)", "Polycrystalline"].map(
  (s) => ({ value: s, label: s })
);

const today = () => new Date().toISOString().split("T")[0];

function StarRatingSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const rating = value === "" ? 0 : parseInt(value, 10);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
        Quality Rating
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(rating === i ? "" : String(i))}
            className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
          >
            <svg
              className={`w-6 h-6 ${i <= rating ? "text-amber-500" : "text-[var(--border-default)]"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-[var(--text-muted)] ml-2">
            {["", "Poor", "Below Avg", "Average", "Good", "Excellent"][rating]}
          </span>
        )}
      </div>
    </div>
  );
}

export function DepositionForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date: today(),
    researcher: "",
    material_system: "",
    film_composition: "",
    substrate_type: "",
    substrate_orientation: "",
    substrate_size: "",
    laser_fluence: "",
    laser_frequency: "",
    oxygen_pressure: "",
    substrate_temperature: "",
    target_material: "",
    target_rotation_speed: "",
    target_substrate_distance: "",
    pulse_count: "",
    x_position: "",
    y_position: "",
    radial_distance: "",
    angle: "",
    quality_rating: "",
    notes: "",
    run_id: "",
    laser_energy_mj: "",
    deposition_time_min: "",
    heater_current_a: "",
    post_deposition_pressure_torr: "",
    cooling_rate_c_per_min: "",
  });

  const set = useCallback(
    (field: string, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  const updateFromCartesian = (xStr: string, yStr: string) => {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (!isNaN(x) && !isNaN(y)) {
      const { r, angle } = cartesianToPolar(x, y);
      setForm((prev) => ({
        ...prev,
        x_position: xStr,
        y_position: yStr,
        radial_distance: String(round2(r)),
        angle: String(round2(angle)),
      }));
    } else {
      setForm((prev) => ({ ...prev, x_position: xStr, y_position: yStr }));
    }
  };

  const updateFromPolar = (rStr: string, angleStr: string) => {
    const r = parseFloat(rStr);
    const a = parseFloat(angleStr);
    if (!isNaN(r) && !isNaN(a)) {
      const { x, y } = polarToCartesian(r, a);
      setForm((prev) => ({
        ...prev,
        radial_distance: rStr,
        angle: angleStr,
        x_position: String(round2(x)),
        y_position: String(round2(y)),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        radial_distance: rStr,
        angle: angleStr,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.researcher) {
      toast.error("Date and Researcher are required.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const num = (v: string) => (v === "" ? null : parseFloat(v));
    const int = (v: string) => (v === "" ? null : parseInt(v, 10));
    const str = (v: string) => (v === "" ? null : v);

    const row: DepositionInsert = {
      date: form.date,
      researcher: form.researcher,
      material_system: str(form.material_system),
      film_composition: str(form.film_composition),
      substrate_type: str(form.substrate_type),
      substrate_orientation: str(form.substrate_orientation),
      substrate_size: str(form.substrate_size),
      laser_fluence: num(form.laser_fluence),
      laser_frequency: num(form.laser_frequency),
      oxygen_pressure: num(form.oxygen_pressure),
      substrate_temperature: num(form.substrate_temperature),
      target_material: str(form.target_material),
      target_rotation_speed: num(form.target_rotation_speed),
      target_substrate_distance: num(form.target_substrate_distance),
      pulse_count: int(form.pulse_count),
      x_position: num(form.x_position),
      y_position: num(form.y_position),
      radial_distance: num(form.radial_distance),
      angle: num(form.angle),
      quality_rating: int(form.quality_rating),
      notes: str(form.notes),
      run_id: str(form.run_id),
      laser_energy_mj: num(form.laser_energy_mj),
      deposition_time_min: num(form.deposition_time_min),
      heater_current_a: num(form.heater_current_a),
      post_deposition_pressure_torr: num(form.post_deposition_pressure_torr),
      cooling_rate_c_per_min: num(form.cooling_rate_c_per_min),
    };

    const { data, error } = await supabase
      .from("depositions")
      .insert(row)
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }

    toast.success("Deposition saved!");
    router.push(`/depositions/${data.id}`);
  };

  // Mini disk preview
  const px = parseFloat(form.x_position);
  const py = parseFloat(form.y_position);
  const hasPos = !isNaN(px) && !isNaN(py);
  const R = DISK_RADIUS;
  const pad = 5;
  const vb = R + pad;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">New Deposition</h1>

      {/* Run Info */}
      <Section title="Run Info">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Run ID"
            id="run_id"
            value={form.run_id}
            onChange={(e) => set("run_id", e.target.value)}
            placeholder="e.g. AORL44"
          />
          <Input
            label="Date *"
            type="date"
            id="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
          <Input
            label="Researcher *"
            id="researcher"
            value={form.researcher}
            onChange={(e) => set("researcher", e.target.value)}
            placeholder="Name"
            required
          />
        </div>
      </Section>

      {/* Material */}
      <Section title="Material">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Material System"
            id="material_system"
            value={form.material_system}
            onChange={(e) => set("material_system", e.target.value)}
            placeholder="e.g. BiFeO3"
          />
          <Input
            label="Film Composition"
            id="film_composition"
            value={form.film_composition}
            onChange={(e) => set("film_composition", e.target.value)}
            placeholder="e.g. BiFeO3/SrRuO3"
          />
        </div>
      </Section>

      {/* Substrate */}
      <Section title="Substrate">
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Type"
            id="substrate_type"
            value={form.substrate_type}
            onChange={(e) => set("substrate_type", e.target.value)}
            options={SUBSTRATE_TYPES}
            placeholder="Select..."
          />
          <Select
            label="Orientation"
            id="substrate_orientation"
            value={form.substrate_orientation}
            onChange={(e) => set("substrate_orientation", e.target.value)}
            options={SUBSTRATE_ORIENTATIONS}
            placeholder="Select..."
          />
          <Input
            label="Size"
            id="substrate_size"
            value={form.substrate_size}
            onChange={(e) => set("substrate_size", e.target.value)}
            placeholder="e.g. 5x5 mm"
          />
        </div>
      </Section>

      {/* Laser Parameters */}
      <Section title="Laser Parameters">
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Fluence"
            unit="J/cm²"
            id="laser_fluence"
            min={0.5}
            max={5.0}
            step={0.05}
            value={form.laser_fluence}
            onChange={(v) => set("laser_fluence", v)}
          />
          <Input
            label="Frequency (Hz)"
            id="laser_frequency"
            type="number"
            step="0.1"
            value={form.laser_frequency}
            onChange={(e) => set("laser_frequency", e.target.value)}
          />
          <Input
            label="Energy (mJ)"
            id="laser_energy_mj"
            type="number"
            step="1"
            value={form.laser_energy_mj}
            onChange={(e) => set("laser_energy_mj", e.target.value)}
          />
        </div>
      </Section>

      {/* Growth Conditions */}
      <Section title="Growth Conditions">
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="O₂ Pressure"
            unit="mTorr"
            id="oxygen_pressure"
            min={0}
            max={1000}
            step={1}
            value={form.oxygen_pressure}
            onChange={(v) => set("oxygen_pressure", v)}
          />
          <RangeInput
            label="Substrate Temperature"
            unit="°C"
            id="substrate_temperature"
            min={200}
            max={950}
            step={1}
            value={form.substrate_temperature}
            onChange={(v) => set("substrate_temperature", v)}
          />
          <Input
            label="Deposition Time (min)"
            id="deposition_time_min"
            type="number"
            step="0.5"
            value={form.deposition_time_min}
            onChange={(e) => set("deposition_time_min", e.target.value)}
          />
        </div>
      </Section>

      {/* Target */}
      <Section title="Target">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Material"
            id="target_material"
            value={form.target_material}
            onChange={(e) => set("target_material", e.target.value)}
            placeholder="e.g. BiFeO3"
          />
          <Input
            label="Rotation Speed (RPM)"
            id="target_rotation_speed"
            type="number"
            step="0.1"
            value={form.target_rotation_speed}
            onChange={(e) => set("target_rotation_speed", e.target.value)}
          />
          <Input
            label="Target-Substrate Distance (mm)"
            id="target_substrate_distance"
            type="number"
            step="0.1"
            value={form.target_substrate_distance}
            onChange={(e) => set("target_substrate_distance", e.target.value)}
          />
        </div>
      </Section>

      {/* Heating & Cooling */}
      <Section title="Heating & Cooling">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Heater Current (A)"
            id="heater_current_a"
            type="number"
            step="0.1"
            value={form.heater_current_a}
            onChange={(e) => set("heater_current_a", e.target.value)}
          />
          <Input
            label="Cooling Rate (°C/min)"
            id="cooling_rate_c_per_min"
            type="number"
            step="1"
            value={form.cooling_rate_c_per_min}
            onChange={(e) => set("cooling_rate_c_per_min", e.target.value)}
          />
          <Input
            label="Post-Dep Pressure (Torr)"
            id="post_deposition_pressure_torr"
            type="number"
            step="1"
            value={form.post_deposition_pressure_torr}
            onChange={(e) => set("post_deposition_pressure_torr", e.target.value)}
          />
        </div>
      </Section>

      {/* Deposition */}
      <Section title="Deposition">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Number of Pulses"
            id="pulse_count"
            type="number"
            step="1"
            value={form.pulse_count}
            onChange={(e) => set("pulse_count", e.target.value)}
          />
          <StarRatingSelector
            value={form.quality_rating}
            onChange={(v) => set("quality_rating", v)}
          />
        </div>
      </Section>

      {/* Position */}
      <Section title="Position on Disk">
        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <Input
              label="X (mm)"
              id="x_position"
              type="number"
              step="0.01"
              value={form.x_position}
              onChange={(e) =>
                updateFromCartesian(e.target.value, form.y_position)
              }
            />
            <Input
              label="Y (mm)"
              id="y_position"
              type="number"
              step="0.01"
              value={form.y_position}
              onChange={(e) =>
                updateFromCartesian(form.x_position, e.target.value)
              }
            />
            <Input
              label="Radial Distance (mm)"
              id="radial_distance"
              type="number"
              step="0.01"
              value={form.radial_distance}
              onChange={(e) => updateFromPolar(e.target.value, form.angle)}
            />
            <Input
              label="Angle (°)"
              id="angle"
              type="number"
              step="0.1"
              value={form.angle}
              onChange={(e) =>
                updateFromPolar(form.radial_distance, e.target.value)
              }
            />
          </div>
          {/* Mini disk preview */}
          <div className="w-32 h-32 shrink-0">
            <svg
              viewBox={`${-vb} ${-vb} ${vb * 2} ${vb * 2}`}
              className="w-full h-full"
            >
              <circle
                cx={0}
                cy={0}
                r={R}
                fill="var(--bg-surface)"
                stroke="var(--border-default)"
                strokeWidth={0.5}
              />
              <line x1={-R} y1={0} x2={R} y2={0} stroke="var(--border-subtle)" strokeWidth={0.3} />
              <line x1={0} y1={-R} x2={0} y2={R} stroke="var(--border-subtle)" strokeWidth={0.3} />
              {hasPos && (
                <circle cx={px} cy={-py} r={2} fill="var(--accent-primary)" />
              )}
            </svg>
          </div>
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] min-h-[100px]"
          placeholder="Additional notes about this deposition..."
        />
      </Section>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Deposition"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
