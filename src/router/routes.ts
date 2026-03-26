export interface RouteItem {
  path: string;
  label: string;
  icon?: string;
  roles?: string | string[];
  permissions?: string | string[];
  children?: RouteItem[];
}

export const Routes: RouteItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
    roles: "user",
    permissions: "dashboard.view",
  },
  {
    path: "/todo",
    label: "To-do",
    icon: "todo",
    roles: "user",
    permissions: "todo.view",
  },
  {
    path: "/calendar",
    label: "Calendar",
    icon: "calendar",
    roles: "user",
    permissions: "calendar.view",
  },
  {
    path: "/gold",
    label: "Vietnam Gold",
    icon: "gold",
    roles: "user",
    permissions: "gold.view",
  },
  {
    path: "/accessControl",
    icon: "accessControl",
    label: "Access Control",
    children: [
      {
        path: "/users",
        icon: "users",
        label: "Users",
        roles: "user",
        permissions: "users.view",
      },
      {
        path: "/roles",
        icon: "roles",
        label: "Roles",
        roles: "user",
        permissions: "roles.view",
      },
      {
        path: "/permissions",
        icon: "permissions",
        label: "Permissions",
        roles: "user",
        permissions: "permissions.view",
      },
    ],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "settings",
    children: [
      {
        path: "/settings/profile",
        label: "Profile",
        icon: "settingsProfile",
        roles: "user",
        permissions: "settings.profile.view",
      },
      {
        path: "/settings/appearance",
        label: "Appearance",
        icon: "settingsAppearance",
        roles: "user",
        permissions: "settings.appearance.view",
      },
      {
        path: "/settings/security",
        label: "Security",
        icon: "settingsSecurity",
        roles: "user",
        permissions: "settings.security.view",
      },
    ],
  },
];
