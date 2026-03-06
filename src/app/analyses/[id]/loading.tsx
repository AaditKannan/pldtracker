export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-48 bg-slate-200 rounded" />
        <div className="h-32 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
