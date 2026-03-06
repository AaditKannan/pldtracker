"use client";

import { DepositionWithAnalyses, ColorMode } from "@/lib/types/database";
import { getDepositionColor } from "@/lib/utils/colors";

interface Props {
  deposition: DepositionWithAnalyses;
  colorMode: ColorMode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export function DepositionDot({
  deposition,
  colorMode,
  isHovered,
  onHover,
  onClick,
}: Props) {
  const x = deposition.x_position ?? 0;
  // Flip Y for SVG (positive Y goes down in SVG, up in physical space)
  const y = -(deposition.y_position ?? 0);
  const color = getDepositionColor(deposition, colorMode);
  const r = isHovered ? 3 : 2;

  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={color}
      fillOpacity={0.8}
      stroke={isHovered ? "#0f172a" : "#fff"}
      strokeWidth={isHovered ? 0.6 : 0.3}
      className="cursor-pointer transition-all"
      onMouseEnter={() => onHover(deposition.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(deposition.id)}
    />
  );
}
