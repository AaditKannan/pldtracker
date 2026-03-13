import { Deposition } from "@/lib/types/database";
import { PositionIndicator } from "./PositionIndicator";
import { getReconciliation, getSlideAnalyses } from "@/lib/config/slide-analyses";

interface Props {
  deposition: Deposition;
}

export function DepositionDetail({ deposition }: Props) {
  const d = deposition;
  const reconciliation = d.run_id ? getReconciliation(d.run_id) : undefined;
  const slideAnalyses = d.run_id ? getSlideAnalyses(d.run_id) : [];

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
                ? "★".repeat(d.quality_rating) +
                  "☆".repeat(5 - d.quality_rating)
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
          <Field label="Fluence" value={d.laser_fluence} unit="J/cm²" />
          <Field label="Frequency" value={d.laser_frequency} unit="Hz" />
          <Field label="Energy" value={d.laser_energy_mj} unit="mJ" />
        </DetailSection>

        <DetailSection title="Growth Conditions">
          <Field label="O₂ Pressure" value={d.oxygen_pressure} unit="mTorr" />
          <Field label="Substrate Temperature" value={d.substrate_temperature} unit="°C" />
          {d.pid_temperature != null && (
            <Field label="PID Setpoint" value={d.pid_temperature} unit="°C" />
          )}
          <Field label="Deposition Time" value={d.deposition_time_min} unit="min" />
        </DetailSection>

        <DetailSection title="Heating & Cooling">
          <Field label="Heater Current" value={d.heater_current_a} unit="A" />
          <Field label="Cooling Rate" value={d.cooling_rate_c_per_min} unit="°C/min" />
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
          <Field label="Angle" value={d.angle} unit="°" />
        </DetailSection>

        {d.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap col-span-2">
              {d.notes}
            </p>
          </DetailSection>
        )}

        {/* Slide Deck Reconciliation */}
        {reconciliation && (
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Slide Deck Validation
            </h3>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                {reconciliation.validated_by_slide ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Growth params validated by slide deck
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Conflicts with slide deck
                  </span>
                )}
                <span className="text-[10px] text-[var(--text-muted)]">
                  (ashishmarch export.pdf, page 1)
                </span>
              </div>

              {reconciliation.conflicts.length > 0 && (
                <div className="space-y-1">
                  {reconciliation.conflicts.map((c, i) => (
                    <div key={i} className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded px-2 py-1.5">
                      <span className="font-medium text-amber-400">{c.field}:</span>{" "}
                      JSON={String(c.json_value)}, Slide={String(c.slide_value)}.{" "}
                      <span className="text-[var(--text-muted)]">{c.resolution}</span>
                    </div>
                  ))}
                </div>
              )}

              {slideAnalyses.length > 0 && (
                <div className="text-xs text-[var(--text-muted)]">
                  Slide analyses: {slideAnalyses.map((a) => `${a.analysis_type} (p.${a.pages.join(",")})`).join(", ")}
                </div>
              )}
            </div>
          </div>
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
