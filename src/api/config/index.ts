import type { AppConfig } from "@/config/AppConfig";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";
import { API } from "..";

export const useAppConfigQuery = () => {
  return useQuery({
    queryKey: ["appConfig"],
    queryFn: () =>
      GETQuery<null, Response<AppConfig>>({
        url: API.appConfig,
      }),
    select: (res) => res.data,
    gcTime: Infinity,
    staleTime: Infinity,
    retry: 1,
  });
};
