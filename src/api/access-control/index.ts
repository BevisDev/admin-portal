import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/Response";
import type { User } from "@/types/user/User";
import { useQuery } from "@tanstack/react-query";
import { API } from "..";

export const useUsersQuery = (search: string, status?: string) => {
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
