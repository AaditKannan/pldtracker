-- =============================================================================
-- PLD Tracker Migration v5: Add PID temperature column
-- Stores the PID setpoint temperature separately from calibrated real temp
-- =============================================================================

ALTER TABLE depositions
  ADD COLUMN IF NOT EXISTS pid_temperature NUMERIC;

COMMENT ON COLUMN depositions.pid_temperature IS 'PID controller setpoint temperature (°C). The substrate_temperature column holds the calibrated real temperature.';
