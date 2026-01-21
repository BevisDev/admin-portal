import type { ComponentType } from "react";
import DashBoardPage from "./dashboard";
import ToDoPage from "./todo";
import UsersPage from "./accessControl/users";
import CreateTaskPage from "./todo/CreateTaskPage";

export const PageMap: Record<string, ComponentType> = {
  "/dashboard": DashBoardPage,
  "/todo": ToDoPage,
  "/todo/create": CreateTaskPage,
  "/users": UsersPage,
};
