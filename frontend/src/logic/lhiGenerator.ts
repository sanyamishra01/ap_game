/**
 * Generates a mock Lung Health Index (0–100)
 * Slightly biased by AQI to feel realistic
 * DEMO ONLY — no medical inference
 */
export function generateLHI(aqi: number): number {
  const baseScore = Math.random() * 100;

  // Higher AQI → small downward bias
  const pollutionPenalty = Math.min(aqi / 10, 25);

  const lhi = baseScore - pollutionPenalty;

  return Math.max(0, Math.round(lhi));
}
