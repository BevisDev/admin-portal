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

  // Nếu route có permissions, kiểm tra permissions
  if (item.permissions) {
    return normalizePerms(item.permissions).some((p) => userPerms.includes(p));
  }

  // Nếu route có children, kiểm tra xem có child nào accessible không
  if (item.children) {
    return item.children.some((child) => hasAccessRoute(child, userPerms));
  }

  // Nếu route không có permissions và không có children
  // Cho phép truy cập nếu đã authenticated (route public cho authenticated users)
  return isAuthenticated();
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
