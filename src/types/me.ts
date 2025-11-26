import type { User } from "./user";

export interface Me {
  user: User | null;
  roles: string[];
  permissions: string[];
  IsAuthenticated: boolean;
  IsSuperAdmin: boolean;
}
