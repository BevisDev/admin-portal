import { useQuery } from "@tanstack/react-query";
import type { Me } from "@/models/auth/me";
import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/models/response";
import { API } from "@/api";
import { useMutation } from "@tanstack/react-query";

interface AccountItem {
  username: string;
}

interface CheckAccountPayload {
  username: string;
}

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

export const useCheckAccountMutation = () => {
  return useMutation({
    mutationFn: async ({ username }: CheckAccountPayload) => {
      const res = await GETQuery<null, Response<AccountItem[]>>({
        url: API.accounts,
      });

      const normalizedUsername = username.trim().toLowerCase();
      return res.data.some(
        (account) => account.username.toLowerCase() === normalizedUsername
      );
    },
  });
};
