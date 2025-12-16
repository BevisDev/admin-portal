import { hasPermission, isAuthenticated, isSuperAdmin } from "@/utils/auth";
import { Typography } from "antd";
import { Navigate, useLocation } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { Routes } from "@/router/routes";

interface ProtectedPageProps {
  permissions?: string | string[];
  children: React.ReactNode;
}

const ProtectedPage = ({ permissions, children }: ProtectedPageProps) => {
  try {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    if (isSuperAdmin()) {
      return <PageItem>{children}</PageItem>;
    }

    if (permissions && hasPermission(permissions)) {
      return <PageItem>{children}</PageItem>;
    }

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

  // get label
  const menuMap = Routes.find((s) => s.path == pathname);
  const title = menuMap?.label || "";

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
