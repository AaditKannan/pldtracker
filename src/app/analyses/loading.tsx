export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-10 bg-slate-200 rounded w-1/3" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
