export interface Todo {
  columns: Column[];
  tasks: Task[];
}

export interface Column {
  id: number;
  title: string;
  order: number;
  color?: string;
  icon?: string;
  total: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
  priority: number;
  progress?: number;
  comments?: number;
  views?: number;
  assignees: string[];
  columnId: number;
  order?: number;
}
