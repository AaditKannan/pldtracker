-- =============================================================================
-- PLD Tracker: Reset database and re-seed with corrected AORL data
-- Run this against your Supabase database to clear old data and reload
-- =============================================================================

-- Clear all existing data (order matters due to foreign keys)
DELETE FROM analysis_images;
DELETE FROM analysis_metrics;
DELETE FROM analyses;
DELETE FROM depositions;

-- Now insert fresh seed data:

-- =============================================================================
-- PLD Tracker Seed Data v2: AORL44-AORL76
-- 33 depositions from handwritten notebook logs
-- Source: ashish_omar_march_2026_depositions_v2.json + February notebook entries
-- Requires supabase-migration-v3.sql and v5.sql to be run first
-- =============================================================================
-- Temperature calibration used:
--   pid 875 → 660.0   pid 900 → 680.0   pid 925 → 702.0
--   pid 950 → 724.0   pid 975 → 741.0
-- Interpolation: real = real_low + (pid - pid_low)/(pid_high - pid_low) * (real_high - real_low)
-- =============================================================================

-- ============================================================
-- AORL44: SQZ LBFO / DSO, Feb 26 (not in JSON, from notebook)
-- ============================================================
WITH dep_aorl44 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-26', 'Ashish', 'SQZ LBFO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713, 946, 'LBiO',
    12, 55, 4800,
    -1.2, 0.8, 1.44, 146.3,
    'After temperature calibration. Notebook also shows (930C) and (z = 3.2) near this run.', NULL,
    'AORL44', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl44;

-- ============================================================
-- AORL45: LBFO / DSO, Feb 28, good
-- ============================================================
WITH dep_aorl45 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-28', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713, 946, 'LBiO',
    12, 55, 4800,
    0.3, -1.5, 1.53, -78.7,
    'Notebook shows (z = 3.4) and (good).', 4,
    'AORL45', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl45;

-- ============================================================
-- AORL46: LBRO / DSO, Feb 28, better (not in JSON)
-- ============================================================
WITH dep_aorl46 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-28', 'Ashish', 'LBRO/DSO', NULL, 'DSO',
    '(110)', '5x5 mm', NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    1.0, 1.2, 1.56, 50.2,
    'Repeated AORL45 with cleaned target. Notebook shows (z = 3.4) and (better). Likely similar conditions to AORL45 but fields not explicitly recorded.', 5,
    'AORL46', NULL, NULL, NULL,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl46;

-- ============================================================
-- AORL47: LBiO/DSO, Mar 1, actual 703C, PID 928C, better
-- ============================================================
WITH dep_aorl47 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-01', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 703, 928, 'LBiO',
    12, 55, 4800,
    -0.5, -0.7, 0.86, -125.5,
    'better. PD: 30C/min, 300 Torr, pd_temp 703C.', 5,
    'AORL47', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl47;

-- ============================================================
-- AORL48: LBiO/DSO, Mar 1, actual 703C, PID 928C, 10Hz
-- ============================================================
WITH dep_aorl48 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-01', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    145, 703, 928, 'LBiO',
    12, 55, 4800,
    1.8, 0.2, 1.81, 6.3,
    'Note after sample ID looks like w bad; another scratched note on line below is unreadable.', 1,
    'AORL48', 140, 8, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl48;

-- ============================================================
-- AORL49: LBiO/DSO, Mar 2, actual 698C, PID 918C
-- ============================================================
WITH dep_aorl49 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-02', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 698, 918, 'LBiO',
    12, 55, 4800,
    -1.8, -0.3, 1.82, -170.5,
    'CONFLICT: slide deck shows 693°C, JSON says 698°C — JSON value used as primary.', NULL,
    'AORL49', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl49;

-- ============================================================
-- AORL50: STO/STO/Si, Mar 2, actual 700C, PID 920C
-- ============================================================
WITH dep_aorl50 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-02', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 700, 920, 'STO',
    12, 55, 1200,
    0.0, 0.5, 0.50, 90.0,
    'PD: 30C/min, 300 Torr.', NULL,
    'AORL50', 110, 4, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl50;

-- ============================================================
-- AORL51: STO/STO/Si, Mar 3, actual 710C, PID 935C, bad
-- ============================================================
WITH dep_aorl51 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-03', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 710, 935, 'STO',
    12, 55, 1200,
    -0.8, 1.6, 1.79, 116.6,
    'Margin note: bad; energy was high 136. PD: 30C/min, 300 Torr.', 2,
    'AORL51', 110, 4, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl51;

-- ============================================================
-- AORL52: STO/STO/Si, Mar 3, PID 910C only → calibrated 688.8C
-- ============================================================
WITH dep_aorl52 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-03', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 688.8, 910, 'STO',
    12, 55, 1200,
    0.6, -1.0, 1.17, -59.0,
    'PID setpoint 910. Substrate temp calibrated from PID.', NULL,
    'AORL52', 110, 4, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl52;

-- ============================================================
-- AORL53: 27% LBiO/DSO, Mar 4, PID 930C → calibrated 706.4C
-- ============================================================
WITH dep_aorl53 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Ashish', '27% LBiO/DSO', '27% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 706.4, 930, 'LBiO',
    12, 55, 4800,
    1.4, 1.4, 1.98, 45.0,
    'PID setpoint 930. Substrate temp calibrated from PID.', NULL,
    'AORL53', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl53;

-- ============================================================
-- AORL54: STO/STO/Si, Mar 4, PID 925C → calibrated 702.0C
-- ============================================================
WITH dep_aorl54 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 4,
    110, 702.0, 925, 'STO',
    12, 55, 1200,
    -1.5, -1.3, 1.98, -139.1,
    'PID setpoint 925. Substrate temp calibrated from PID. PD: 20C/min, 300 Torr.', NULL,
    'AORL54', 110, 5, 14,
    300, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl54;

-- ============================================================
-- AORL55: 5% LBiO/DSO, Mar 4, PID 938C → calibrated 713.4C
-- ============================================================
WITH dep_aorl55 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Ashish', '5% LBiO/DSO', '5% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713.4, 938, 'LBiO',
    12, 55, 4800,
    0.2, 0.1, 0.22, 26.6,
    'PID setpoint 938. Substrate temp calibrated from PID. PD: 30C/min, 300 Torr.', NULL,
    'AORL55', 150, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl55;

-- ============================================================
-- AORL56: 5% LBiO/DSO, Mar 5, PID 948C → calibrated 722.2C
-- ============================================================
WITH dep_aorl56 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-05', 'Ashish', '5% LBiO/DSO', '5% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 722.2, 948, 'LBiO',
    12, 55, 4800,
    -0.3, 1.8, 1.82, 99.5,
    'PID setpoint 948. PD line also repeats 948C. PD: 30C/min, 300 Torr.', NULL,
    'AORL56', 145, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl56;

-- ============================================================
-- AORL57: BFO/DSO, Mar 5, PID 938C → calibrated 713.4C
-- ============================================================
WITH dep_aorl57 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-05', 'Ashish', 'BFO/DSO', 'BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713.4, 938, 'BFO',
    12, 55, 4800,
    1.6, -0.9, 1.84, -29.4,
    'PID setpoint 938. Substrate temp calibrated from PID.', NULL,
    'AORL57', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl57;

-- ============================================================
-- AORL58: LBiO/DSO, Mar 6, PID 930C → calibrated 706.4C, z=2.7
-- ============================================================
WITH dep_aorl58 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-06', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 706.4, 930, 'LBiO',
    12, 55, 4800,
    -0.1, -1.9, 1.90, -93.0,
    'PID setpoint 930. z = 2.7. CONFLICT: slide deck shows 713°C, JSON PID 930 calibrates to 706.4°C — JSON/calibrated value used as primary.', NULL,
    'AORL58', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl58;

-- ============================================================
-- AORL59: LBiO/DSO, Mar 6, PID 930C → calibrated 706.4C, z=3.4
-- ============================================================
WITH dep_aorl59 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-06', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 706.4, 930, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 930. z = 3.4. PD: 30C/min, 300 Torr, pd_temp 930C. Sample number reads like 59, not 53, based on sequence and context.', NULL,
    'AORL59', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl59;

-- ============================================================
-- AORL60: LBiO/DSO, Mar 6, PID 930C → calibrated 706.4C, z=3.2
-- ============================================================
WITH dep_aorl60 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-06', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 706.4, 930, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 930. z = 3.2. Note: use 113-114.', NULL,
    'AORL60', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl60;

-- ============================================================
-- AORL61: LBiO/DSO, Mar 7, PID 925C → calibrated 702.0C, z=2.6
-- ============================================================
WITH dep_aorl61 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-07', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 702.0, 925, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 925. z = 2.6.', NULL,
    'AORL61', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl61;

-- ============================================================
-- AORL62: LBiO/DSO, Mar 7, PID 925C → calibrated 702.0C, z=2.3
-- Energy range 140-145 → 142.5 mJ, 10 Hz, 10 min
-- ============================================================
WITH dep_aorl62 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-07', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    145, 702.0, 925, 'LBiO',
    12, 55, 6000,
    NULL, NULL, NULL, NULL,
    'PID setpoint 925. z = 2.3. Energy 140-145 mJ. 20 min is crossed out and corrected to 10 min.', NULL,
    'AORL62', 142.5, 10, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl62;

-- ============================================================
-- AORL63: LBiO/DSO, Mar 8, PID 932C → calibrated 708.2C, z=2.5
-- Energy range 140-145 → 142.5 mJ, 2 Hz, 40 min
-- ============================================================
WITH dep_aorl63 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-08', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 2,
    150, 708.2, 932, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 932. z = 2.5. Energy 140-145 mJ. 20 min crossed out to 40 min; 145 mT corrected to 150 mT.', NULL,
    'AORL63', 142.5, 40, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl63;

-- ============================================================
-- AORL64: LBiO/DSO, Mar 9, PID 917C → calibrated 695.0C, z=2.6
-- Energy range 140-145 → 142.5 mJ
-- ============================================================
WITH dep_aorl64 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    150, 695.0, 917, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 917. z = 2.6. Energy 140-145 mJ. fixed.', NULL,
    'AORL64', 142.5, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl64;

-- ============================================================
-- AORL65: STO/STO/Si, Mar 9, PID 900C → calibrated 680.0C
-- ============================================================
WITH dep_aorl65 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 680.0, 900, 'STO',
    12, 55, 1200,
    NULL, NULL, NULL, NULL,
    'PID setpoint 900. Substrate temp calibrated from PID. PD: 20C/min, 300 Torr.', NULL,
    'AORL65', 110, 4, 14,
    300, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl65;

-- ============================================================
-- AORL66: LBiO/DSO, Mar 9, PID 900C → calibrated 680.0C, z=2.6
-- Energy range 140-145 → 142.5 mJ
-- ============================================================
WITH dep_aorl66 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    150, 680.0, 900, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 900. z = 2.6. Energy 140-145 mJ.', NULL,
    'AORL66', 142.5, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl66;

-- ============================================================
-- AORL67: STO/STO/Si, Mar 9, actual 705C
-- ============================================================
WITH dep_aorl67 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 705, NULL, 'STO',
    12, 55, 1200,
    NULL, NULL, NULL, NULL,
    'PD: 20C/min, 300 Torr.', NULL,
    'AORL67', 110, 4, 14,
    300, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl67;

-- ============================================================
-- AORL68: STO/STO/Si, Mar 9, actual 695C
-- ============================================================
WITH dep_aorl68 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 695, NULL, 'STO',
    12, 55, 1200,
    NULL, NULL, NULL, NULL,
    'PD: 20C/min, 300 Torr.', NULL,
    'AORL68', 110, 4, 14,
    300, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl68;

-- ============================================================
-- AORL69: LBiO/DSO, Mar 9, PID 890C → calibrated 672.0C
-- ============================================================
WITH dep_aorl69 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-09', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 672.0, 890, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 890. Substrate temp calibrated from PID. PD: 20C/min, 300 Torr.', NULL,
    'AORL69', 140, 20, 14,
    300, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl69;

-- ============================================================
-- AORL70: LBiO/DSO, Mar 10, PID 900C → calibrated 680.0C
-- ============================================================
WITH dep_aorl70 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-10', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    165, 680.0, 900, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 900. 145 mT appears corrected to 165 mT. PD: 30C/min.', NULL,
    'AORL70', 145, 20, 14,
    NULL, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl70;

-- ============================================================
-- AORL71: LBiO/DSO, Mar 11, PID 938C → calibrated 713.4C
-- ============================================================
WITH dep_aorl71 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-11', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    80, 713.4, 938, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 938. Substrate temp calibrated from PID.', NULL,
    'AORL71', 170, 8, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl71;

-- ============================================================
-- AORL72: LBiO/DSO, Mar 11, PID 948C → calibrated 722.2C
-- ============================================================
WITH dep_aorl72 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-11', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    80, 722.2, 948, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 948. Substrate temp calibrated from PID.', NULL,
    'AORL72', 170, 8, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl72;

-- ============================================================
-- AORL73: STO/STO/Si, Mar 11, actual 705C
-- ============================================================
WITH dep_aorl73 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-11', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 705, NULL, 'STO',
    12, 55, 1200,
    NULL, NULL, NULL, NULL,
    'PD: 20C/min.', NULL,
    'AORL73', 155, 4, 14,
    NULL, 20
  ) RETURNING id
)
SELECT id FROM dep_aorl73;

-- ============================================================
-- AORL74: LBiO/DSO, Mar 11, PID 910C → calibrated 688.8C
-- ============================================================
WITH dep_aorl74 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-11', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    100, 688.8, 910, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 910. Substrate temp calibrated from PID.', NULL,
    'AORL74', 170, 8, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl74;

-- ============================================================
-- AORL75: STO/STO/Si, Mar 12, actual 700C
-- ============================================================
WITH dep_aorl75 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-12', 'Ashish', 'STO/STO/Si', 'SrTiO3', 'STO/Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 700, NULL, 'STO',
    12, 55, 1200,
    NULL, NULL, NULL, NULL,
    'PD: 30C/min.', NULL,
    'AORL75', 120, 4, 14,
    NULL, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl75;

-- ============================================================
-- AORL76: LBiO/DSO, Mar 12, PID 930C → calibrated 706.4C
-- ============================================================
WITH dep_aorl76 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, pid_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-12', 'Ashish', 'LBiO/DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 706.4, 930, 'LBiO',
    12, 55, 4800,
    NULL, NULL, NULL, NULL,
    'PID setpoint 930. Substrate temp calibrated from PID.', NULL,
    'AORL76', 145, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl76;

-- ============================================================
-- Analysis entries from slide deck (ashishmarch export.pdf)
-- Source: Berkeley Materials Science & Engineering slide deck
-- Panel crops: page-N-panel-M.png (M=1 AFM Topo, 2 PFM Amp, 3 PFM Phase,
--              4 AFM Topo zoomed, 5 PFM Amp zoomed, 6 PFM Phase zoomed)
-- ============================================================

-- AORL45: AFM analysis (pages 2-3) — February record, kept for analysis
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL45' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf pages 2-3.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL45/page-2-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL45/page-2-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1),
  ((SELECT id FROM ana_afm), '/analysis/AORL45/page-3-panel-1.png', 'AFM Topography', NULL, NULL, 2);

-- AORL45: PFM analysis (pages 2-3)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL45' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf pages 2-3. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-2-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-2-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-2-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-2-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3),
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-3-panel-2.png', 'PFM Amplitude', NULL, NULL, 4),
  ((SELECT id FROM ana_pfm), '/analysis/AORL45/page-3-panel-3.png', 'PFM Phase', NULL, NULL, 5);

-- AORL46: AFM analysis (page 4) — February record, kept for analysis
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL46' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 4.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL46/page-4-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL46/page-4-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL46: PFM analysis (page 4)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL46' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 4. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL46/page-4-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL46/page-4-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL46/page-4-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL46/page-4-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);

-- AORL47: AFM analysis (pages 5-6)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL47' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf pages 5-6.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL47/page-5-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL47/page-5-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1),
  ((SELECT id FROM ana_afm), '/analysis/AORL47/page-6-panel-1.png', 'AFM Topography', NULL, NULL, 2);

-- AORL47: PFM analysis (pages 5-6)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL47' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf pages 5-6. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-5-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-5-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-5-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-5-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3),
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-6-panel-2.png', 'PFM Amplitude', NULL, NULL, 4),
  ((SELECT id FROM ana_pfm), '/analysis/AORL47/page-6-panel-3.png', 'PFM Phase', NULL, NULL, 5);

-- AORL48: AFM analysis (page 7)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL48' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 7.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL48/page-7-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL48/page-7-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL48: PFM analysis (page 7)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL48' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 7. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL48/page-7-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL48/page-7-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL48/page-7-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL48/page-7-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);

-- AORL49: AFM analysis (page 8) — NOTE: temp conflict (slide 693 vs JSON 698)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL49' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 8.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL49/page-8-panel-1.png', 'AFM Topography', NULL, NULL, 0);

-- AORL49: PFM analysis (page 8)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL49' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 8. Slide label: 5%@LBFO/DSO. CONFLICT: slide temp 693°C vs JSON 698°C — JSON primary.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL49/page-8-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL49/page-8-panel-3.png', 'PFM Phase', NULL, NULL, 1);

-- AORL55: AFM analysis from slide deck
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL55' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf pages 9.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL55/page-9-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL55/page-9-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL55: PFM analysis from slide deck
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL55' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf pages 9. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL55/page-9-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL55/page-9-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL55/page-9-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL55/page-9-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);

-- AORL55: XRD analysis from slide deck
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL55' LIMIT 1
),
ana_xrd AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'XRD', 'Ashish',
    'XRD theta-2theta scan. Source: ashishmarch export.pdf page 10. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_xrd), '/analysis/AORL55/page-10-xrd.png', 'XRD θ-2θ', NULL, NULL, 0);

-- AORL56: AFM analysis (page 11)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL56' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 11.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL56/page-11-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL56/page-11-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL56: PFM analysis (page 11)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL56' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 11. Slide label: 5%@LBFO/DSO. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL56/page-11-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL56/page-11-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL56/page-11-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL56/page-11-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);

-- AORL57: AFM analysis (page 12) — BFO/DSO per slide deck
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL57' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 12. Material confirmed as BFO/DSO by slide deck.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL57/page-12-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL57/page-12-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL57: PFM analysis (page 12)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL57' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 12. Slide label: 5%@BFO/DSO. Material confirmed as BFO/DSO by slide deck. Growth params validated by slide.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL57/page-12-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL57/page-12-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL57/page-12-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL57/page-12-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);

-- AORL58: AFM analysis (page 14) — NOTE: temp conflict (slide 713 vs calibrated 706.4)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL58' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Ashish',
    'AFM topography from slide deck. Source: ashishmarch export.pdf page 14.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/analysis/AORL58/page-14-panel-1.png', 'AFM Topography', NULL, NULL, 0),
  ((SELECT id FROM ana_afm), '/analysis/AORL58/page-14-panel-4.png', 'AFM Topography (zoomed)', NULL, NULL, 1);

-- AORL58: PFM analysis (page 14)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL58' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Ashish',
    'PFM amplitude and phase from slide deck. Source: ashishmarch export.pdf page 14. Slide label: 5%@LBFO/DSO. CONFLICT: slide temp 713°C vs calibrated 706.4°C — JSON/calibrated primary.')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/analysis/AORL58/page-14-panel-2.png', 'PFM Amplitude', NULL, NULL, 0),
  ((SELECT id FROM ana_pfm), '/analysis/AORL58/page-14-panel-3.png', 'PFM Phase', NULL, NULL, 1),
  ((SELECT id FROM ana_pfm), '/analysis/AORL58/page-14-panel-5.png', 'PFM Amplitude (zoomed)', NULL, NULL, 2),
  ((SELECT id FROM ana_pfm), '/analysis/AORL58/page-14-panel-6.png', 'PFM Phase (zoomed)', NULL, NULL, 3);
