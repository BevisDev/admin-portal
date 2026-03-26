import { API } from "@/api";
import { POSTQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/response";
import type { Task } from "@/types/todo/Board";

export const todoService = {
  // Ready for backend create task API
  async createTask(payload: Omit<Task, "id">): Promise<Task> {
    const res = await POSTQuery<Omit<Task, "id">, Response<Task>>({
      url: API.todo,
      body: payload,
    });
    return res.data;
  },
};
