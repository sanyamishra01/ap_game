import { create } from "zustand";

export type Zone = "green" | "yellow" | "red";

interface LungState {
  lhi: number | null;      // 0.00 – 1.00 ONLY
  zone: Zone | null;
  setResult: (lhi: number, zone: Zone) => void;
  reset: () => void;
}

/**
 * Lung Health Index (LHI) Store
 * - lhi is ALWAYS normalized between 0.0 and 1.0
 * - Any accidental 0–100 values are auto-corrected
 */
export const useLungStore = create<LungState>()((set) => ({
  lhi: null,
  zone: null,

  setResult: (rawLhi, zone) => {
    // 🔐 HARD SAFETY: normalize if someone passes 0–100 by mistake
    const normalizedLhi =
      rawLhi > 1 ? Number((rawLhi / 100).toFixed(2)) : Number(rawLhi.toFixed(2));

    set({
      lhi: normalizedLhi,
      zone,
    });
  },

  reset: () =>
    set({
      lhi: null,
      zone: null,
    }),
}));
