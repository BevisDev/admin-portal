import { Navigate } from "react-router-dom";
import { usePermission } from "./usePermission";

interface AllowedRouteProps {
  permission: string;
  children: React.ReactNode;
}

export function AllowedRoute({ permission, children }: AllowedRouteProps) {
  const allowed = usePermission(permission);

  if (!allowed) return <Navigate to="/403" replace />;
  return children;
}
