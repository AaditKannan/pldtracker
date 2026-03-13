import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DepositionDetail } from "@/components/detail/DepositionDetail";
import { QuickMetrics } from "@/components/detail/QuickMetrics";
import { AnalysisSection } from "./AnalysisSection";
import { AnalysisWithMetrics } from "@/lib/types/database";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DepositionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: deposition, error } = await supabase
    .from("depositions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !deposition) {
    notFound();
  }

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*, analysis_metrics(*), analysis_images(*)")
    .eq("deposition_id", id)
    .order("uploaded_at", { ascending: true });

  const typedAnalyses: AnalysisWithMetrics[] =
    (analyses as AnalysisWithMetrics[]) ?? [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          &larr; Dashboard
        </Link>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          {deposition.run_id && (
            <span className="font-mono text-[var(--accent-primary)] mr-2">
              {deposition.run_id}
            </span>
          )}
          {deposition.material_system ?? "Deposition"}{" "}
          <span className="text-[var(--text-muted)] font-normal text-base">
            {deposition.date}
          </span>
        </h1>
      </div>

      <QuickMetrics analyses={typedAnalyses} />

      <DepositionDetail deposition={deposition} />

      <div className="mt-8">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          Analyses
        </h2>
        <AnalysisSection
          depositionId={id}
          initialAnalyses={typedAnalyses}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
        />
      </div>
    </div>
  );
}
