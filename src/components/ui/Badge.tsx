const TYPE_COLORS: Record<string, string> = {
  XRD: "bg-blue-50 text-blue-800 border border-blue-200",
  AFM: "bg-green-50 text-green-800 border border-green-200",
  PFM: "bg-purple-50 text-purple-800 border border-purple-200",
  SEM: "bg-orange-50 text-orange-800 border border-orange-200",
  XRR: "bg-cyan-50 text-cyan-800 border border-cyan-200",
  Raman: "bg-rose-50 text-rose-800 border border-rose-200",
  profilometry: "bg-amber-50 text-amber-800 border border-amber-200",
  electrical: "bg-indigo-50 text-indigo-800 border border-indigo-200",
  Other: "bg-slate-100 text-slate-700 border border-slate-200",
};

export function Badge({ type }: { type: string }) {
  const colors = TYPE_COLORS[type] ?? TYPE_COLORS.Other;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors}`}
    >
      {type}
    </span>
  );
}
