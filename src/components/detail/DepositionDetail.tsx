import { Deposition } from "@/lib/types/database";
import { PositionIndicator } from "./PositionIndicator";

interface Props {
  deposition: Deposition;
}

export function DepositionDetail({ deposition }: Props) {
  const d = deposition;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Parameters */}
      <div className="lg:col-span-2 space-y-6">
        <DetailSection title="General">
          {d.run_id && <Field label="Run ID" value={d.run_id} />}
          <Field label="Date" value={d.date} />
          <Field label="Researcher" value={d.researcher} />
          <Field label="Material System" value={d.material_system} />
          <Field label="Film Composition" value={d.film_composition} />
          <Field
            label="Quality"
            value={
              d.quality_rating
                ? "\u2605".repeat(d.quality_rating) +
                  "\u2606".repeat(5 - d.quality_rating)
                : null
            }
          />
        </DetailSection>

        <DetailSection title="Substrate">
          <Field label="Type" value={d.substrate_type} />
          <Field label="Orientation" value={d.substrate_orientation} />
          <Field label="Size" value={d.substrate_size} />
        </DetailSection>

        <DetailSection title="Laser Parameters">
          <Field label="Fluence" value={d.laser_fluence} unit="J/cm\u00B2" />
          <Field label="Frequency" value={d.laser_frequency} unit="Hz" />
          <Field label="Energy" value={d.laser_energy_mj} unit="mJ" />
        </DetailSection>

        <DetailSection title="Growth Conditions">
          <Field label="O\u2082 Pressure" value={d.oxygen_pressure} unit="mTorr" />
          <Field label="Substrate Temperature" value={d.substrate_temperature} unit="\u00B0C" />
          <Field label="Deposition Time" value={d.deposition_time_min} unit="min" />
        </DetailSection>

        <DetailSection title="Heating & Cooling">
          <Field label="Heater Current" value={d.heater_current_a} unit="A" />
          <Field label="Cooling Rate" value={d.cooling_rate_c_per_min} unit="\u00B0C/min" />
          <Field label="Post-Dep Pressure" value={d.post_deposition_pressure_torr} unit="Torr" />
        </DetailSection>

        <DetailSection title="Target">
          <Field label="Material" value={d.target_material} />
          <Field label="Rotation Speed" value={d.target_rotation_speed} unit="RPM" />
          <Field label="Target-Substrate Distance" value={d.target_substrate_distance} unit="mm" />
        </DetailSection>

        <DetailSection title="Deposition">
          <Field label="Pulse Count" value={d.pulse_count} />
        </DetailSection>

        <DetailSection title="Position">
          <Field label="X" value={d.x_position} unit="mm" />
          <Field label="Y" value={d.y_position} unit="mm" />
          <Field label="Radial Distance" value={d.radial_distance} unit="mm" />
          <Field label="Angle" value={d.angle} unit="\u00B0" />
        </DetailSection>

        {d.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap col-span-2">
              {d.notes}
            </p>
          </DetailSection>
        )}
      </div>

      {/* Position indicator */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Disk Position
        </h3>
        <div className="w-full max-w-[250px]">
          <PositionIndicator x={d.x_position} y={d.y_position} />
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {value}
        {unit && <span className="text-[var(--text-muted)] ml-1">{unit}</span>}
      </span>
    </div>
  );
}
