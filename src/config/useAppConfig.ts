import { useQuery } from "@tanstack/react-query";
import { getAppConfig } from "../api/ConfigApi";

export const useAppConfig = () => {
  return useQuery({
    queryKey: ["appConfig"],
    queryFn: getAppConfig,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
