import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { ImageGallery } from "@/components/analysis/ImageGallery";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: analysis, error } = await supabase
    .from("analyses")
    .select("*, depositions(*), analysis_metrics(*), analysis_images(*)")
    .eq("id", id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  const dep = analysis.depositions;
  const metrics = analysis.analysis_metrics ?? [];
  const images = analysis.analysis_images ?? [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const fileUrl = analysis.raw_file_url
    ? `${supabaseUrl}/storage/v1/object/public/analysis-files/${analysis.raw_file_url}`
    : null;

  const isImage = analysis.raw_file_url
    ? /\.(png|jpg|jpeg|gif|webp)$/i.test(analysis.raw_file_url)
    : false;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/analyses" className="hover:text-[var(--text-secondary)]">
          Analyses
        </Link>
        <span>/</span>
        <Badge type={analysis.analysis_type} />
        {dep && (
          <>
            <span>/</span>
            <Link
              href={`/depositions/${analysis.deposition_id}`}
              className="hover:text-[var(--text-secondary)]"
            >
              {dep.material_system ?? "Deposition"} {dep.date}
            </Link>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            {analysis.analysis_type} Analysis
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-secondary)]">
            {analysis.operator_name && <span>by {analysis.operator_name}</span>}
            {analysis.uploaded_at && (
              <span>{new Date(analysis.uploaded_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content — left 2 cols */}
        <div className="md:col-span-2 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Images ({images.length})
              </h3>
              <ImageGallery images={images} />
            </div>
          )}

          {/* Metrics */}
          {metrics.length > 0 && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Metrics
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-2 font-medium text-[var(--text-muted)]">
                      Metric
                    </th>
                    <th className="text-right py-2 font-medium text-[var(--text-muted)]">
                      Value
                    </th>
                    <th className="text-left py-2 pl-2 font-medium text-[var(--text-muted)]">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(
                    (m: {
                      id: string;
                      metric_name: string;
                      metric_value: number;
                      metric_unit: string | null;
                    }) => (
                      <tr key={m.id} className="border-b border-[var(--border-subtle)]/50">
                        <td className="py-2 text-[var(--text-secondary)]">{m.metric_name}</td>
                        <td className="py-2 text-right font-mono font-medium text-[var(--text-primary)]">
                          {m.metric_value}
                        </td>
                        <td className="py-2 pl-2 text-[var(--text-muted)]">
                          {m.metric_unit ?? ""}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          {analysis.notes && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Notes
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{analysis.notes}</p>
            </div>
          )}

          {/* File */}
          {fileUrl && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                File
              </h3>
              {isImage ? (
                <img
                  src={fileUrl}
                  alt="Analysis data"
                  className="max-w-full rounded border border-[var(--border-subtle)]"
                />
              ) : (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
                >
                  Download file
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — right col */}
        {dep && (
          <div className="space-y-4">
            {/* Key metric stat cards */}
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {metrics.slice(0, 4).map(
                  (m: {
                    id: string;
                    metric_name: string;
                    metric_value: number;
                    metric_unit: string | null;
                  }) => (
                    <div
                      key={m.id}
                      className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center"
                    >
                      <div className="text-lg font-mono font-semibold text-[var(--text-primary)]">
                        {typeof m.metric_value === "number"
                          ? m.metric_value % 1 === 0
                            ? m.metric_value
                            : m.metric_value.toFixed(2)
                          : m.metric_value}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                        {m.metric_name}
                        {m.metric_unit ? ` (${m.metric_unit})` : ""}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Linked Deposition */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Linked Deposition
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--text-muted)]">Material</span>
                  <p className="font-medium text-[var(--text-primary)]">
                    {dep.material_system ?? "—"}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Date</span>
                  <p className="font-medium text-[var(--text-primary)]">{dep.date}</p>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Researcher</span>
                  <p className="font-medium text-[var(--text-primary)]">{dep.researcher}</p>
                </div>
                {dep.substrate_temperature != null && (
                  <div>
                    <span className="text-[var(--text-muted)]">Temperature</span>
                    <p className="font-medium text-[var(--text-primary)]">
                      {dep.substrate_temperature}°C
                    </p>
                  </div>
                )}
                {dep.quality_rating != null && (
                  <div>
                    <span className="text-[var(--text-muted)]">Quality</span>
                    <p className="font-medium text-amber-400">
                      {"★".repeat(dep.quality_rating)}
                      {"☆".repeat(5 - dep.quality_rating)}
                    </p>
                  </div>
                )}
              </div>
              <Link
                href={`/depositions/${analysis.deposition_id}`}
                className="inline-block mt-3 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
              >
                View Deposition &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
