import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/user";
import { GETQuery } from "../hooks/useFetchQuery";
import { API } from "./endpoint";

export const GetUsers = (search: string, status?: string) => {
  return useQuery({
    queryKey: ["users", search, status],
    queryFn: () =>
      GETQuery<null, { data: User[] }>({
        url: API.users,
        queryParams: {
          search,
        },
      }),
    select: (res) => res.data,
  });
};
