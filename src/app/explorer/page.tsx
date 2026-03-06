import { createClient } from "@/lib/supabase/server";
import { DepositionWithAnalyses } from "@/lib/types/database";
import { flattenDepositionsForExplorer } from "@/lib/utils/explorer-data";
import { DataExplorer } from "@/components/explorer/DataExplorer";

export const dynamic = "force-dynamic";

export default async function ExplorerPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depositions")
    .select("*, analyses(*, analysis_metrics(*))")
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch data:", error.message);
  }

  const depositions = (data as DepositionWithAnalyses[]) ?? [];
  const explorerData = flattenDepositionsForExplorer(depositions);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Data Explorer</h1>
      <DataExplorer data={explorerData} />
    </div>
  );
}
