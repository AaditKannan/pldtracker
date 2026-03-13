import { CameraStatus } from "@/lib/camera/types";

const STATUS_CONFIG: Record<CameraStatus, { color: string; bg: string; label: string }> = {
  connected: { color: "text-emerald-400", bg: "bg-emerald-400", label: "Connected" },
  connecting: { color: "text-amber-400", bg: "bg-amber-400", label: "Connecting" },
  disconnected: { color: "text-[var(--text-muted)]", bg: "bg-[var(--text-muted)]", label: "Disconnected" },
  error: { color: "text-red-400", bg: "bg-red-400", label: "Unavailable" },
};

export function StatusBadge({ status }: { status: CameraStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.bg} ${status === "connecting" ? "animate-pulse" : ""}`} />
      {cfg.label}
    </div>
  );
}
