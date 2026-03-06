-- PLD Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Depositions table
CREATE TABLE depositions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  date DATE NOT NULL,
  researcher TEXT NOT NULL,
  material_system TEXT,
  film_composition TEXT,
  substrate_type TEXT,
  substrate_orientation TEXT,
  substrate_size TEXT,
  laser_fluence NUMERIC,
  laser_frequency NUMERIC,
  oxygen_pressure NUMERIC,
  substrate_temperature NUMERIC,
  target_material TEXT,
  target_rotation_speed NUMERIC,
  target_substrate_distance NUMERIC,
  pulse_count INTEGER,
  x_position NUMERIC,
  y_position NUMERIC,
  radial_distance NUMERIC,
  angle NUMERIC,
  notes TEXT,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5)
);

-- Characterizations table
CREATE TABLE characterizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  deposition_id UUID NOT NULL REFERENCES depositions(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('XRD', 'AFM', 'PFM', 'SEM', 'Other')),
  file_path TEXT,
  file_name TEXT,
  summary_notes TEXT
);

-- Indexes
CREATE INDEX idx_depositions_date ON depositions(date DESC);
CREATE INDEX idx_depositions_researcher ON depositions(researcher);
CREATE INDEX idx_depositions_material ON depositions(material_system);
CREATE INDEX idx_characterizations_deposition ON characterizations(deposition_id);

-- Row Level Security (permissive for MVP — internal lab tool)
ALTER TABLE depositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE characterizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all depositions" ON depositions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all characterizations" ON characterizations FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for characterization files
-- Note: You may also need to create this via the Supabase dashboard:
--   Storage > New Bucket > "characterization-files" > Public bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('characterization-files', 'characterization-files', true);

CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'characterization-files');

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'characterization-files');

CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'characterization-files');
