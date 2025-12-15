import { GETQuery } from "@/hooks/useFetchQuery";
import { useQuery } from "@tanstack/react-query";
import { API } from "../api/api";
import type { Response } from "@/types/Response";
import type { AppConfig } from "@/config/Config";

export const GetAppConfig = () => {
  return useQuery({
    queryKey: ["appConfig"],
    queryFn: () =>
      GETQuery<null, Response<AppConfig>>({
        url: API.appConfig,
      }),
    select: (res) => res.data,
  });
};

