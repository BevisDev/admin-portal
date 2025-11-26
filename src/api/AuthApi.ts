import { useQuery } from "@tanstack/react-query";
import type { Me } from "../types/me";
import { GETQuery } from "@/hooks/useFetchQuery";
import { API } from "./endpoint";

export const GetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      GETQuery<null, { data: Me }>({
        url: API.me,
      }),
    select: (res) => res.data,
  });
};
