export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
