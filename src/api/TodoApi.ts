import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";
import { API } from "./api";
import type { Todo } from "@/types/todo/Board";

export const GetTodo = () => {
  return useQuery({
    queryKey: ["todo"],
    queryFn: () =>
      GETQuery<null, Response<Todo>>({
        url: API.todo,
      }),
    select: (res) => res.data,
  });
};
