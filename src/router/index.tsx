import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomeLayout from "@/layouts/HomeLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedPage from "@/components/protected/ProtectedPage";
import type { ComponentType } from "react";
import LoginPage from "@/pages/auth/LoginPage";
import GoogleCallbackPage from "@/pages/auth/GoogleCallbackPage";
import DashBoardPage from "@/pages/dashboard";
import { PageMap } from "@/router/PageMap";
import { Routes, type RouteItem } from "./routes";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import RouteErrorPage from "./RouteErrorPage";

const EXTRA_ROUTE_GUARDS: Record<string, { roles?: string | string[]; permissions?: string | string[] }> = {
  "/todo/create": {
    roles: "user",
    permissions: "todo.create",
  },
};

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/auth/google/callback",
      element: <GoogleCallbackPage />,
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
              element: (
                <ProtectedPage roles="user" permissions="dashboard.view">
                  <DashBoardPage />
                </ProtectedPage>
              ),
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
  const routes: RouteObject[] = [];

  // Build routes from Routes config
  items.forEach((item) => {
    const Page = PageMap[item.path] as ComponentType | undefined;
    if (Page) {
      routes.push({
        path: item.path,
        element: (
          <ProtectedPage roles={item.roles} permissions={item.permissions}>
            <Page />
          </ProtectedPage>
        ),
      });
    }
    if (item.children) {
      routes.push(...buildRoutes(item.children));
    }
  });

  // Add additional routes from PageMap that are not in Routes config
  Object.entries(PageMap).forEach(([path, Page]) => {
    // Skip if already added from Routes config
    if (!routes.some((r) => r.path === path)) {
      routes.push({
        path,
        element: (
          <ProtectedPage
            roles={EXTRA_ROUTE_GUARDS[path]?.roles}
            permissions={EXTRA_ROUTE_GUARDS[path]?.permissions}
          >
            <Page />
          </ProtectedPage>
        ),
      });
    }
  });

  return routes;
};
