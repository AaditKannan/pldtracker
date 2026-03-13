import calibrationData from "@/lib/config/temperature-calibration.json";

const POINTS = calibrationData.points;

/**
 * Convert PID setpoint temperature to real calibrated substrate temperature.
 * Uses linear interpolation between calibration points.
 * Clamps to nearest value if PID is outside the calibration range.
 */
export function pidToReal(pid: number): number {
  if (pid <= POINTS[0].pid) return POINTS[0].real;
  if (pid >= POINTS[POINTS.length - 1].pid) return POINTS[POINTS.length - 1].real;

  for (let i = 0; i < POINTS.length - 1; i++) {
    const lo = POINTS[i];
    const hi = POINTS[i + 1];
    if (pid >= lo.pid && pid <= hi.pid) {
      const t = (pid - lo.pid) / (hi.pid - lo.pid);
      return Math.round((lo.real + t * (hi.real - lo.real)) * 10) / 10;
    }
  }

  return POINTS[POINTS.length - 1].real;
}

/**
 * Convert real substrate temperature back to approximate PID setpoint.
 * Inverse of pidToReal. Used for form pre-fill when user knows the real temp.
 */
export function realToPid(real: number): number {
  if (real <= POINTS[0].real) return POINTS[0].pid;
  if (real >= POINTS[POINTS.length - 1].real) return POINTS[POINTS.length - 1].pid;

  for (let i = 0; i < POINTS.length - 1; i++) {
    const lo = POINTS[i];
    const hi = POINTS[i + 1];
    if (real >= lo.real && real <= hi.real) {
      const t = (real - lo.real) / (hi.real - lo.real);
      return Math.round(lo.pid + t * (hi.pid - lo.pid));
    }
  }

  return POINTS[POINTS.length - 1].pid;
}
