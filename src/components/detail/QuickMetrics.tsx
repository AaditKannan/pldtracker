import { AnalysisWithMetrics } from "@/lib/types/database";
import { KEY_METRICS } from "@/lib/utils/metrics";

interface Props {
  analyses: AnalysisWithMetrics[];
}

export function QuickMetrics({ analyses }: Props) {
  const allMetrics = analyses.flatMap((a) => a.analysis_metrics);
  if (allMetrics.length === 0) return null;

  const cards: { label: string; display: string }[] = [];

  for (const km of KEY_METRICS) {
    const matching = allMetrics.filter((m) => m.metric_name === km.name);
    if (matching.length > 0) {
      const latest = matching[matching.length - 1];
      cards.push({ label: km.label, display: km.format(latest.metric_value) });
    }
  }

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[var(--bg-elevated)] rounded-lg px-4 py-3"
        >
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            {card.label}
          </div>
          <div className="text-lg font-mono font-semibold text-[var(--text-primary)] mt-1">
            {card.display}
          </div>
        </div>
      ))}
    </div>
  );
}
