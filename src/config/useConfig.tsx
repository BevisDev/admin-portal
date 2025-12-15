import { getConfigStore } from "@/store/ConfigStore";
import { GetAppConfig } from "./GetAppConfig";
import { useEffect } from "react";

export const useConfig = () => {
  const { data, isLoading, error } = GetAppConfig();
  const hasError = !!error && !data;
  const setAppConfig = getConfigStore((s) => s.setAppConfig);

  useEffect(() => {
    if (data) {
      setAppConfig(data);
    }
  }, [data, setAppConfig]);

  return {
    config: data,
    loading: isLoading && !data,
    hasError,
  };
};
