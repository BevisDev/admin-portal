import { GETQuery } from "@/hooks/useFetchQuery";
import type { Response } from "@/types/response";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "..";
import type { Todo, Task } from "@/types/todo/Board";
import { mockTodoService, type TodoQueryParams } from "@/utils/mockService";
import { todoService } from "@/services/todo";

// Use mock service for now (when backend is ready, switch to real API)
const USE_MOCK = true;

export interface TodoQueryOptions {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: number;
  priority?: number;
}

export const useTodoQuery = (options?: TodoQueryOptions) => {
  return useQuery({
    queryKey: ["todo", options],
    queryFn: async () => {
      if (USE_MOCK) {
        return mockTodoService.getTodos({
          search: options?.search,
          startDate: options?.startDate,
          endDate: options?.endDate,
          status: options?.status,
          priority: options?.priority,
        });
      }

      // Real API call
      const queryParams: Record<string, string | number | boolean> = {
        ...(options?.search ? { search: options.search } : {}),
        ...(options?.startDate ? { startDate: options.startDate } : {}),
        ...(options?.endDate ? { endDate: options.endDate } : {}),
        ...(options?.status !== undefined ? { status: options.status } : {}),
        ...(options?.priority !== undefined ? { priority: options.priority } : {}),
      };

      return GETQuery<TodoQueryParams, Response<Todo>>({
        url: API.todo,
        queryParams,
      });
    },
    select: (res) => res.data,
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: Omit<Task, "id">) => {
      if (USE_MOCK) {
        return mockTodoService.createTask(taskData);
      }
      return todoService.createTask(taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      taskData,
    }: {
      taskId: number;
      taskData: Partial<Task>;
    }) => {
      if (USE_MOCK) {
        return mockTodoService.updateTask(taskId, taskData);
      }

      // Real API call
      const { PUTQuery } = await import("@/hooks/useFetchQuery");
      return PUTQuery<Partial<Task>, Response<Task>>({
        url: `${API.todo}/${taskId}`,
        body: taskData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
};

export const useUpdateTaskStatusAndColumnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      columnId,
      status,
    }: {
      taskId: number;
      columnId: number;
      status: string;
    }) => {
      if (USE_MOCK) {
        return mockTodoService.updateTaskStatusAndColumn(taskId, { columnId, status });
      }

      const { PATCHQuery } = await import("@/hooks/useFetchQuery");
      return PATCHQuery<{ columnId: number; status: string }, Response<Task>>({
        url: `${API.todo}/${taskId}/status-column`,
        body: { columnId, status },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      if (USE_MOCK) {
        return mockTodoService.deleteTask(taskId);
      }

      // Real API call
      const { DELETEQuery } = await import("@/hooks/useFetchQuery");
      return DELETEQuery<null, Response<boolean>>({
        url: `${API.todo}/${taskId}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
};

export const useMoveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      fromColId,
      toColId,
      newIndex,
    }: {
      taskId: number;
      fromColId: number;
      toColId: number;
      newIndex: number;
    }) => {
      if (USE_MOCK) {
        return mockTodoService.moveTask(taskId, fromColId, toColId, newIndex);
      }

      // Real API call
      const { PUTQuery } = await import("@/hooks/useFetchQuery");
      return PUTQuery<
        { fromColId: number; toColId: number; newIndex: number },
        Response<Task>
      >({
        url: `${API.todo}/${taskId}/move`,
        body: { fromColId, toColId, newIndex },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
};
