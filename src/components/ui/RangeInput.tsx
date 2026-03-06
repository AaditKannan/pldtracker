"use client";

interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function RangeInput({ label, min, max, step, unit, value, onChange, id }: Props) {
  const numVal = value === "" ? min : parseFloat(value);
  const displayVal = isNaN(numVal) ? min : numVal;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
      >
        {label}{unit ? ` (${unit})` : ""}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayVal}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--accent-primary)] bg-[var(--border-subtle)]"
        />
        <input
          type="number"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-sm text-right border border-[var(--border-subtle)] rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] tabular-nums"
          placeholder={String(min)}
        />
      </div>
    </div>
  );
}
