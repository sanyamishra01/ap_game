import { create } from "zustand";
import { getZone } from "../logic/zonemapping";

export type Zone = "green" | "yellow" | "red";

interface LungState {
  lhi: number | null;
  zone: Zone | null;
  setResult: (lhi: number) => void;
  reset: () => void;
}

export const useLungStore = create<LungState>()((set) => ({
  lhi: null,
  zone: null,

  setResult: (rawLhi) => {
    // ✅ HARD CLAMP (critical)
    const lhi = Math.max(0, Math.min(1, rawLhi));

    const zone = getZone(lhi);

    set({ lhi, zone });
  },

  reset: () => set({ lhi: null, zone: null }),
}));
