-- Migration v3: Add notebook log fields + analysis images table
-- Run after supabase-migration-v2.sql

-- New deposition columns for notebook log data
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS run_id TEXT;
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS laser_energy_mj NUMERIC;
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS deposition_time_min NUMERIC;
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS heater_current_a NUMERIC;
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS post_deposition_pressure_torr NUMERIC;
ALTER TABLE depositions ADD COLUMN IF NOT EXISTS cooling_rate_c_per_min NUMERIC;

CREATE INDEX IF NOT EXISTS idx_depositions_run_id ON depositions(run_id);

-- Analysis images table for AFM/PFM multi-scale image viewing
CREATE TABLE IF NOT EXISTS analysis_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  scan_size_value NUMERIC,
  scan_size_unit TEXT DEFAULT 'um',
  image_order INTEGER DEFAULT 0,
  highlight_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_images_analysis ON analysis_images(analysis_id);

-- RLS for analysis_images
ALTER TABLE analysis_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read analysis_images" ON analysis_images
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert analysis_images" ON analysis_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update analysis_images" ON analysis_images
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all delete analysis_images" ON analysis_images
  FOR DELETE USING (true);
