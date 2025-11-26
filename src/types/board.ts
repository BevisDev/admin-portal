export interface Board {
  id: number;
  title: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  taskOrder: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: string;
  dueDate?: string;
}
