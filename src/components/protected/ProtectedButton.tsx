import { hasPermission, isAuthenticated, isSuperAdmin } from "@/utils/auth";
import { Button } from "antd";
import { Navigate } from "react-router-dom";

interface ProtectedButtonProps {
  permissions?: string | string[];
  roles?: string | string[];
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  danger?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ProtectedButton = ({
  permissions,
  children,
  ...props
}: ProtectedButtonProps) => {
  try {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (isSuperAdmin()) {
      return <Button {...props}>{children}</Button>;
    }

    if (permissions && hasPermission(permissions)) {
      return <Button {...props}>{children}</Button>;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default ProtectedButton;
