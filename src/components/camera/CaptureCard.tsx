"use client";

import { CaptureData } from "@/lib/camera/types";

interface Props {
  capture: CaptureData;
  onDelete: (id: string) => void;
  onUpdatePosition: (id: string, field: string, value: string) => void;
}

export function CaptureCard({ capture, onDelete, onUpdatePosition }: Props) {
  const time = capture.timestamp.toLocaleTimeString();
  const date = capture.timestamp.toLocaleDateString();

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
      <div className="aspect-video bg-black relative">
        <img
          src={capture.imageDataUrl}
          alt={`Capture at ${time}`}
          className="w-full h-full object-contain"
        />
        <button
          onClick={() => onDelete(capture.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded bg-black/60 text-white/80 hover:text-white text-xs flex items-center justify-center cursor-pointer"
        >
          ×
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{date} {time}</span>
          <span className="text-[var(--text-muted)]">{capture.source}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PositionField
            label="X (mm)"
            value={capture.x}
            onChange={(v) => onUpdatePosition(capture.id, "x", v)}
          />
          <PositionField
            label="Y (mm)"
            value={capture.y}
            onChange={(v) => onUpdatePosition(capture.id, "y", v)}
          />
          <PositionField
            label="R (mm)"
            value={capture.r}
            onChange={(v) => onUpdatePosition(capture.id, "r", v)}
          />
          <PositionField
            label="Angle (°)"
            value={capture.angle}
            onChange={(v) => onUpdatePosition(capture.id, "angle", v)}
          />
        </div>
      </div>
    </div>
  );
}

function PositionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="w-full mt-0.5 px-2 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
      />
    </div>
  );
}
