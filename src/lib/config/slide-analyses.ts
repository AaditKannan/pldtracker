/**
 * Analysis assets extracted from "ashishmarch export.pdf".
 *
 * This maps each deposition to its slide-deck analysis pages,
 * records analysis types, and includes growth-parameter reconciliation
 * against the primary JSON notebook data.
 *
 * PRIMARY SOURCE: ashish_omar_march_2026_depositions_v2.json
 * SECONDARY SOURCE: ashishmarch export.pdf (slide deck)
 */

export interface SlideAnalysis {
  run_id: string;
  analysis_type: "PFM" | "AFM" | "XRD";
  /** PDF page numbers (1-indexed) */
  pages: number[];
  /** Image paths relative to /public */
  images: string[];
  /** Caption describing slide content */
  caption: string;
  /** Source file name */
  source: string;
  /** Label shown on the slide */
  slide_label: string;
}

export interface GrowthParameterReconciliation {
  run_id: string;
  /** Whether slide values match JSON (primary) values */
  validated_by_slide: boolean;
  /** Slide values from growth parameter table (page 1) */
  slide_values: {
    stack: string;
    energy_mj: number;
    frequency_hz: number;
    aperture: number;
    pressure_mtorr: number;
    temperature_c: number | null;
  };
  /** Conflicts between JSON (primary) and slide (secondary) */
  conflicts: {
    field: string;
    json_value: string | number | null;
    slide_value: string | number | null;
    resolution: string;
  }[];
}

export const SLIDE_ANALYSES: SlideAnalysis[] = [
  // --- February records (non-March, kept as analysis-only) ---
  {
    run_id: "AORL45",
    analysis_type: "PFM",
    pages: [2, 3],
    images: ["/analysis/AORL45/page-2.png", "/analysis/AORL45/page-3.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL45 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL46",
    analysis_type: "PFM",
    pages: [4],
    images: ["/analysis/AORL46/page-4.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL46 (5%@LBFO/DSO)",
  },

  // --- March records ---
  {
    run_id: "AORL47",
    analysis_type: "PFM",
    pages: [5, 6],
    images: ["/analysis/AORL47/page-5.png", "/analysis/AORL47/page-6.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL47 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL48",
    analysis_type: "PFM",
    pages: [7],
    images: ["/analysis/AORL48/page-7.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL48 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL49",
    analysis_type: "PFM",
    pages: [8],
    images: ["/analysis/AORL49/page-8.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL49 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL55",
    analysis_type: "PFM",
    pages: [9],
    images: ["/analysis/AORL55/page-9.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL55 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL55",
    analysis_type: "XRD",
    pages: [10],
    images: ["/analysis/AORL55/page-10.png"],
    caption: "XRD theta-2theta scan (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "XRD Data: AORL55 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL56",
    analysis_type: "PFM",
    pages: [11],
    images: ["/analysis/AORL56/page-11.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL56 (5%@LBFO/DSO)",
  },
  {
    run_id: "AORL57",
    analysis_type: "PFM",
    pages: [12],
    images: ["/analysis/AORL57/page-12.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@BFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL57 (5%@BFO/DSO)",
  },
  {
    run_id: "AORL58",
    analysis_type: "PFM",
    pages: [14],
    images: ["/analysis/AORL58/page-14.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO)",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: AORL58 (5%@LBFO/DSO)",
  },

  // --- Non-March record (kept as reference) ---
  {
    run_id: "PGRL419",
    analysis_type: "PFM",
    pages: [13],
    images: ["/analysis/PGRL419/page-13.png"],
    caption: "PFM data: amplitude, phase, and AFM topography (5%@LBFO/DSO). Non-March record, included for reference.",
    source: "ashishmarch export.pdf",
    slide_label: "PFM Data: PGRL419 (5%@LBFO/DSO)",
  },
];

/**
 * Growth parameter reconciliation: slide deck (page 1) vs JSON notebook data.
 *
 * Rule: JSON is primary. Slide values stored as slide_* for reference.
 * Conflicts flagged with resolution notes.
 */
export const GROWTH_PARAM_RECONCILIATION: GrowthParameterReconciliation[] = [
  {
    run_id: "AORL45",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 713 },
    conflicts: [],
  },
  {
    run_id: "AORL46",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 713 },
    conflicts: [],
  },
  {
    run_id: "AORL47",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 703 },
    conflicts: [],
  },
  {
    run_id: "AORL48",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 10, aperture: 14, pressure_mtorr: 145, temperature_c: 703 },
    conflicts: [],
  },
  {
    run_id: "AORL49",
    validated_by_slide: false,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 693 },
    conflicts: [
      {
        field: "substrate_temperature",
        json_value: 698,
        slide_value: 693,
        resolution: "JSON primary (698°C). Slide shows 693°C. JSON value from v2 transcription is more recent correction.",
      },
    ],
  },
  {
    run_id: "AORL55",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 150, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 713 },
    conflicts: [],
  },
  {
    run_id: "AORL56",
    validated_by_slide: true,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 723 },
    conflicts: [],
  },
  {
    run_id: "AORL57",
    validated_by_slide: true,
    slide_values: { stack: "BFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 713 },
    conflicts: [],
  },
  {
    run_id: "AORL58",
    validated_by_slide: false,
    slide_values: { stack: "LBFO/DSO", energy_mj: 140, frequency_hz: 4, aperture: 14, pressure_mtorr: 145, temperature_c: 713 },
    conflicts: [
      {
        field: "substrate_temperature",
        json_value: 706.4,
        slide_value: 713,
        resolution: "JSON primary (PID 930 → calibrated 706.4°C). Slide shows 713°C. Discrepancy may be due to different calibration or rounding in slide.",
      },
    ],
  },
];

/** Look up all slide analyses for a given run_id */
export function getSlideAnalyses(runId: string): SlideAnalysis[] {
  return SLIDE_ANALYSES.filter((a) => a.run_id === runId);
}

/** Look up growth parameter reconciliation for a given run_id */
export function getReconciliation(runId: string): GrowthParameterReconciliation | undefined {
  return GROWTH_PARAM_RECONCILIATION.find((r) => r.run_id === runId);
}

/** Get all run_ids that have slide analyses */
export function getAnalyzedRunIds(): string[] {
  return [...new Set(SLIDE_ANALYSES.map((a) => a.run_id))];
}
