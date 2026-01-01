export type Zone = "green" | "yellow" | "red" | "grey";

export function getZone(lhi: number): Zone {
  if (lhi >= 0.45) return "green";
  if (lhi >= 0.25) return "yellow";
  if (lhi >= 0.01) return "red";
  return "grey";
}
