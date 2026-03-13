/**
 * Linear regression and correlation statistics for the data explorer.
 */

export interface RegressionResult {
  slope: number;
  intercept: number;
  r: number;       // Pearson correlation coefficient
  r2: number;      // Coefficient of determination
  n: number;       // Sample size
  linePoints: { x: number; y: number }[];  // Two endpoints for drawing
}

export function linearRegression(
  points: { x: number; y: number }[]
): RegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
  }

  const denomX = n * sumX2 - sumX * sumX;
  const denomY = n * sumY2 - sumY * sumY;

  if (denomX === 0) return null; // All x values identical

  const slope = (n * sumXY - sumX * sumY) / denomX;
  const intercept = (sumY - slope * sumX) / n;

  // Pearson r
  const denomR = Math.sqrt(denomX * denomY);
  const r = denomR === 0 ? 0 : (n * sumXY - sumX * sumY) / denomR;
  const r2 = r * r;

  // Line endpoints at data range
  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));

  const linePoints = [
    { x: xMin, y: slope * xMin + intercept },
    { x: xMax, y: slope * xMax + intercept },
  ];

  return { slope, intercept, r, r2, n, linePoints };
}

export function formatEquation(reg: RegressionResult): string {
  const m = reg.slope;
  const b = reg.intercept;
  const sign = b >= 0 ? "+" : "−";
  const absB = Math.abs(b);

  if (Math.abs(m) < 0.001 && absB < 0.001) return "y = 0";
  if (Math.abs(m) < 0.001) return `y = ${b.toPrecision(3)}`;

  return `y = ${m.toPrecision(3)}x ${sign} ${absB.toPrecision(3)}`;
}
