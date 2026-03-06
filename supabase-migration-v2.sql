-- PLD Tracker v2 Migration
-- Replaces characterizations with analyses + analysis_metrics
-- Run this in Supabase SQL Editor

-- 1. Create analyses table
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deposition_id UUID NOT NULL REFERENCES depositions(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'XRD', 'AFM', 'PFM', 'SEM', 'XRR', 'Raman',
    'profilometry', 'electrical', 'Other'
  )),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  operator_name TEXT,
  notes TEXT,
  raw_file_url TEXT,
  preview_file_url TEXT
);

-- 2. Create analysis_metrics table (key-value structured metrics)
CREATE TABLE analysis_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT
);

-- 3. Migrate existing characterization data (if any)
INSERT INTO analyses (deposition_id, analysis_type, uploaded_at, notes, raw_file_url)
SELECT
  deposition_id,
  measurement_type,
  created_at,
  summary_notes,
  file_path
FROM characterizations;

-- 4. Drop old table
DROP TABLE IF EXISTS characterizations;

-- 5. Create indexes
CREATE INDEX idx_analyses_deposition ON analyses(deposition_id);
CREATE INDEX idx_analyses_type ON analyses(analysis_type);
CREATE INDEX idx_analysis_metrics_analysis ON analysis_metrics(analysis_id);
CREATE INDEX idx_analysis_metrics_name ON analysis_metrics(metric_name);

-- 6. Enable RLS with permissive policies
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read analyses" ON analyses FOR SELECT USING (true);
CREATE POLICY "Allow all insert analyses" ON analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update analyses" ON analyses FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete analyses" ON analyses FOR DELETE USING (true);

CREATE POLICY "Allow all read analysis_metrics" ON analysis_metrics FOR SELECT USING (true);
CREATE POLICY "Allow all insert analysis_metrics" ON analysis_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update analysis_metrics" ON analysis_metrics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete analysis_metrics" ON analysis_metrics FOR DELETE USING (true);

-- 7. Create analysis-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('analysis-files', 'analysis-files', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public uploads analysis-files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'analysis-files');
CREATE POLICY "Allow public reads analysis-files" ON storage.objects
  FOR SELECT USING (bucket_id = 'analysis-files');
CREATE POLICY "Allow public deletes analysis-files" ON storage.objects
  FOR DELETE USING (bucket_id = 'analysis-files');
