import { GetMe } from "../api/AuthApi";
import { userStore } from "../store/UserStore";
import { useEffect } from "react";

export const IsAuthenticated = () => {
  return userStore.getState().me?.IsAuthenticated;
};

export const IsSuperAdmin = () => {
  return userStore.getState().me?.IsSuperAdmin;
};

export const hasRole = (el: string | string[]) => {
  const roles = userStore.getState().me?.roles ?? [];

  if (Array.isArray(el)) {
    return el.some((r) => roles.includes(r));
  }

  return roles.includes(el);
};

export const hasPermission = (el: string | string[]) => {
  const permissions = userStore.getState().me?.permissions ?? [];

  if (Array.isArray(el)) {
    return el.some((p) => permissions.includes(p));
  }

  return permissions.includes(el);
};

export const useAuth = () => {
  const { me, setAuth, logout } = userStore((s) => s);

  const { data, error, isLoading } = GetMe();

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
    me,
    loading: isLoading,
  };
};
