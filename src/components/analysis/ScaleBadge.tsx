"use client";

interface Props {
  value: number;
  unit: string;
}

export function ScaleBadge({ value, unit }: Props) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 text-white backdrop-blur-sm">
      {value} {unit}
    </span>
  );
}
