const TYPE_COLORS: Record<string, string> = {
  XRD: "bg-blue-900/50 text-blue-300",
  AFM: "bg-green-900/50 text-green-300",
  PFM: "bg-purple-900/50 text-purple-300",
  SEM: "bg-orange-900/50 text-orange-300",
  XRR: "bg-cyan-900/50 text-cyan-300",
  Raman: "bg-rose-900/50 text-rose-300",
  profilometry: "bg-amber-900/50 text-amber-300",
  electrical: "bg-indigo-900/50 text-indigo-300",
  Other: "bg-slate-700/50 text-slate-300",
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
