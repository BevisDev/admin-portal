import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomeLayout from "@/layouts/HomeLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedPage from "@/components/protected/ProtectedPage";
import type { ComponentType } from "react";
import LoginPage from "@/pages/auth/LoginPage";
import DashBoardPage from "@/pages/dashboard";
import RouteErrorPage from "@/pages/RouteErrorPage";
import { PageMap } from "@/pages/PageMap";
import { Routes, type RouteItem } from "./routes";
import ProtectedRoute from "@/components/protected/ProtectedRoute";

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <HomeLayout />,
          errorElement: <RouteErrorPage />,
          children: [
            {
              index: true,
              element: <DashBoardPage />,
            },
            ...buildRoutes(Routes),
          ],
        },
      ],
    },

    // 404 not found page
    { path: "*", element: <NotFoundPage /> },
  ]);
};

export const buildRoutes = (items: RouteItem[]): RouteObject[] => {
  return items.flatMap((item) => {
    const routes: RouteObject[] = [];

    const Page = PageMap[item.path] as ComponentType | undefined;
    if (Page) {
      routes.push({
        path: item.path,
        element: (
          <ProtectedPage permissions={item.permissions}>
            <Page />
          </ProtectedPage>
        ),
      });
    }
    if (item.children) {
      routes.push(...buildRoutes(item.children));
    }

    return routes;
  });
};
