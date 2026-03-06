export function polarToCartesian(
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: r * Math.cos(angleRad),
    y: r * Math.sin(angleRad),
  };
}

export function cartesianToPolar(
  x: number,
  y: number
): { r: number; angle: number } {
  const r = Math.sqrt(x * x + y * y);
  let angle = (Math.atan2(y, x) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return { r, angle };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
