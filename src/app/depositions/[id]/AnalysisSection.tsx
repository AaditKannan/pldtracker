"use client";

import { useState } from "react";
import { AnalysisWithMetrics } from "@/lib/types/database";
import { AnalysisCard } from "@/components/detail/AnalysisCard";
import { AnalysisUpload } from "@/components/forms/AnalysisUpload";

interface Props {
  depositionId: string;
  initialAnalyses: AnalysisWithMetrics[];
  supabaseUrl: string;
}

export function AnalysisSection({
  depositionId,
  initialAnalyses,
  supabaseUrl,
}: Props) {
  const [analyses, setAnalyses] = useState(initialAnalyses);

  const handleUploaded = (newAnalysis: AnalysisWithMetrics) => {
    setAnalyses((prev) => [...prev, newAnalysis]);
  };

  const handleDelete = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      {analyses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((a) => (
            <AnalysisCard
              key={a.id}
              analysis={a}
              supabaseUrl={supabaseUrl}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">No analyses yet.</p>
      )}

      <AnalysisUpload
        depositionId={depositionId}
        onUploaded={handleUploaded}
      />
    </div>
  );
}
