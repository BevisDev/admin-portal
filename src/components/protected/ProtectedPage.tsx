import { hasPermission, isAuthenticated, isSuperAdmin } from "@/utils/auth";
import { Typography } from "antd";
import { Navigate, useLocation } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { Routes, type RouteItem } from "@/router/routes";

interface ProtectedPageProps {
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

const ProtectedPage = ({ permissions, children }: ProtectedPageProps) => {
  try {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    // Super admin có quyền truy cập tất cả
    if (isSuperAdmin()) {
      return <PageItem>{children}</PageItem>;
    }

    // Nếu route không có permissions, cho phép truy cập (đã authenticated)
    if (!permissions) {
      return <PageItem>{children}</PageItem>;
    }

    // Kiểm tra permissions
    if (hasPermission(permissions)) {
      return <PageItem>{children}</PageItem>;
    }

    // Không có quyền truy cập
    return <Navigate to="/404" replace />;
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
