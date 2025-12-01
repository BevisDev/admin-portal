import { userStore } from "@/store/UserStore";

export const isAuthenticated = () => {
  const me = userStore.getState().me;
  return me?.isAuthenticated ?? false;
};

export const isSuperAdmin = () => {
  const me = userStore.getState().me;
  return me?.isSuperAdmin ?? false;
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
