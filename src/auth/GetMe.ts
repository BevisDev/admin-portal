import { useQuery } from "@tanstack/react-query";
import type { Me } from "@/auth/Me";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/Response";
import { API } from "@/api/endpoint";

export const GetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      GETQuery<null, Response<Me>>({
        url: API.me,
      }),
    select: (res) => res.data,
  });
};
