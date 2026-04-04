import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accessControlService } from "@/services/access-control";
export type {
  RoleItem,
  PermissionItem,
  CreateRolePayload,
  CreatePermissionPayload,
} from "@/services/access-control";

export const useUsersQuery = (search: string, status?: string) => {
  return useQuery({
    queryKey: ["users", search, status],
    queryFn: () => accessControlService.getUsers({ search, status }),
  });
};

export const useRolesQuery = (search: string) => {
  return useQuery({
    queryKey: ["roles", search],
    queryFn: () => accessControlService.getRoles({ search }),
  });
};

export const usePermissionsQuery = (search: string) => {
  return useQuery({
    queryKey: ["permissions", search],
    queryFn: () => accessControlService.getPermissions({ search }),
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accessControlService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useCreatePermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accessControlService.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};
