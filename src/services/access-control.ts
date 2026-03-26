import { GETQuery, POSTQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/response";
import type { User } from "@/types/user/User";
import { API } from "@/api";

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionsCount: number;
  status: "active" | "inactive";
}

export interface PermissionItem {
  id: string;
  key: string;
  module: string;
  description: string;
  status: "active" | "inactive";
}

interface UsersParams {
  search?: string;
  status?: string;
}

interface RolesParams {
  search?: string;
}

interface PermissionsParams {
  search?: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  usersCount?: number;
  permissionsCount: number;
  status: RoleItem["status"];
}

export interface CreatePermissionPayload {
  key: string;
  module: string;
  description: string;
  status: PermissionItem["status"];
}

export const accessControlService = {
  async getUsers(params?: UsersParams): Promise<User[]> {
    const res = await GETQuery<null, Response<User[]>>({
      url: API.users,
    });
    const keyword = params?.search?.trim().toLowerCase() ?? "";

    return res.data.filter((u: User) => {
      const matchSearch =
        !keyword ||
        u.fullName.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.phone.includes(keyword);
      const matchStatus = params?.status ? u.status === params.status : true;
      return matchSearch && matchStatus;
    });
  },

  async getRoles(params?: RolesParams): Promise<RoleItem[]> {
    const res = await GETQuery<null, Response<RoleItem[]>>({
      url: API.roles,
    });
    const keyword = params?.search?.trim().toLowerCase() ?? "";

    return res.data.filter((role: RoleItem) => {
      if (!keyword) return true;
      return (
        role.name.toLowerCase().includes(keyword) ||
        role.description.toLowerCase().includes(keyword)
      );
    });
  },

  async getPermissions(params?: PermissionsParams): Promise<PermissionItem[]> {
    const res = await GETQuery<null, Response<PermissionItem[]>>({
      url: API.permissions,
    });
    const keyword = params?.search?.trim().toLowerCase() ?? "";

    return res.data.filter((item: PermissionItem) => {
      if (!keyword) return true;
      return (
        item.key.toLowerCase().includes(keyword) ||
        item.module.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    });
  },

  // Ready for backend create role API
  async createRole(payload: CreateRolePayload): Promise<RoleItem> {
    const res = await POSTQuery<CreateRolePayload, Response<RoleItem>>({
      url: API.roles,
      body: payload,
    });
    return res.data;
  },

  // Ready for backend create permission API
  async createPermission(payload: CreatePermissionPayload): Promise<PermissionItem> {
    const res = await POSTQuery<CreatePermissionPayload, Response<PermissionItem>>({
      url: API.permissions,
      body: payload,
    });
    return res.data;
  },
};
