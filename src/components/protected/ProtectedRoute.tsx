import { useMeStore } from "@/store/useMeStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../loading/Loading";

const ProtectedRoute = () => {
  const { me, init } = useMeStore();
  const location = useLocation();

  if (!init) {
    return <Loading />;
  }

  if (!me || !me.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
