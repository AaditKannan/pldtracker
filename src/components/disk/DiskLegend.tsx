"use client";

import { ColorMode } from "@/lib/types/database";
import { getColorModeLabel } from "@/lib/utils/colors";

interface Props {
  colorMode: ColorMode;
}

const QUALITY_ITEMS = [
  { label: "1 - Poor", color: "#ef4444" },
  { label: "2", color: "#f97316" },
  { label: "3", color: "#eab308" },
  { label: "4", color: "#84cc16" },
  { label: "5 - Excellent", color: "#22c55e" },
];

const MATERIAL_ITEMS = [
  { label: "BiFeO3", color: "#8b5cf6" },
  { label: "SrTiO3", color: "#3b82f6" },
  { label: "BaTiO3", color: "#14b8a6" },
  { label: "La0.7Sr0.3MnO3", color: "#f59e0b" },
  { label: "Other", color: "#6366f1" },
];

export function DiskLegend({ colorMode }: Props) {
  const title = getColorModeLabel(colorMode);

  if (colorMode === "quality") {
    return (
      <LegendWrapper title={title}>
        {QUALITY_ITEMS.map((item) => (
          <LegendItem key={item.label} {...item} />
        ))}
        <LegendItem label="Not rated" color="#6b7280" />
      </LegendWrapper>
    );
  }

  if (colorMode === "material") {
    return (
      <LegendWrapper title={title}>
        {MATERIAL_ITEMS.map((item) => (
          <LegendItem key={item.label} {...item} />
        ))}
      </LegendWrapper>
    );
  }

  if (colorMode === "temperature") {
    return (
      <LegendWrapper title={title}>
        <GradientBar from="#3b82f6" to="#ef4444" leftLabel="200°C" rightLabel="900°C" />
      </LegendWrapper>
    );
  }

  if (colorMode === "pressure") {
    return (
      <LegendWrapper title={title}>
        <GradientBar from="#bfdbfe" to="#1e3a5f" leftLabel="Low" rightLabel="High" />
      </LegendWrapper>
    );
  }

  if (colorMode === "roughness") {
    return (
      <LegendWrapper title={title}>
        <GradientBar from="#22c55e" to="#ef4444" leftLabel="0 nm" rightLabel="15 nm" />
        <LegendItem label="No data" color="#6b7280" />
      </LegendWrapper>
    );
  }

  if (colorMode === "fwhm") {
    return (
      <LegendWrapper title={title}>
        <GradientBar from="#22c55e" to="#ef4444" leftLabel="0 deg" rightLabel="0.5 deg" />
        <LegendItem label="No data" color="#6b7280" />
      </LegendWrapper>
    );
  }

  // thickness
  return (
    <LegendWrapper title={title}>
      <GradientBar from="#bfdbfe" to="#1e3a5f" leftLabel="0 nm" rightLabel="500 nm" />
      <LegendItem label="No data" color="#6b7280" />
    </LegendWrapper>
  );
}

function GradientBar({
  from,
  to,
  leftLabel,
  rightLabel,
}: {
  from: string;
  to: string;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--text-muted)]">{leftLabel}</span>
      <div
        className="h-3 flex-1 rounded"
        style={{
          background: `linear-gradient(to right, ${from}, ${to})`,
        }}
      />
      <span className="text-xs text-[var(--text-muted)]">{rightLabel}</span>
    </div>
  );
}

function LegendWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="text-xs font-medium text-[var(--text-muted)] mb-1">{title}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}
