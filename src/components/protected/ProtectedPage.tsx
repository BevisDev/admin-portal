import { hasPermission, hasRole, isAuthenticated, isSuperAdmin } from "@/utils/auth";
import { Typography } from "antd";
import { Navigate, useLocation } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { Routes, type RouteItem } from "@/router/routes";

interface ProtectedPageProps {
  roles?: string | string[];
  permissions?: string | string[];
  children: React.ReactNode;
}

// Helper function to find route label from nested routes
const findRouteLabel = (
  items: RouteItem[],
  pathname: string
): string | undefined => {
  for (const item of items) {
    if (item.path === pathname) {
      return item.label;
    }
    if (item.children) {
      const found = findRouteLabel(item.children, pathname);
      if (found) return found;
    }
  }
  return undefined;
};

const ProtectedPage = ({ roles, permissions, children }: ProtectedPageProps) => {
  try {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    // Super admin có quyền truy cập tất cả
    if (isSuperAdmin()) {
      return <PageItem>{children}</PageItem>;
    }

    // Role check
    if (roles && !hasRole(roles)) {
      return <Navigate to="/404" replace />;
    }

    // Permission check
    if (permissions && !hasPermission(permissions)) {
      return <Navigate to="/404" replace />;
    }

    return <PageItem>{children}</PageItem>;
  } catch (err) {
    console.error(err);
    return <Navigate to="/500" replace />;
  }
};

const PageItem = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  // get theme
  const { palette } = useTheme();

  // get label from nested routes
  const title = findRouteLabel(Routes, pathname) || "";

  return (
    <div
      style={{
        padding: 24,
        background: palette.background,
        color: palette.text,
      }}
    >
      {title && (
        <Typography.Title
          level={2}
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: palette.text,
          }}
        >
          {title}
        </Typography.Title>
      )}
      {children}
    </div>
  );
};

export default ProtectedPage;
