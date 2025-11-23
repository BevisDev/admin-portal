import { create } from "zustand";
import type { MeResponse, User } from "../auth/auth";

interface AuthState {
  user: User | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (data: MeResponse) => void;
  logout: () => void;
}

export const userStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  permissions: [],
  isAuthenticated: false,

  setAuth: (data) =>
    set({
      user: data.user,
      roles: data.roles,
      permissions: data.permissions,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      roles: [],
      permissions: [],
      isAuthenticated: false,
    }),
}));
