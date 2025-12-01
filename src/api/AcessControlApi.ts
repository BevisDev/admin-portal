import { useQuery } from "@tanstack/react-query";
import { GETQuery } from "../hooks/useFetchQuery";
import { API } from "./endpoint";
import type { Response } from "@/types/Response";
import type { User } from "@/types/user/User";

export const GetUsers = (search: string, status?: string) => {
  return useQuery({
    queryKey: ["users", search, status],
    queryFn: () =>
      GETQuery<null, Response<User[]>>({
        url: API.users,
        queryParams: {
          search,
        },
      }),
    select: (res) => res.data,
  });
};
