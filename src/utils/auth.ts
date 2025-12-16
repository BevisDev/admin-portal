import type { RouteItem } from "@/router/routes";
import { useMeStore } from "@/store/useMeStore";

export const normalizePerms = (perms?: string | string[]): string[] => {
  return perms ? (Array.isArray(perms) ? perms : [perms]) : [];
};

export const hasAccessRoute = (
  item: RouteItem,
  userPerms: string[]
): boolean => {
  if (isSuperAdmin()) return true;

  if (item.permissions) {
    return normalizePerms(item.permissions).some((p) => userPerms.includes(p));
  }

  if (item.children) {
    return item.children.some((child) => hasAccessRoute(child, userPerms));
  }

  return false;
};

export const isAuthenticated = () => {
  const me = useMeStore.getState().me;
  return me?.isAuthenticated ?? false;
};

export const isSuperAdmin = () => {
  const me = useMeStore.getState().me;
  return me?.isSuperAdmin ?? false;
};

export const hasPermission = (el: string | string[]) => {
  const permissions = useMeStore.getState().me?.permissions ?? [];

  if (Array.isArray(el)) {
    return el.some((p) => permissions.includes(p));
  }

  return permissions.includes(el);
};
