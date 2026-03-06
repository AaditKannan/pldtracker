import { DISK_RADIUS } from "@/lib/types/database";

interface Props {
  x: number | null;
  y: number | null;
}

const R = DISK_RADIUS;
const PAD = 5;
const VB = R + PAD;

export function PositionIndicator({ x, y }: Props) {
  const hasPos = x != null && y != null;

  return (
    <svg
      viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
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
      {[10, 20, 30].map((r) => (
        <circle
          key={r}
          cx={0}
          cy={0}
          r={r}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={0.2}
          strokeDasharray="1.5 1.5"
        />
      ))}
      <line x1={-R} y1={0} x2={R} y2={0} stroke="var(--border-subtle)" strokeWidth={0.2} />
      <line x1={0} y1={-R} x2={0} y2={R} stroke="var(--border-subtle)" strokeWidth={0.2} />
      <circle cx={0} cy={0} r={0.8} fill="var(--text-muted)" />
      {hasPos && (
        <>
          <circle cx={x} cy={-y} r={2.5} fill="var(--accent-primary)" fillOpacity={0.8} stroke="#4f46e5" strokeWidth={0.4} />
          <line x1={0} y1={0} x2={x} y2={-y} stroke="var(--accent-primary)" strokeWidth={0.3} strokeDasharray="1 1" />
        </>
      )}
    </svg>
  );
}
