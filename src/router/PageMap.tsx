import type { ComponentType } from "react";
import DashBoardPage from "../pages/dashboard";
import ToDoPage from "../pages/todo";
import UsersPage from "../pages/accessControl/users";
import RolesPage from "../pages/accessControl/roles";
import PermissionsPage from "../pages/accessControl/permissions";
import CreateTaskPage from "../pages/todo/CreateTaskPage";
import SettingsPage from "../pages/settings";
import CalendarPage from "../pages/calendar";
import GoldPage from "../pages/gold";
import SettingsProfilePage from "../pages/settings/profile";
import SettingsAppearancePage from "../pages/settings/appearance";
import SettingsSecurityPage from "../pages/settings/security";

export const PageMap: Record<string, ComponentType> = {
  "/dashboard": DashBoardPage,
  "/todo": ToDoPage,
  "/todo/create": CreateTaskPage,
  "/users": UsersPage,
  "/roles": RolesPage,
  "/permissions": PermissionsPage,
  "/settings": SettingsPage,
  "/settings/profile": SettingsProfilePage,
  "/settings/appearance": SettingsAppearancePage,
  "/settings/security": SettingsSecurityPage,
  "/calendar": CalendarPage,
  "/gold": GoldPage,
};
