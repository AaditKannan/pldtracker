import { createClient } from "@/lib/supabase/server";
import { AnalysisListView } from "@/components/analyses/AnalysisListView";

export const dynamic = "force-dynamic";

export default async function AnalysesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analyses")
    .select(
      "*, depositions(material_system, date, researcher), analysis_metrics(*)"
    )
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch analyses:", error.message);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Analyses</h1>
      <AnalysisListView analyses={data ?? []} />
    </div>
  );
}
