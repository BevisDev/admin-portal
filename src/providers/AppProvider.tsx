import { useAppConfigQuery } from "@/api/config";
import Loading from "@/components/loading/Loading";
import ErrorPage from "@/pages/ErrorPage";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useAppConfigQuery();
  const setAppConfig = useAppStore((s) => s.setAppConfig);

  useEffect(() => {
    if (data) setAppConfig(data);
  }, [data, setAppConfig]);

  // SERVER ERROR
  if (error) return ErrorPage();

  // LOADING
  if (isLoading) return <Loading />;

  return children;
};

export default AppProvider;
