import { create } from "zustand";

interface AuthState {
  user: {
    id: number;
    email: string;
  } | null;
  roles: string[];
  permissions: string[];
  setAuth: (data: AuthState) => void;
}

export const userStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  permissions: [],

  setAuth: (data) =>
    set({
      user: data.user,
      roles: data.roles,
      permissions: data.permissions,
    }),
}));
