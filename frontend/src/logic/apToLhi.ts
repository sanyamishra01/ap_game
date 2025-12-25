/**
 * Converts airway patency (AP) to LHI
 * Assumes AP already normalized 0–1
 */
export function apToLhi(ap: number): number {
  // clamp for safety
  return Math.max(0, Math.min(1, ap));
}
