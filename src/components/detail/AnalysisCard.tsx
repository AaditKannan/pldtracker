"use client";

import { useState } from "react";
import Link from "next/link";
import { AnalysisWithMetrics } from "@/lib/types/database";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props {
  analysis: AnalysisWithMetrics;
  supabaseUrl: string;
  onDelete: (id: string) => void;
}

export function AnalysisCard({ analysis, supabaseUrl, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileUrl =
    analysis.raw_file_url
      ? `${supabaseUrl}/storage/v1/object/public/analysis-files/${analysis.raw_file_url}`
      : null;

  const isImage = analysis.raw_file_url
    ? /\.(png|jpg|jpeg|gif|webp)$/i.test(analysis.raw_file_url)
    : false;

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();

    if (analysis.raw_file_url) {
      await supabase.storage
        .from("analysis-files")
        .remove([analysis.raw_file_url]);
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", analysis.id);

    if (error) {
      toast.error("Failed to delete analysis");
      setDeleting(false);
      return;
    }

    toast.success("Analysis deleted");
    onDelete(analysis.id);
  };

  return (
    <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge type={analysis.analysis_type} />
          <Link
            href={`/analyses/${analysis.id}`}
            className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
          >
            View Details
          </Link>
        </div>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-danger)] cursor-pointer"
          >
            Delete
          </button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="danger"
              className="text-xs px-2 py-0.5"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "..." : "Confirm"}
            </Button>
            <Button
              variant="secondary"
              className="text-xs px-2 py-0.5"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {analysis.operator_name && (
        <div className="text-xs text-[var(--text-muted)] mt-1">
          by {analysis.operator_name}
        </div>
      )}

      {analysis.notes && (
        <p className="text-sm text-[var(--text-secondary)] mt-2">{analysis.notes}</p>
      )}

      {/* Metrics table */}
      {analysis.analysis_metrics.length > 0 && (
        <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
          <table className="w-full text-xs">
            <tbody>
              {analysis.analysis_metrics.map((m) => (
                <tr key={m.id} className="border-b border-[var(--border-subtle)]/30">
                  <td className="py-1 text-[var(--text-muted)]">{m.metric_name}</td>
                  <td className="py-1 text-right font-mono font-medium text-[var(--text-primary)]">
                    {m.metric_value}
                  </td>
                  <td className="py-1 pl-1 text-[var(--text-muted)]">
                    {m.metric_unit ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analysis images (from slide deck or uploads) */}
      {analysis.analysis_images && analysis.analysis_images.length > 0 && (
        <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...analysis.analysis_images]
              .sort((a, b) => a.image_order - b.image_order)
              .map((img) => (
                <Link
                  key={img.id}
                  href={`/analyses/${analysis.id}`}
                  className="group block"
                >
                  {img.caption && (
                    <div className="text-[9px] text-[var(--text-muted)] mb-0.5 truncate leading-tight">
                      {img.caption}
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors aspect-[4/3] bg-[var(--bg-elevated)]">
                    <img
                      src={img.image_url}
                      alt={img.caption ?? "Analysis image"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* File preview */}
      {fileUrl && (
        <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
          {isImage ? (
            <img
              src={fileUrl}
              alt="Analysis"
              className="max-h-40 rounded border border-[var(--border-subtle)]"
            />
          ) : (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
            >
              Download file
            </a>
          )}
        </div>
      )}
    </div>
  );
}
