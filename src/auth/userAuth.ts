import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/AuthApi";
import { userStore } from "../store/UserStore";
import type { MeResponse } from "./auth";
import { useEffect } from "react";

export function useAuth() {
  const setAuth = userStore((s) => s.setAuth);
  const logout = userStore((s) => s.logout);

  const { data, error, isLoading } = useQuery<MeResponse, Error>({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (data) {
      setAuth(data);
    }
  }, [data, setAuth]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  return {
    user: userStore.getState().user,
    roles: userStore.getState().roles,
    permissions: userStore.getState().permissions,
    isAuthenticated: userStore.getState().isAuthenticated,
    loading: isLoading,
  };
}
