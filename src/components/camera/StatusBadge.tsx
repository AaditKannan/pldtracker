import { CameraStatus } from "@/lib/camera/types";

const STATUS_CONFIG: Record<CameraStatus, { color: string; bg: string; label: string }> = {
  connected: { color: "text-emerald-600", bg: "bg-emerald-600", label: "Connected" },
  connecting: { color: "text-amber-600", bg: "bg-amber-600", label: "Connecting" },
  disconnected: { color: "text-[var(--text-muted)]", bg: "bg-[var(--text-muted)]", label: "Disconnected" },
  error: { color: "text-red-600", bg: "bg-red-600", label: "Unavailable" },
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
