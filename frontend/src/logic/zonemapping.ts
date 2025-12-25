/**
 * Maps LHI score to deterministic risk zones
 * Green / Yellow / Red
 */

export type Zone = "green" | "yellow" | "red";

export function getZone(lhi: number): Zone {
  if (1.0 >= lhi >= 0.45) return "green";
  if (0.45 >= lhi >= 0.25) return "yellow";
  return "red";
}
