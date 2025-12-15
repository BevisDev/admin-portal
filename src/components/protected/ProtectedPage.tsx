import { hasPermission, hasRole, isSuperAdmin } from "@/auth/auth";
import { GetTheme } from "@/hooks/useTheme";
import { MenuConfig } from "@/menu/MenuConfig";
import { Typography } from "antd";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedPageProps {
  permissions?: string | string[];
  roles?: string | string[];
  children: React.ReactNode;
}

const ProtectedPage = ({
  permissions,
  roles,
  children,
}: ProtectedPageProps) => {
  try {
    if (isSuperAdmin()) {
      return <PageItem>{children}</PageItem>;
    }

    if (roles && hasRole(roles)) {
      return <PageItem>{children}</PageItem>;
    }

    if (permissions && hasPermission(permissions)) {
      return <PageItem>{children}</PageItem>;
    }

    return <Navigate to="/NotFound" replace />;
  } catch (err) {
    console.error(err);
    return <Navigate to="/NotFound" replace />;
  }
};

const PageItem = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  // get theme
  const { palette } = GetTheme();

  // get label
  const found = MenuConfig.find((m) => m.key === pathname);
  const title = found?.label || "";

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
