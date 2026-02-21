import type { ComponentType } from "react";
import DashBoardPage from "../pages/dashboard";
import ToDoPage from "../pages/todo";
import UsersPage from "../pages/accessControl/users";
import CreateTaskPage from "../pages/todo/CreateTaskPage";
import SettingsPage from "../pages/settings";

export const PageMap: Record<string, ComponentType> = {
  "/dashboard": DashBoardPage,
  "/todo": ToDoPage,
  "/todo/create": CreateTaskPage,
  "/users": UsersPage,
  "/settings": SettingsPage,
};
