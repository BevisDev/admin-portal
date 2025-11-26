import { hasPermission, hasRole, IsSuperAdmin } from "@/hooks/userAuth";
import { Button } from "antd";

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
  roles,
  children,
  ...props
}: ProtectedButtonProps) => {
  try {
    if (IsSuperAdmin()) {
      return <Button {...props}>{children}</Button>;
    }

    if (roles && hasRole(roles)) {
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
