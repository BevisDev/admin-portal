import type { Me } from "@/auth/Me";
import { create } from "zustand";

interface AuthState {
  me: Me | null;

  setAuth: (data: Me) => void;
  logout: () => void;
}

export const getUserStore = create<AuthState>((set) => ({
  me: null,

  setAuth: (data) =>
    set({
      me: data,
    }),

  logout: () =>
    set({
      me: null,
    }),
}));
