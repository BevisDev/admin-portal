export interface RouteItem {
  path: string;
  label: string;
  icon?: string;
  permissions?: string | string[];
  children?: RouteItem[];
}

export const Routes: RouteItem[] = [
  {
    path: "/todo",
    label: "To-do",
    icon: "todo",
    permissions: "todo.view",
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
        permissions: "users.view",
      },
    ],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "settings",
  },
];
