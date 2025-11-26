import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Dashboard from "../pages/dashboard/DashBoard";
import Users from "../pages/accessControl/users/Users";
import NotFound from "../pages/NotFound";
import ProtectedPage from "@/components/protected/ProtectedPage";
// import { ProtectedRoute } from "../auth/ProtectedRoute";

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
        path: "/users",
        element: <Users />,
      },
    ],
  },

  // 404 not found page
  { path: "*", element: <NotFound /> },
]);
