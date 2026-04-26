import type { Task, Todo } from "@/models/todo/Board";
import type { Response } from "@/models/response";
import dayjs from "dayjs";

// In-memory storage for mock data
let mockTodoData: Todo | null = null;

const normalizeTask = (task: Task): Task => {
  const normalizedDueDate = task.dueDate ? dayjs(task.dueDate) : null;
  const fallbackStartDate = normalizedDueDate
    ? normalizedDueDate.subtract(2, "day").format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  return {
    ...task,
    startDate: task.startDate || fallbackStartDate,
    assignees: task.assignees || [],
  };
};

// Load initial data from JSON
const loadMockData = async (): Promise<Todo> => {
  if (mockTodoData) return mockTodoData;

  try {
    const response = await fetch("/mock/todo/todo.json");
    const json = await response.json();
    mockTodoData = {
      ...json.data,
      tasks: (json.data.tasks as Task[]).map(normalizeTask),
    };
    if (!mockTodoData) {
      throw new Error("Failed to load mock data");
    }
    return mockTodoData;
  } catch (error) {
    console.error("Failed to load mock data:", error);
    throw error;
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface TodoQueryParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: number;
  priority?: number;
}

export const mockTodoService = {
  // GET /api/todo - Get todos with filters
  async getTodos(params?: TodoQueryParams): Promise<Response<Todo>> {
    await delay(300); // Simulate network delay

    const data = await loadMockData();
    let filteredTasks = [...data.tasks];

    // Filter by search
    if (params?.search) {
      const query = params.search.toLowerCase().trim();
      filteredTasks = filteredTasks.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descriptionMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
      });
    }

    // Filter by date range
    if (params?.startDate && params?.endDate) {
      const startDate = dayjs(params.startDate).startOf("day");
      const endDate = dayjs(params.endDate).endOf("day");
      filteredTasks = filteredTasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = dayjs(task.dueDate).startOf("day");
        return (
          (taskDate.isSame(startDate) || taskDate.isAfter(startDate)) &&
          (taskDate.isSame(endDate) || taskDate.isBefore(endDate))
        );
      });
    }

    // Filter by status (columnId)
    if (params?.status !== undefined) {
      filteredTasks = filteredTasks.filter(
        (task) => task.columnId === params.status
      );
    }

    // Filter by priority
    if (params?.priority !== undefined) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === params.priority
      );
    }

    return {
      success: true,
      data: {
        ...data,
        tasks: filteredTasks,
      },
      responseAt: new Date().toISOString(),
    };
  },

  // POST /api/todo - Create new task
  async createTask(taskData: Omit<Task, "id">): Promise<Response<Task>> {
    await delay(500);

    const data = await loadMockData();
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Generate ID
      startDate:
        taskData.startDate ||
        (taskData.dueDate
          ? dayjs(taskData.dueDate).subtract(2, "day").format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD")),
      comments: taskData.comments ?? 0,
      views: taskData.views ?? 0,
      progress: taskData.progress ?? 0,
      assignees: taskData.assignees || [],
    };

    data.tasks.push(newTask);

    // Update column total
    const column = data.columns.find((col) => col.id === newTask.columnId);
    if (column) {
      column.total = data.tasks.filter((t) => t.columnId === column.id).length;
    }

    return {
      success: true,
      data: newTask,
      responseAt: new Date().toISOString(),
    };
  },

  // PUT /api/todo/:id - Update task
  async updateTask(
    taskId: number,
    taskData: Partial<Task>
  ): Promise<Response<Task>> {
    await delay(400);

    const data = await loadMockData();
    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw {
        code: 404,
        message: "Task not found",
      };
    }

    const oldTask = data.tasks[taskIndex];
    const updatedTask: Task = {
      ...oldTask,
      ...taskData,
      id: taskId, // Ensure ID doesn't change
    };

    data.tasks[taskIndex] = updatedTask;

    // Update column totals if columnId changed
    if (taskData.columnId && taskData.columnId !== oldTask.columnId) {
      const oldColumn = data.columns.find((col) => col.id === oldTask.columnId);
      const newColumn = data.columns.find((col) => col.id === taskData.columnId);
      if (oldColumn) {
        oldColumn.total = data.tasks.filter((t) => t.columnId === oldColumn.id).length;
      }
      if (newColumn) {
        newColumn.total = data.tasks.filter((t) => t.columnId === newColumn.id).length;
      }
    }

    return {
      success: true,
      data: updatedTask,
      responseAt: new Date().toISOString(),
    };
  },

  // PATCH /api/todo/:id/status-column - Update status + columnId only
  async updateTaskStatusAndColumn(
    taskId: number,
    payload: { columnId: number; status: string }
  ): Promise<Response<Task>> {
    await delay(300);

    const data = await loadMockData();
    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw {
        code: 404,
        message: "Task not found",
      };
    }

    const oldTask = data.tasks[taskIndex];
    const updatedTask: Task = {
      ...oldTask,
      columnId: payload.columnId,
      status: payload.status,
      id: taskId,
    };

    data.tasks[taskIndex] = updatedTask;

    if (oldTask.columnId !== payload.columnId) {
      const oldColumn = data.columns.find((col) => col.id === oldTask.columnId);
      const newColumn = data.columns.find((col) => col.id === payload.columnId);
      if (oldColumn) {
        oldColumn.total = data.tasks.filter((t) => t.columnId === oldColumn.id).length;
      }
      if (newColumn) {
        newColumn.total = data.tasks.filter((t) => t.columnId === newColumn.id).length;
      }
    }

    return {
      success: true,
      data: updatedTask,
      responseAt: new Date().toISOString(),
    };
  },

  // DELETE /api/todo/:id - Delete task
  async deleteTask(taskId: number): Promise<Response<boolean>> {
    await delay(300);

    const data = await loadMockData();
    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      throw {
        code: 404,
        message: "Task not found",
      };
    }

    const deletedTask = data.tasks[taskIndex];
    data.tasks.splice(taskIndex, 1);

    // Update column total
    const column = data.columns.find((col) => col.id === deletedTask.columnId);
    if (column) {
      column.total = data.tasks.filter((t) => t.columnId === column.id).length;
    }

    return {
      success: true,
      data: true,
      responseAt: new Date().toISOString(),
    };
  },

  // Move task between columns
  async moveTask(
    taskId: number,
    fromColId: number,
    toColId: number,
    _newIndex: number
  ): Promise<Response<Task>> {
    await delay(300);

    const data = await loadMockData();
    const task = data.tasks.find((t) => t.id === taskId);

    if (!task) {
      throw {
        code: 404,
        message: "Task not found",
      };
    }

    task.columnId = toColId;

    // Update column totals
    const fromColumn = data.columns.find((col) => col.id === fromColId);
    const toColumn = data.columns.find((col) => col.id === toColId);
    if (fromColumn) {
      fromColumn.total = data.tasks.filter((t) => t.columnId === fromColId).length;
    }
    if (toColumn) {
      toColumn.total = data.tasks.filter((t) => t.columnId === toColId).length;
    }

    return {
      success: true,
      data: task,
      responseAt: new Date().toISOString(),
    };
  },
};
