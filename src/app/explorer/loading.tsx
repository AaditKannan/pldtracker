export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-12 bg-slate-200 rounded w-2/3" />
        <div className="h-96 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
