import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "@/layouts/home/HomeLayout";
import Dashboard from "@/pages/dashboard/DashBoard";
import Users from "@/pages/accessControl/users/Users";
import NotFound from "@/pages/NotFound";
import ProtectedPage from "@/components/protected/ProtectedPage";
import ToDo from "@/pages/todo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedPage permissions="user.view" roles={["admin"]}>
            <Dashboard />
          </ProtectedPage>
        ),
      },
      {
        path: "/todo",
        element: (
          <ProtectedPage permissions="todo.view" roles={["admin"]}>
            <ToDo />
          </ProtectedPage>
        ),
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },

  // 404 not found page
  { path: "*", element: <NotFound /> },
]);
