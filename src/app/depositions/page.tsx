import { createClient } from "@/lib/supabase/server";
import { DepositionTable } from "@/components/depositions/DepositionTable";

export const dynamic = "force-dynamic";

export default async function DepositionsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depositions")
    .select("*, analyses(id)")
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch depositions:", error.message);
  }

  const depositions = (data ?? []).map((d) => ({
    ...d,
    analysis_count: Array.isArray(d.analyses) ? d.analyses.length : 0,
  }));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Depositions</h1>
      <DepositionTable depositions={depositions} />
    </div>
  );
}
