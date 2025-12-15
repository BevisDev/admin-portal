export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  permissions?: string;
}

export const MenuConfig: MenuItem[] = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    key: "/todo",
    label: "To-do",
    icon: "todo",
  },
  {
    key: "access-control",
    icon: "accessControl",
    label: "Access Control",
    children: [
      {
        key: "/users",
        icon: "users",
        label: "Users",
        permissions: "user.view",
      },
      {
        key: "/roles",
        icon: "roles",
        label: "Roles",
      },
      {
        key: "/permissions",
        icon: "permissions",
        label: "Permissions",
      },
    ],
  },
  {
    key: "/settings",
    label: "Settings",
    icon: "settings",
  },
];
