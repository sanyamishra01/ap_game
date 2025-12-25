/**
 * Maps LHI score to deterministic risk zones
 * Green / Yellow / Red
 */

export type Zone = "green" | "yellow" | "red";

export function getZone(lhi: number): Zone {
  if (lhi >= 0.45) return "green";
  if (lhi >= 0.25) return "yellow";
  return "red";
}
