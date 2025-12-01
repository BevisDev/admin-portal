import { userStore } from "@/store/UserStore";

export const isAuthenticated = () => {
  return userStore.getState().me?.IsAuthenticated;
};

export const isSuperAdmin = () => {
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
