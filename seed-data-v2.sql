-- =============================================================================
-- PLD Tracker Seed Data v2: AORL44-AORL58
-- 15 depositions from handwritten notebook logs
-- Requires supabase-migration-v3.sql to be run first (adds new columns)
-- =============================================================================

-- ============================================================
-- AORL44: SQZ LBFO / DSO, 713C
-- ============================================================
WITH dep_aorl44 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-26', 'Aadit', 'SQZ LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713, 'BFO',
    12, 55, 4800,
    -1.2, 0.8, 1.44, 146.3,
    'After temperature calibration. Notebook also shows ''(930C)'' and ''(z = 3.2)'' near this run.', NULL,
    'AORL44', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl44;

-- ============================================================
-- AORL45: LBFO / DSO, 713C, good
-- ============================================================
WITH dep_aorl45 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-28', 'Aadit', 'LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 713, 'BFO',
    12, 55, 4800,
    0.3, -1.5, 1.53, -78.7,
    'Notebook shows ''(z = 3.4)'' and ''(good)''.', 4,
    'AORL45', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl45;

-- ============================================================
-- AORL46: LBRO / DSO, repeated AORL45 with cleaned target, better
-- ============================================================
WITH dep_aorl46 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-02-28', 'Aadit', 'LBRO / DSO', NULL, 'DSO',
    '(110)', '5x5 mm', NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL,
    1.0, 1.2, 1.56, 50.2,
    'Repeated AORL45 with cleaned target. Notebook shows ''(z = 3.4)'' and ''(better)''. Likely similar conditions to AORL45 but fields not explicitly recorded.', 5,
    'AORL46', NULL, NULL, NULL,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl46;

-- ============================================================
-- AORL47: LBFO / DSO, 703C, better
-- ============================================================
WITH dep_aorl47 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-01', 'Aadit', 'LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 703, 'BFO',
    12, 55, 4800,
    -0.5, -0.7, 0.86, -125.5,
    'Notebook also shows ''(920C)''.', 5,
    'AORL47', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl47;

-- ============================================================
-- AORL48: LBFO / DSO, 703C, 10Hz, too bad
-- ============================================================
WITH dep_aorl48 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-01', 'Aadit', 'LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 10,
    145, 703, 'BFO',
    12, 55, 4800,
    1.8, 0.2, 1.81, 6.3,
    'Notebook also shows ''(920C)''. Frequency appears increased to 10 Hz.', 1,
    'AORL48', 140, 8, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl48;

-- ============================================================
-- AORL49: LBFO / DSO, 693C
-- ============================================================
WITH dep_aorl49 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-02', 'Aadit', 'LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 693, 'BFO',
    12, 55, 4800,
    -1.8, -0.3, 1.82, -170.5,
    'Notebook also seems to show ''(910C)'' in parentheses.', NULL,
    'AORL49', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl49;

-- ============================================================
-- AORL50: STO / STO / Si, 930C
-- ============================================================
WITH dep_aorl50 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-02', 'Aadit', 'STO / STO / Si', 'SrTiO3', 'STO / Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 930, 'STO',
    12, 55, 1200,
    0.0, 0.5, 0.50, 90.0,
    'Notebook may also show ''(700)'' in parentheses; preserve uncertainty in notes.', NULL,
    'AORL50', 110, 4, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl50;

-- ============================================================
-- AORL51: STO / STO / Si, 933C, bad
-- ============================================================
WITH dep_aorl51 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-03', 'Aadit', 'STO / STO / Si', 'SrTiO3', 'STO / Si',
    '(001)', '10x10 mm', 1.5, 5,
    110, 933, 'STO',
    12, 55, 1200,
    -0.8, 1.6, 1.79, 116.6,
    'Notebook says ''bad'' and ''leakage was high (136?)''. Also may show ''(710C)'' in parentheses.', 2,
    'AORL51', 110, 4, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl51;

-- ============================================================
-- AORL52: STO / STO / Si, 910C
-- ============================================================
WITH dep_aorl52 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-03', 'Aadit', 'STO / STO / Si', 'SrTiO3', 'STO / Si',
    '(001)', '10x10 mm', 1.5, 4,
    110, 910, 'STO',
    12, 55, 960,
    0.6, -1.0, 1.17, -59.0,
    '', NULL,
    'AORL52', 110, 4, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl52;

-- ============================================================
-- AORL53: 27% LBFO / DSO, temp uncertain
-- ============================================================
WITH dep_aorl53 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Aadit', '27% LBFO / DSO', '27% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, NULL, 'BFO',
    12, 55, 4800,
    1.4, 1.4, 1.98, 45.0,
    'A value that looks like ''330C'' is written, but it is uncertain / suspicious. Keep temp unstructured.', NULL,
    'AORL53', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl53;

-- ============================================================
-- AORL54: S?O / STO / Si, 925C, illegible material
-- ============================================================
WITH dep_aorl54 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Aadit', 'S?O / STO / Si', 'S?O', 'STO / Si',
    '(001)', '10x10 mm', 1.5, 4,
    110, 925, 'STO',
    12, 55, 1200,
    -1.5, -1.3, 1.98, -139.1,
    'Material label is hard to read; preserved as ''S?O''. Post deposition line appears to read ''PD: 25C/min, 300 Torr''.', NULL,
    'AORL54', 110, 5, 14,
    300, 25
  ) RETURNING id
)
SELECT id FROM dep_aorl54;

-- ============================================================
-- AORL55: 5% LBFO / DSO, 938C
-- ============================================================
WITH dep_aorl55 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-04', 'Aadit', '5% LBFO / DSO', '5% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 938, 'BFO',
    12, 55, 4800,
    0.2, 0.1, 0.22, 26.6,
    '', NULL,
    'AORL55', 150, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl55;

-- ============================================================
-- AORL56: 5% LBFO / DSO, 948C
-- ============================================================
WITH dep_aorl56 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-05', 'Aadit', '5% LBFO / DSO', '5% La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 948, 'BFO',
    12, 55, 4800,
    -0.3, 1.8, 1.82, 99.5,
    '', NULL,
    'AORL56', 140, 20, 14,
    300, 30
  ) RETURNING id
)
SELECT id FROM dep_aorl56;

-- ============================================================
-- AORL57: BFO / DSO, 938C
-- ============================================================
WITH dep_aorl57 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-05', 'Aadit', 'BFO / DSO', 'BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 938, 'BFO',
    12, 55, 4800,
    1.6, -0.9, 1.84, -29.4,
    'Material line reads like ''BFO/DSO''. Handwriting is somewhat ambiguous.', NULL,
    'AORL57', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl57;

-- ============================================================
-- AORL58: LBFO / DSO, 931C
-- ============================================================
WITH dep_aorl58 AS (
  INSERT INTO depositions (
    date, researcher, material_system, film_composition, substrate_type,
    substrate_orientation, substrate_size, laser_fluence, laser_frequency,
    oxygen_pressure, substrate_temperature, target_material,
    target_rotation_speed, target_substrate_distance, pulse_count,
    x_position, y_position, radial_distance, angle,
    notes, quality_rating,
    run_id, laser_energy_mj, deposition_time_min, heater_current_a,
    post_deposition_pressure_torr, cooling_rate_c_per_min
  ) VALUES (
    '2026-03-06', 'Aadit', 'LBFO / DSO', 'La-doped BiFeO3', 'DSO',
    '(110)', '5x5 mm', 2.0, 4,
    145, 931, 'BFO',
    12, 55, 4800,
    -0.1, -1.9, 1.90, -93.0,
    'Notebook also shows something like ''(9?-22?)'' near the run ID; unclear.', NULL,
    'AORL58', 140, 20, 14,
    NULL, NULL
  ) RETURNING id
)
SELECT id FROM dep_aorl58;

-- ============================================================
-- Demo analysis entries for a few AORL depositions
-- (for testing the analysis image gallery)
-- ============================================================

-- AFM analysis for AORL45 (good quality)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL45' LIMIT 1
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Aadit', '5um scan, smooth terraces visible')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/demo-images/afm-5um.svg', 'AFM topography 5um scan', 5, 'um', 0),
  ((SELECT id FROM ana_afm), '/demo-images/afm-1um.svg', 'AFM topography 1um scan - terrace detail', 1, 'um', 1);

-- PFM analysis for AORL47 (better quality)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL47' LIMIT 1
),
ana_pfm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'PFM', 'Aadit', 'Piezoresponse force microscopy, clear domain structure')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_pfm), '/demo-images/pfm-5um.svg', 'PFM amplitude 5um scan', 5, 'um', 0),
  ((SELECT id FROM ana_pfm), '/demo-images/pfm-10um.svg', 'PFM phase 10um scan', 10, 'um', 1);

-- XRD + AFM for AORL55 (5% LBFO)
WITH target_dep AS (
  SELECT id FROM depositions WHERE run_id = 'AORL55' LIMIT 1
),
ana_xrd AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'XRD', 'Aadit', 'Theta-2theta scan, good (001) peak')
  RETURNING id
),
ana_afm AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM target_dep), 'AFM', 'Aadit', '10um scan overview')
  RETURNING id
)
INSERT INTO analysis_images (analysis_id, image_url, caption, scan_size_value, scan_size_unit, image_order)
VALUES
  ((SELECT id FROM ana_afm), '/demo-images/afm-10um.svg', 'AFM topography 10um overview', 10, 'um', 0),
  ((SELECT id FROM ana_afm), '/demo-images/afm-5um.svg', 'AFM topography 5um detail', 5, 'um', 1);
