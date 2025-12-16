import { GETQuery } from "@/hooks/useFetchQuery";
import { useQuery } from "@tanstack/react-query";
import { API } from "..";
import type { Response } from "@/types/Response";
import type { Constant } from "@/types/constants/constant";

export const useConstantsQuery = () => {
  return useQuery({
    queryKey: ["constants"],
    queryFn: () =>
      GETQuery<null, Response<Constant>>({
        url: API.constants,
      }),
    select: (res) => res.data,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
