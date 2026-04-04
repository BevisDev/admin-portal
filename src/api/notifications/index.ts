import { GETQuery } from "@/hooks/useFetchQuery";
import { useQuery } from "@tanstack/react-query";
import { API } from "..";
import type { Response } from "@/types/response";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  read: boolean;
}

interface NotificationsData {
  notifications: NotificationItem[];
}

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      GETQuery<null, Response<NotificationsData>>({
        url: API.notifications,
      }),
    select: (res) => res.data.notifications,
  });
};
