/**
 * App screen flow definition
 * 
 * We intentionally avoid react-router for:
 * - Kiosk simplicity
 * - Deterministic flow
 * - No URL state
 */

export type AppScreen =
  | "home"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "exit";

/**
 * Ordered flow (for reference & debugging)
 */
export const SCREEN_FLOW: AppScreen[] = [
  "home",
  "record",
  "processing",
  "result",
  "offer",
  "exit",
];
