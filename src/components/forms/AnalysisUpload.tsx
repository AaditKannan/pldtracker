"use client";

import { useState } from "react";
import {
  ANALYSIS_TYPES,
  AnalysisType,
  AnalysisWithMetrics,
  METRIC_DEFINITIONS,
} from "@/lib/types/database";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props {
  depositionId: string;
  onUploaded: (analysis: AnalysisWithMetrics) => void;
}

const controlClass =
  "w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]";

export function AnalysisUpload({ depositionId, onUploaded }: Props) {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("XRD");
  const [operatorName, setOperatorName] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const metricDefs = METRIC_DEFINITIONS[analysisType];

  const handleTypeChange = (type: AnalysisType) => {
    setAnalysisType(type);
    setMetricValues({});
  };

  const handleMetricChange = (name: string, value: string) => {
    setMetricValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const supabase = createClient();
      let rawFileUrl: string | null = null;

      if (file) {
        const timestamp = Date.now();
        const path = `${depositionId}/${analysisType}/${timestamp}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("analysis-files")
          .upload(path, file);

        if (uploadError) {
          toast.error("File upload failed: " + uploadError.message);
          setUploading(false);
          return;
        }
        rawFileUrl = path;
      }

      const { data: analysis, error: insertError } = await supabase
        .from("analyses")
        .insert({
          deposition_id: depositionId,
          analysis_type: analysisType,
          operator_name: operatorName || null,
          notes: notes || null,
          raw_file_url: rawFileUrl,
        })
        .select()
        .single();

      if (insertError || !analysis) {
        toast.error("Failed to save analysis");
        setUploading(false);
        return;
      }

      const metricsToInsert = Object.entries(metricValues)
        .filter(([, v]) => v !== "" && !isNaN(parseFloat(v)))
        .map(([name, value]) => ({
          analysis_id: analysis.id,
          metric_name: name,
          metric_value: parseFloat(value),
          metric_unit:
            metricDefs.find((d) => d.name === name)?.unit ?? null,
        }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let insertedMetrics: any[] = [];
      if (metricsToInsert.length > 0) {
        const { data: metrics } = await supabase
          .from("analysis_metrics")
          .insert(metricsToInsert)
          .select();
        insertedMetrics = metrics ?? [];
      }

      const result: AnalysisWithMetrics = {
        ...analysis,
        analysis_metrics: insertedMetrics.map((m) => ({
          id: m.id,
          analysis_id: m.analysis_id,
          metric_name: m.metric_name,
          metric_value: m.metric_value,
          metric_unit: m.metric_unit,
        })),
      };

      toast.success("Analysis added");
      onUploaded(result);

      setNotes("");
      setOperatorName("");
      setFile(null);
      setMetricValues({});
    } catch {
      toast.error("An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]"
    >
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Add Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
            Analysis Type
          </label>
          <select
            value={analysisType}
            onChange={(e) => handleTypeChange(e.target.value as AnalysisType)}
            className={controlClass}
          >
            {ANALYSIS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
            Operator
          </label>
          <input
            type="text"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            placeholder="Who performed this analysis?"
            className={controlClass}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
          File (optional)
        </label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[var(--bg-elevated)] file:text-[var(--text-secondary)] hover:file:bg-[var(--bg-hover)]"
        />
      </div>

      {metricDefs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {metricDefs.map((def) => (
              <div key={def.name} className="flex items-center gap-2">
                <label className="text-xs text-[var(--text-secondary)] w-28 shrink-0">
                  {def.label}
                </label>
                <input
                  type="number"
                  step="any"
                  value={metricValues[def.name] ?? ""}
                  onChange={(e) =>
                    handleMetricChange(def.name, e.target.value)
                  }
                  placeholder="\u2014"
                  className="flex-1 min-w-0 px-2 py-1.5 border border-[var(--border-subtle)] rounded text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
                <span className="text-xs text-[var(--text-muted)] w-16 shrink-0">
                  {def.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Summary or observations..."
          className={`${controlClass} resize-none`}
        />
      </div>

      <div className="mt-3">
        <Button type="submit" disabled={uploading}>
          {uploading ? "Saving..." : "Add Analysis"}
        </Button>
      </div>
    </form>
  );
}
