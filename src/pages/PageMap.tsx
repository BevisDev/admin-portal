import type { ComponentType } from "react";
import DashBoardPage from "./dashboard";
import ToDoPage from "./todo";
import UsersPage from "./accessControl/users";

export const PageMap: Record<string, ComponentType> = {
  "/dashboard": DashBoardPage,
  "/todo": ToDoPage,
  "/users": UsersPage,
};
