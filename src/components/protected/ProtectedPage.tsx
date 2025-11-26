import { hasPermission, hasRole, IsSuperAdmin } from "@/hooks/userAuth";
import { useTheme } from "@/hooks/useTheme";
import { MenuConfig } from "@/menu/MenuConfig";
import { darkColors, lightColors } from "@/types/theme";
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
    if (IsSuperAdmin()) {
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
  // get label
  const found = MenuConfig.find((m) => m.key === pathname);
  const title = found?.label || "";

  // get theme
  const { themeMode } = useTheme();
  const palette = themeMode === "light" ? lightColors : darkColors;

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
