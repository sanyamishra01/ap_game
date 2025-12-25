import { create } from "zustand";

export type Zone = "green" | "yellow" | "red";

interface LungState {
  lhi: number | null;
  zone: Zone | null;

  // ✅ must accept TWO arguments
  setResult: (lhi: number, zone: Zone) => void;

  reset: () => void;
}

export const useLungStore = create<LungState>((set) => ({
  lhi: null,
  zone: null,

  setResult: (lhi, zone) =>
    set({
      lhi,
      zone,
    }),

  reset: () =>
    set({
      lhi: null,
      zone: null,
    }),
}));
