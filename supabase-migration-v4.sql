-- =============================================================================
-- PLD Tracker Migration v4: Position Captures table
-- Stores captured camera frames for sample position logging
-- =============================================================================

CREATE TABLE IF NOT EXISTS position_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  source_type TEXT DEFAULT 'browser',
  source_name TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  deposition_id UUID REFERENCES depositions(id) ON DELETE SET NULL,
  captured_by TEXT,
  notes TEXT,
  x_position NUMERIC,
  y_position NUMERIC,
  radial_distance NUMERIC,
  angle NUMERIC,
  detection_status TEXT DEFAULT 'manual'
);
