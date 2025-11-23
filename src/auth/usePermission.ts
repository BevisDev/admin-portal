import { userStore } from "../store/UserStore";

export function usePermission(permission: string) {
  const permissions = userStore((s) => s.permissions);
  return permissions.includes(permission);
}
