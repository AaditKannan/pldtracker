-- =============================================================================
-- PLD Tracker Seed Data
-- 35 depositions, ~50 analyses, ~150 metrics
-- Correlation patterns embedded:
--   - Higher temp BiFeO3 -> lower XRD FWHM (better crystallinity)
--   - Higher pulse count -> greater film thickness (~0.025 nm/pulse)
--   - Greater radial distance -> higher AFM roughness
--   - Quality correlates with low FWHM and low roughness
--   - BiFeO3 PFM d33: 20-70 pm/V
-- =============================================================================

-- ============================================================
-- Deposition 1: BiFeO3 on STO, 790C, center -> excellent
-- ============================================================
WITH dep1 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-01-08', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 5, 100, 790, 'BiFeO3', 12, 55, 8000, 0.5, -0.3, 0.58, -30.96, 'Excellent crystallinity, sharp RHEED oscillations observed', 5)
  RETURNING id
),
ana1a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep1), 'XRD', 'Alice Chen', 'Theta-2theta scan, very sharp (001) peak')
  RETURNING id
),
ana1b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep1), 'AFM', 'Lab Assistant', '1um x 1um scan, atomically smooth terraces visible')
  RETURNING id
),
ana1c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep1), 'PFM', 'Alice Chen', 'Clear ferroelectric switching observed')
  RETURNING id
),
met1a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana1a), 'fwhm', 0.08, 'deg'),
    ((SELECT id FROM ana1a), 'peak_position', 22.39, '2theta (deg)'),
    ((SELECT id FROM ana1a), 'lattice_parameter', 3.965, 'angstrom')
  RETURNING id
),
met1b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana1b), 'rms_roughness', 0.35, 'nm'),
    ((SELECT id FROM ana1b), 'peak_to_valley', 2.1, 'nm'),
    ((SELECT id FROM ana1b), 'scan_size', 1.0, 'um')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana1c), 'd33', 58.3, 'pm/V'),
  ((SELECT id FROM ana1c), 'coercive_voltage', 3.2, 'V');

-- ============================================================
-- Deposition 2: BiFeO3 on STO, 700C, mid radius
-- ============================================================
WITH dep2 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-01-22', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.2, 5, 100, 700, 'BiFeO3', 12, 55, 6000, 8.5, 6.2, 10.52, 36.10, 'Moderate crystallinity, slight haze on surface', 3)
  RETURNING id
),
ana2a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep2), 'XRD', 'Alice Chen', 'Broad (001) peak visible')
  RETURNING id
),
ana2b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep2), 'AFM', 'Lab Assistant', '5um x 5um scan')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana2a), 'fwhm', 0.18, 'deg'),
  ((SELECT id FROM ana2a), 'peak_position', 22.36, '2theta (deg)'),
  ((SELECT id FROM ana2a), 'lattice_parameter', 3.968, 'angstrom'),
  ((SELECT id FROM ana2b), 'rms_roughness', 3.2, 'nm'),
  ((SELECT id FROM ana2b), 'peak_to_valley', 18.5, 'nm'),
  ((SELECT id FROM ana2b), 'scan_size', 5.0, 'um');

-- ============================================================
-- Deposition 3: BiFeO3 on LAO, 560C, edge -> poor
-- ============================================================
WITH dep3 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-02-05', 'Bob Martinez', 'BiFeO3', 'BiFeO3', 'LaAlO3', '(001)', '5x5 mm', 1.8, 3, 50, 560, 'BiFeO3', 10, 50, 3000, -16.2, 12.8, 20.64, 141.68, 'Poor crystallinity at this temperature, polycrystalline', 2)
  RETURNING id
),
ana3a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep3), 'XRD', 'Bob Martinez', 'Very broad peaks, polycrystalline film')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana3a), 'fwhm', 0.42, 'deg'),
  ((SELECT id FROM ana3a), 'peak_position', 22.31, '2theta (deg)'),
  ((SELECT id FROM ana3a), 'lattice_parameter', 3.975, 'angstrom');

-- ============================================================
-- Deposition 4: LSMO on STO, 780C, center -> great
-- ============================================================
WITH dep4 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-02-14', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'SrTiO3', '(001)', '10x10 mm', 1.5, 3, 200, 780, 'La0.7Sr0.3MnO3', 15, 60, 12000, -1.2, 0.8, 1.44, 146.31, 'Excellent LSMO film, good epitaxy on STO', 5)
  RETURNING id
),
ana4a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep4), 'XRD', 'Priya Sharma', 'Sharp (002) peak with Laue fringes')
  RETURNING id
),
ana4b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep4), 'XRR', 'Priya Sharma', 'Well-defined Kiessig fringes, smooth interfaces')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana4a), 'fwhm', 0.07, 'deg'),
  ((SELECT id FROM ana4a), 'peak_position', 46.47, '2theta (deg)'),
  ((SELECT id FROM ana4a), 'lattice_parameter', 3.905, 'angstrom'),
  ((SELECT id FROM ana4b), 'film_thickness', 298.5, 'nm'),
  ((SELECT id FROM ana4b), 'density', 6.45, 'g/cm3'),
  ((SELECT id FROM ana4b), 'roughness', 0.42, 'nm');

-- ============================================================
-- Deposition 5: STO on Si, 680C
-- ============================================================
WITH dep5 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-02-28', 'Bob Martinez', 'SrTiO3', 'SrTiO3', 'Si', '(100)', '10x10 mm', 2.5, 5, 50, 680, 'SrTiO3', 8, 52, 5000, 5.0, 3.2, 5.94, 32.62, 'Buffer layer growth on Si, some orientation spread', 3)
  RETURNING id
),
ana5a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep5), 'XRD', 'Bob Martinez', 'Weak (001) STO peak on Si')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana5a), 'fwhm', 0.25, 'deg'),
  ((SELECT id FROM ana5a), 'peak_position', 22.78, '2theta (deg)'),
  ((SELECT id FROM ana5a), 'lattice_parameter', 3.910, 'angstrom');

-- ============================================================
-- Deposition 6: BTO on STO, 770C, center
-- ============================================================
WITH dep6 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-03-10', 'Alice Chen', 'BaTiO3', 'BaTiO3', 'SrTiO3', '(001)', '5x5 mm', 1.8, 4, 150, 770, 'BaTiO3', 14, 58, 10000, -0.8, 1.1, 1.36, 126.07, 'Good BTO growth, tetragonal phase confirmed', 4)
  RETURNING id
),
ana6a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep6), 'XRD', 'Alice Chen', 'Clear c-axis oriented BTO peak splitting')
  RETURNING id
),
ana6b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep6), 'PFM', 'Alice Chen', 'Butterfly loop observed, ferroelectric domains visible')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana6a), 'fwhm', 0.11, 'deg'),
  ((SELECT id FROM ana6a), 'peak_position', 22.17, '2theta (deg)'),
  ((SELECT id FROM ana6a), 'lattice_parameter', 4.013, 'angstrom'),
  ((SELECT id FROM ana6b), 'd33', 42.1, 'pm/V'),
  ((SELECT id FROM ana6b), 'coercive_voltage', 2.8, 'V');

-- ============================================================
-- Deposition 7: BiFeO3 on STO, 750C, near center
-- ============================================================
WITH dep7 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-03-18', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.1, 5, 100, 750, 'BiFeO3', 12, 55, 15000, 2.0, -1.5, 2.50, -36.87, 'Good film, slight Bi excess visible in XPS', 4)
  RETURNING id
),
ana7a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep7), 'XRD', 'Alice Chen', 'Sharp peaks, Bi-rich secondary phase trace')
  RETURNING id
),
ana7b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep7), 'AFM', 'Lab Assistant', '2um x 2um scan area')
  RETURNING id
),
ana7c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep7), 'PFM', 'Alice Chen', 'Strong piezoresponse, stripe domain pattern')
  RETURNING id
),
met7a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana7a), 'fwhm', 0.10, 'deg'),
    ((SELECT id FROM ana7a), 'peak_position', 22.40, '2theta (deg)'),
    ((SELECT id FROM ana7a), 'lattice_parameter', 3.964, 'angstrom')
  RETURNING id
),
met7b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana7b), 'rms_roughness', 1.1, 'nm'),
    ((SELECT id FROM ana7b), 'peak_to_valley', 6.8, 'nm'),
    ((SELECT id FROM ana7b), 'scan_size', 2.0, 'um')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana7c), 'd33', 65.2, 'pm/V'),
  ((SELECT id FROM ana7c), 'coercive_voltage', 2.9, 'V');

-- ============================================================
-- Deposition 8: LSMO on LAO, 760C
-- ============================================================
WITH dep8 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-03-28', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'LaAlO3', '(001)', '5x5 mm', 1.6, 3, 250, 760, 'La0.7Sr0.3MnO3', 14, 58, 4000, -3.5, -4.8, 5.94, -126.09, 'Good epitaxy on LAO, tensile strain', 4)
  RETURNING id
),
ana8a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep8), 'XRD', 'Priya Sharma', 'Clear peak separation from LAO substrate')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana8a), 'fwhm', 0.09, 'deg'),
  ((SELECT id FROM ana8a), 'peak_position', 47.52, '2theta (deg)'),
  ((SELECT id FROM ana8a), 'lattice_parameter', 3.875, 'angstrom');

-- ============================================================
-- Deposition 9: BiFeO3 on MgO, 650C, far from center -> mediocre
-- ============================================================
WITH dep9 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-04-02', 'Bob Martinez', 'BiFeO3', 'BiFeO3', 'MgO', '(001)', '10x10 mm', 2.3, 5, 80, 650, 'BiFeO3', 10, 50, 10000, 18.5, -14.2, 23.32, -37.52, 'Large lattice mismatch with MgO, textured polycrystalline', 2)
  RETURNING id
),
ana9a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep9), 'SEM', 'Lab Assistant', 'Granular surface morphology')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana9a), 'grain_size', 45.0, 'nm'),
  ((SELECT id FROM ana9a), 'magnification', 50000, 'x');

-- ============================================================
-- Deposition 10: STO on LAO, 800C, center -> excellent
-- ============================================================
WITH dep10 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-04-15', 'Priya Sharma', 'SrTiO3', 'SrTiO3', 'LaAlO3', '(001)', '10x10 mm', 2.0, 4, 100, 800, 'SrTiO3', 16, 55, 8000, 0.2, 0.1, 0.22, 26.57, 'Homoepitaxial-quality STO on LAO, Laue fringes visible', 5)
  RETURNING id
),
ana10a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep10), 'XRD', 'Priya Sharma', 'Beautiful thickness fringes around (002)')
  RETURNING id
),
ana10b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep10), 'AFM', 'Priya Sharma', 'Unit-cell step terraces clearly resolved')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana10a), 'fwhm', 0.06, 'deg'),
  ((SELECT id FROM ana10a), 'peak_position', 46.48, '2theta (deg)'),
  ((SELECT id FROM ana10a), 'lattice_parameter', 3.904, 'angstrom'),
  ((SELECT id FROM ana10b), 'rms_roughness', 0.18, 'nm'),
  ((SELECT id FROM ana10b), 'peak_to_valley', 0.95, 'nm'),
  ((SELECT id FROM ana10b), 'scan_size', 2.0, 'um');

-- ============================================================
-- Deposition 11: BiFeO3 on STO, 600C, mid radius -> poor
-- ============================================================
WITH dep11 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-04-25', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 5, 100, 600, 'BiFeO3', 12, 55, 4000, -9.0, 7.5, 11.72, 140.19, 'Low temperature growth, rough surface expected', 2)
  RETURNING id
),
ana11a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep11), 'XRD', 'Alice Chen', 'Broad peak, poor crystallinity at this temperature')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana11a), 'fwhm', 0.38, 'deg'),
  ((SELECT id FROM ana11a), 'peak_position', 22.33, '2theta (deg)'),
  ((SELECT id FROM ana11a), 'lattice_parameter', 3.972, 'angstrom');

-- ============================================================
-- Deposition 12: BTO on STO, 700C, far radius
-- ============================================================
WITH dep12 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-05-05', 'Bob Martinez', 'BaTiO3', 'BaTiO3', 'SrTiO3', '(001)', '10x10 mm', 1.9, 4, 150, 700, 'BaTiO3', 13, 56, 7000, 22.0, 15.5, 26.91, 35.14, 'Edge position, thickness gradient expected', 3)
  RETURNING id
),
ana12a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep12), 'AFM', 'Bob Martinez', 'Elevated roughness at edge position')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana12a), 'rms_roughness', 6.8, 'nm'),
  ((SELECT id FROM ana12a), 'peak_to_valley', 42.1, 'nm'),
  ((SELECT id FROM ana12a), 'scan_size', 5.0, 'um');

-- ============================================================
-- Deposition 13: LSMO on STO, 780C, high pulse count
-- ============================================================
WITH dep13 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-05-14', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'SrTiO3', '(001)', '10x10 mm', 1.5, 3, 200, 780, 'La0.7Sr0.3MnO3', 15, 60, 20000, 1.0, 2.2, 2.42, 65.56, 'Thick LSMO film for transport measurements', 4)
  RETURNING id
),
ana13a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep13), 'profilometry', 'Lab Assistant', 'Film thickness verification')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana13a), 'film_thickness', 508.0, 'nm'),
  ((SELECT id FROM ana13a), 'step_height', 502.0, 'nm');

-- ============================================================
-- Deposition 14: BiFeO3 on LAO, 800C, center -> excellent
-- ============================================================
WITH dep14 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-05-28', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'LaAlO3', '(001)', '5x5 mm', 2.0, 5, 100, 800, 'BiFeO3', 12, 55, 6000, -0.3, 0.2, 0.36, 146.31, 'Best BFO run on LAO, compressive strain stabilized', 5)
  RETURNING id
),
ana14a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep14), 'XRD', 'Alice Chen', 'Very sharp (001) peak, pure phase')
  RETURNING id
),
ana14b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep14), 'AFM', 'Alice Chen', 'Smooth surface with step-terrace structure')
  RETURNING id
),
ana14c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep14), 'PFM', 'Alice Chen', 'Strong d33, 71-degree domain walls')
  RETURNING id
),
met14a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana14a), 'fwhm', 0.07, 'deg'),
    ((SELECT id FROM ana14a), 'peak_position', 22.42, '2theta (deg)'),
    ((SELECT id FROM ana14a), 'lattice_parameter', 3.962, 'angstrom')
  RETURNING id
),
met14b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana14b), 'rms_roughness', 0.28, 'nm'),
    ((SELECT id FROM ana14b), 'peak_to_valley', 1.8, 'nm'),
    ((SELECT id FROM ana14b), 'scan_size', 1.0, 'um')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana14c), 'd33', 68.5, 'pm/V'),
  ((SELECT id FROM ana14c), 'coercive_voltage', 2.7, 'V');

-- ============================================================
-- Deposition 15: Failed run — heater malfunction
-- ============================================================
WITH dep15 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-06-03', 'Bob Martinez', 'SrTiO3', 'SrTiO3', 'MgO', '(001)', '10x10 mm', 2.5, 5, 50, 580, 'SrTiO3', 8, 52, 2000, 0.0, 0.0, 0.0, 0.0, 'Failed — heater malfunction at 580C, run aborted after 2000 pulses. Temperature dropped to 400C mid-deposition.', 1)
  RETURNING id
),
ana15a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep15), 'XRD', 'Bob Martinez', 'Amorphous film, no crystalline peaks')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana15a), 'fwhm', 0.95, 'deg'),
  ((SELECT id FROM ana15a), 'peak_position', 22.70, '2theta (deg)');

-- ============================================================
-- Deposition 16: BTO on LAO, 750C, near center
-- ============================================================
WITH dep16 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-06-12', 'Priya Sharma', 'BaTiO3', 'BaTiO3', 'LaAlO3', '(001)', '5x5 mm', 1.8, 4, 180, 750, 'BaTiO3', 14, 57, 9000, 3.0, -2.0, 3.61, -33.69, 'BTO on LAO, large compressive strain', 4)
  RETURNING id
),
ana16a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep16), 'XRD', 'Priya Sharma', 'Enhanced c/a ratio due to compressive strain')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana16a), 'fwhm', 0.13, 'deg'),
  ((SELECT id FROM ana16a), 'peak_position', 22.05, '2theta (deg)'),
  ((SELECT id FROM ana16a), 'lattice_parameter', 4.035, 'angstrom');

-- ============================================================
-- Deposition 17: BiFeO3 on STO, 720C, mid radius
-- ============================================================
WITH dep17 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-06-20', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.1, 5, 120, 720, 'BiFeO3', 11, 54, 12000, 10.0, -5.5, 11.41, -28.81, 'Temperature optimization series run 3/5', 3)
  RETURNING id
),
ana17a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep17), 'XRD', 'Alice Chen', 'Moderate FWHM, room for improvement')
  RETURNING id
),
ana17b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep17), 'PFM', 'Alice Chen', 'Piezoresponse present but weaker than 750C films')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana17a), 'fwhm', 0.16, 'deg'),
  ((SELECT id FROM ana17a), 'peak_position', 22.37, '2theta (deg)'),
  ((SELECT id FROM ana17a), 'lattice_parameter', 3.967, 'angstrom'),
  ((SELECT id FROM ana17b), 'd33', 38.4, 'pm/V'),
  ((SELECT id FROM ana17b), 'coercive_voltage', 4.1, 'V');

-- ============================================================
-- Deposition 18: LSMO on MgO, 700C, edge
-- ============================================================
WITH dep18 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-07-01', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'MgO', '(001)', '10x10 mm', 1.6, 3, 200, 700, 'La0.7Sr0.3MnO3', 15, 60, 8000, -25.0, 18.0, 30.81, 144.25, 'LSMO on MgO, large mismatch, edge position', 2)
  RETURNING id
),
ana18a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep18), 'AFM', 'Priya Sharma', 'Very rough at this edge position')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana18a), 'rms_roughness', 8.2, 'nm'),
  ((SELECT id FROM ana18a), 'peak_to_valley', 58.0, 'nm'),
  ((SELECT id FROM ana18a), 'scan_size', 5.0, 'um');

-- ============================================================
-- Deposition 19: BiFeO3 on STO, 680C, near center
-- ============================================================
WITH dep19 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-07-10', 'Bob Martinez', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '5x5 mm', 2.0, 5, 100, 680, 'BiFeO3', 12, 55, 5000, -2.5, 3.0, 3.91, 129.81, 'Temperature series, 680C data point', 3)
  RETURNING id
),
ana19a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep19), 'XRD', 'Bob Martinez', 'Moderate peak width')
  RETURNING id
),
ana19b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep19), 'AFM', 'Lab Assistant', 'Slightly rough but acceptable')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana19a), 'fwhm', 0.22, 'deg'),
  ((SELECT id FROM ana19a), 'peak_position', 22.35, '2theta (deg)'),
  ((SELECT id FROM ana19a), 'lattice_parameter', 3.970, 'angstrom'),
  ((SELECT id FROM ana19b), 'rms_roughness', 2.1, 'nm'),
  ((SELECT id FROM ana19b), 'peak_to_valley', 14.5, 'nm'),
  ((SELECT id FROM ana19b), 'scan_size', 2.0, 'um');

-- ============================================================
-- Deposition 20: STO on STO (homoepitaxy), 750C
-- ============================================================
WITH dep20 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-07-22', 'Priya Sharma', 'SrTiO3', 'SrTiO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 4, 100, 750, 'SrTiO3', 16, 55, 3000, 0.0, 0.5, 0.50, 90.00, 'Homoepitaxial STO, calibration run for growth rate', 5)
  RETURNING id
),
ana20a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep20), 'XRR', 'Priya Sharma', 'Excellent Kiessig fringes for thickness determination')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana20a), 'film_thickness', 74.2, 'nm'),
  ((SELECT id FROM ana20a), 'density', 5.12, 'g/cm3'),
  ((SELECT id FROM ana20a), 'roughness', 0.22, 'nm');

-- ============================================================
-- Deposition 21: BiFeO3 on STO, 775C, near center, high pulses
-- ============================================================
WITH dep21 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-08-05', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 5, 100, 775, 'BiFeO3', 12, 55, 18000, 1.5, -0.8, 1.70, -28.07, 'Thick BFO film for strain relaxation study', 4)
  RETURNING id
),
ana21a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep21), 'XRD', 'Alice Chen', 'Sharp peak, slight broadening from thickness')
  RETURNING id
),
ana21b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep21), 'profilometry', 'Lab Assistant', 'Thickness consistent with pulse count')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana21a), 'fwhm', 0.09, 'deg'),
  ((SELECT id FROM ana21a), 'peak_position', 22.40, '2theta (deg)'),
  ((SELECT id FROM ana21a), 'lattice_parameter', 3.964, 'angstrom'),
  ((SELECT id FROM ana21b), 'film_thickness', 455.0, 'nm'),
  ((SELECT id FROM ana21b), 'step_height', 448.0, 'nm');

-- ============================================================
-- Deposition 22: BTO on MgO, 720C, mid radius
-- ============================================================
WITH dep22 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-08-18', 'Bob Martinez', 'BaTiO3', 'BaTiO3', 'MgO', '(001)', '10x10 mm', 1.9, 4, 150, 720, 'BaTiO3', 13, 57, 6000, -12.0, 8.0, 14.42, 146.31, 'BTO on MgO, relaxed film expected', 3)
  RETURNING id
),
ana22a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep22), 'AFM', 'Lab Assistant', 'Moderate roughness at this position')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana22a), 'rms_roughness', 4.5, 'nm'),
  ((SELECT id FROM ana22a), 'peak_to_valley', 28.0, 'nm'),
  ((SELECT id FROM ana22a), 'scan_size', 5.0, 'um');

-- ============================================================
-- Deposition 23: BiFeO3 on STO, 550C (lowest temp) -> poor
-- ============================================================
WITH dep23 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-08-28', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '5x5 mm', 2.0, 5, 100, 550, 'BiFeO3', 12, 55, 5000, 4.0, 2.0, 4.47, 26.57, 'Lowest temp in series — mostly amorphous', 1)
  RETURNING id
),
ana23a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep23), 'XRD', 'Alice Chen', 'Nearly amorphous, very broad hump')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana23a), 'fwhm', 0.48, 'deg'),
  ((SELECT id FROM ana23a), 'peak_position', 22.25, '2theta (deg)');

-- ============================================================
-- Deposition 24: LSMO on STO, 760C, center, low pulses
-- ============================================================
WITH dep24 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-09-05', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'SrTiO3', '(001)', '10x10 mm', 1.5, 3, 200, 760, 'La0.7Sr0.3MnO3', 15, 60, 1000, -0.5, -1.0, 1.12, -116.57, 'Ultra-thin LSMO for dead layer study', 4)
  RETURNING id
),
ana24a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep24), 'XRR', 'Priya Sharma', 'Many Kiessig fringes, very smooth film')
  RETURNING id
),
ana24b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep24), 'AFM', 'Priya Sharma', 'Atomically flat surface preserved')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana24a), 'film_thickness', 25.8, 'nm'),
  ((SELECT id FROM ana24a), 'density', 6.42, 'g/cm3'),
  ((SELECT id FROM ana24a), 'roughness', 0.30, 'nm'),
  ((SELECT id FROM ana24b), 'rms_roughness', 0.25, 'nm'),
  ((SELECT id FROM ana24b), 'peak_to_valley', 1.5, 'nm'),
  ((SELECT id FROM ana24b), 'scan_size', 1.0, 'um');

-- ============================================================
-- Deposition 25: BiFeO3 on LAO, 770C, mid radius
-- ============================================================
WITH dep25 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-09-15', 'Bob Martinez', 'BiFeO3', 'BiFeO3', 'LaAlO3', '(001)', '10x10 mm', 2.2, 5, 100, 770, 'BiFeO3', 11, 54, 10000, 7.0, -9.5, 11.80, -53.63, 'BFO on LAO, slight twin domains from LAO substrate', 4)
  RETURNING id
),
ana25a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep25), 'XRD', 'Bob Martinez', 'Sharp peak, twin splitting from LAO visible')
  RETURNING id
),
ana25b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep25), 'PFM', 'Alice Chen', 'Mosaic ferroelectric domains')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana25a), 'fwhm', 0.10, 'deg'),
  ((SELECT id FROM ana25a), 'peak_position', 22.41, '2theta (deg)'),
  ((SELECT id FROM ana25a), 'lattice_parameter', 3.963, 'angstrom'),
  ((SELECT id FROM ana25b), 'd33', 55.0, 'pm/V'),
  ((SELECT id FROM ana25b), 'coercive_voltage', 3.0, 'V');

-- ============================================================
-- Deposition 26: STO on Si, 650C, high fluence
-- ============================================================
WITH dep26 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-09-25', 'Bob Martinez', 'SrTiO3', 'SrTiO3', 'Si', '(100)', '10x10 mm', 3.2, 8, 30, 650, 'SrTiO3', 8, 48, 7000, 15.0, 10.0, 18.03, 33.69, 'High fluence STO on Si, particulate issue suspected', 2)
  RETURNING id
),
ana26a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep26), 'SEM', 'Lab Assistant', 'Visible particulates on surface from high fluence')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana26a), 'grain_size', 85.0, 'nm'),
  ((SELECT id FROM ana26a), 'magnification', 25000, 'x');

-- ============================================================
-- Deposition 27: BTO on STO, 780C, center -> very good
-- ============================================================
WITH dep27 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-10-03', 'Alice Chen', 'BaTiO3', 'BaTiO3', 'SrTiO3', '(001)', '10x10 mm', 1.7, 4, 150, 780, 'BaTiO3', 14, 58, 4000, -1.0, 0.5, 1.12, 153.43, 'Optimized BTO conditions, very smooth', 5)
  RETURNING id
),
ana27a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep27), 'XRD', 'Alice Chen', 'Sharp tetragonal BTO peak')
  RETURNING id
),
ana27b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep27), 'AFM', 'Lab Assistant', 'Atomically smooth terraces')
  RETURNING id
),
ana27c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep27), 'PFM', 'Alice Chen', 'Clear 180-degree domain switching')
  RETURNING id
),
met27a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana27a), 'fwhm', 0.08, 'deg'),
    ((SELECT id FROM ana27a), 'peak_position', 22.15, '2theta (deg)'),
    ((SELECT id FROM ana27a), 'lattice_parameter', 4.016, 'angstrom')
  RETURNING id
),
met27b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana27b), 'rms_roughness', 0.30, 'nm'),
    ((SELECT id FROM ana27b), 'peak_to_valley', 2.0, 'nm'),
    ((SELECT id FROM ana27b), 'scan_size', 2.0, 'um')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana27c), 'd33', 48.2, 'pm/V'),
  ((SELECT id FROM ana27c), 'coercive_voltage', 2.5, 'V');

-- ============================================================
-- Deposition 28: LSMO on LAO, 740C, moderate radius
-- ============================================================
WITH dep28 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-10-12', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'LaAlO3', '(001)', '10x10 mm', 1.6, 3, 220, 740, 'La0.7Sr0.3MnO3', 14, 58, 6000, -6.0, 8.5, 10.40, 125.22, 'LSMO on LAO for transport study, mid radius', 3)
  RETURNING id
),
ana28a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep28), 'profilometry', 'Lab Assistant', 'Thickness check for growth rate')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana28a), 'film_thickness', 152.0, 'nm'),
  ((SELECT id FROM ana28a), 'step_height', 148.5, 'nm');

-- ============================================================
-- Deposition 29: BiFeO3 on STO, 580C, edge -> bad
-- ============================================================
WITH dep29 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-10-22', 'Bob Martinez', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 5, 80, 580, 'BiFeO3', 12, 55, 8000, 20.0, -28.0, 34.41, -54.46, 'Low temp + edge position, worst case scenario', 1)
  RETURNING id
),
ana29a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep29), 'AFM', 'Lab Assistant', 'Extremely rough surface at far edge')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana29a), 'rms_roughness', 11.5, 'nm'),
  ((SELECT id FROM ana29a), 'peak_to_valley', 78.0, 'nm'),
  ((SELECT id FROM ana29a), 'grain_size', 18.0, 'nm');

-- ============================================================
-- Deposition 30: STO on LAO, 780C, low pulses -> thin film
-- ============================================================
WITH dep30 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-11-03', 'Priya Sharma', 'SrTiO3', 'SrTiO3', 'LaAlO3', '(001)', '5x5 mm', 2.0, 4, 100, 780, 'SrTiO3', 16, 55, 1500, 0.0, 0.0, 0.0, 0.0, 'Ultra-thin STO spacer layer, 2DEG interface study', 4)
  RETURNING id
),
ana30a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep30), 'XRR', 'Priya Sharma', 'Clear fringes from very thin film')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana30a), 'film_thickness', 38.5, 'nm'),
  ((SELECT id FROM ana30a), 'density', 5.10, 'g/cm3'),
  ((SELECT id FROM ana30a), 'roughness', 0.35, 'nm');

-- ============================================================
-- Deposition 31: BiFeO3 on STO, 760C, moderate position
-- ============================================================
WITH dep31 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-11-12', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 5, 100, 760, 'BiFeO3', 12, 55, 8000, -5.0, 4.0, 6.40, 141.34, 'BFO series, 760C data point, slightly off-center', 4)
  RETURNING id
),
ana31a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep31), 'XRD', 'Alice Chen', 'Good peak, slightly wider than 790C film')
  RETURNING id
),
ana31b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep31), 'AFM', 'Lab Assistant', 'Smooth with small grain features')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana31a), 'fwhm', 0.12, 'deg'),
  ((SELECT id FROM ana31a), 'peak_position', 22.38, '2theta (deg)'),
  ((SELECT id FROM ana31a), 'lattice_parameter', 3.966, 'angstrom'),
  ((SELECT id FROM ana31b), 'rms_roughness', 2.5, 'nm'),
  ((SELECT id FROM ana31b), 'peak_to_valley', 15.0, 'nm'),
  ((SELECT id FROM ana31b), 'scan_size', 2.0, 'um');

-- ============================================================
-- Deposition 32: Failed run — wrong target loaded
-- ============================================================
WITH dep32 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-11-20', 'Bob Martinez', 'BaTiO3', 'BaTiO3', 'SrTiO3', '(001)', '10x10 mm', 1.8, 4, 150, 750, 'BaTiO3', 13, 57, 1200, 0.0, 0.0, 0.0, 0.0, 'Failed — discovered wrong target (STO instead of BTO) was loaded after 1200 pulses. Run aborted. Substrate discarded.', 1)
  RETURNING id
)
INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
VALUES ((SELECT id FROM dep32), 'XRD', 'Bob Martinez', 'Confirmed wrong composition by XRD — no BTO peaks');

-- ============================================================
-- Deposition 33: BiFeO3 on STO, 740C, moderate radius
-- ============================================================
WITH dep33 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-11-28', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'SrTiO3', '(001)', '10x10 mm', 2.0, 6, 110, 740, 'BiFeO3', 12, 55, 10000, 8.0, 6.0, 10.00, 36.87, 'Reproducibility check, same conditions as earlier run', 4)
  RETURNING id
),
ana33a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep33), 'Raman', 'Lab Assistant', 'Raman confirms rhombohedral BFO phase')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana33a), 'peak_position', 136.5, 'cm-1');

-- ============================================================
-- Deposition 34: LSMO on STO, 790C, center, 16000 pulses
-- ============================================================
WITH dep34 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-12-05', 'Priya Sharma', 'La0.7Sr0.3MnO3', 'La0.7Sr0.3MnO3', 'SrTiO3', '(001)', '10x10 mm', 1.4, 2, 250, 790, 'La0.7Sr0.3MnO3', 16, 62, 16000, -0.2, 0.3, 0.36, 123.69, 'Thick LSMO for magneto-transport, optimized conditions', 5)
  RETURNING id
),
ana34a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep34), 'XRD', 'Priya Sharma', 'Sharp peak, fully strained even at this thickness')
  RETURNING id
),
ana34b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep34), 'profilometry', 'Lab Assistant', 'Step height at masked edge')
  RETURNING id
),
ana34c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep34), 'AFM', 'Priya Sharma', 'Smooth surface despite large thickness')
  RETURNING id
),
met34a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana34a), 'fwhm', 0.08, 'deg'),
    ((SELECT id FROM ana34a), 'peak_position', 46.48, '2theta (deg)'),
    ((SELECT id FROM ana34a), 'lattice_parameter', 3.904, 'angstrom')
  RETURNING id
),
met34b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana34b), 'film_thickness', 405.0, 'nm'),
    ((SELECT id FROM ana34b), 'step_height', 398.0, 'nm')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana34c), 'rms_roughness', 0.45, 'nm'),
  ((SELECT id FROM ana34c), 'peak_to_valley', 3.2, 'nm'),
  ((SELECT id FROM ana34c), 'scan_size', 2.0, 'um');

-- ============================================================
-- Deposition 35: BiFeO3 on LAO, 790C, near center, high pulses
-- ============================================================
WITH dep35 AS (
  INSERT INTO depositions (date, researcher, material_system, film_composition, substrate_type, substrate_orientation, substrate_size, laser_fluence, laser_frequency, oxygen_pressure, substrate_temperature, target_material, target_rotation_speed, target_substrate_distance, pulse_count, x_position, y_position, radial_distance, angle, notes, quality_rating)
  VALUES ('2025-12-15', 'Alice Chen', 'BiFeO3', 'BiFeO3', 'LaAlO3', '(001)', '10x10 mm', 2.0, 5, 100, 790, 'BiFeO3', 12, 55, 14000, -2.0, 1.5, 2.50, 143.13, 'Year-end optimized BFO on LAO — record d33 achieved', 5)
  RETURNING id
),
ana35a AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep35), 'XRD', 'Alice Chen', 'Extremely sharp peak, best FWHM this year')
  RETURNING id
),
ana35b AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep35), 'AFM', 'Alice Chen', 'Sub-angstrom roughness, step-flow growth mode')
  RETURNING id
),
ana35c AS (
  INSERT INTO analyses (deposition_id, analysis_type, operator_name, notes)
  VALUES ((SELECT id FROM dep35), 'PFM', 'Alice Chen', 'Record piezoresponse for this lab')
  RETURNING id
),
met35a AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana35a), 'fwhm', 0.06, 'deg'),
    ((SELECT id FROM ana35a), 'peak_position', 22.43, '2theta (deg)'),
    ((SELECT id FROM ana35a), 'lattice_parameter', 3.960, 'angstrom')
  RETURNING id
),
met35b AS (
  INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
    ((SELECT id FROM ana35b), 'rms_roughness', 0.22, 'nm'),
    ((SELECT id FROM ana35b), 'peak_to_valley', 1.4, 'nm'),
    ((SELECT id FROM ana35b), 'scan_size', 1.0, 'um')
  RETURNING id
)
INSERT INTO analysis_metrics (analysis_id, metric_name, metric_value, metric_unit) VALUES
  ((SELECT id FROM ana35c), 'd33', 70.1, 'pm/V'),
  ((SELECT id FROM ana35c), 'coercive_voltage', 2.5, 'V');
