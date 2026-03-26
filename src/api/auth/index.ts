import { useQuery } from "@tanstack/react-query";
import type { Me } from "@/types/auth/Me";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/response";
import { API } from "@/api";

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      GETQuery<null, Response<Me>>({
        url: API.me,
      }),
    select: (res) => res.data,
    staleTime: 0,
    gcTime: Infinity,
  });
};
