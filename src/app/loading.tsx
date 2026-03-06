export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-[var(--accent-primary)] animate-pulse" />
        <span className="text-sm text-[var(--text-muted)]">Loading...</span>
      </div>
    </div>
  );
}
