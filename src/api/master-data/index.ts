import { GETQuery } from "@/hooks/useFetchQuery";
import { useQuery } from "@tanstack/react-query";
import { API } from "..";
import type { Response } from "@/models/response";
import type { MasterData } from "@/models/master_data/model";

export const useMasterDataQuery = () => {
  return useQuery({
    queryKey: ["master-data"],
    queryFn: () =>
      GETQuery<null, Response<MasterData>>({
        url: API.masterData,
      }),
    select: (res) => res.data,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
