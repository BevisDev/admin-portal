import { create } from "zustand";
import type { Me } from "../auth/Me";

interface AuthState {
  me: Me | null;

  setAuth: (data: Me) => void;
  logout: () => void;
}

export const userStore = create<AuthState>((set) => ({
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
