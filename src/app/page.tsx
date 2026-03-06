import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/Dashboard";
import { DepositionWithAnalyses } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depositions")
    .select("*, analyses(*, analysis_metrics(*))")
    .order("date", { ascending: false });

  const depositions: DepositionWithAnalyses[] = (data as DepositionWithAnalyses[]) ?? [];

  if (error) {
    console.error("Failed to fetch depositions:", error.message);
  }

  return <Dashboard depositions={depositions} />;
}
