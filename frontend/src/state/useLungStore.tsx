import { create } from "zustand";
import { getZone, Zone } from "../logic/zonemapping";

interface LungState {
  lhi: number | null;
  zone: Zone | null;
  setResult: (rawLhi: number) => void;
  reset: () => void;
}

export const useLungStore = create<LungState>()((set) => ({
  lhi: null,
  zone: null,

  setResult: (rawLhi) => {
    // Normalize if needed
    const lhi =
      rawLhi > 1
        ? Number((rawLhi / 100).toFixed(2))
        : Number(rawLhi.toFixed(2));

    const zone = getZone(lhi); // ✅ ALWAYS correct

    set({ lhi, zone });
  },

  reset: () => set({ lhi: null, zone: null }),
}));
