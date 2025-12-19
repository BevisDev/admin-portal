import { useMeQuery } from "@/api/auth";
import Loading from "@/components/loading/Loading";
import ErrorPage from "@/pages/ErrorPage";
import { useMeStore } from "@/store/useMeStore";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useMeQuery();
  const { setMe } = useMeStore((s) => s);

  useEffect(() => {
    if (data) setMe(data);
  }, [data, setMe]);

  // SERVER ERROR
  if (error) return ErrorPage();

  // LOADING
  if (isLoading) return <Loading />;

  return children;
};

export default AuthProvider;
