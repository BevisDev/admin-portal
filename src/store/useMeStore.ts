import type { Me } from "@/models/auth/me";
import { create } from "zustand";

interface MeStore {
  me: Me | null;
  init: boolean;
  setMe: (data: Me) => void;
  logout: () => void;
}

export const useMeStore = create<MeStore>((set) => ({
  me: null,
  init: false,
  setMe: (data) =>
    set({
      me: data,
      init: true,
    }),

  logout: () =>
    set({
      me: null,
      init: false,
    }),
}));
