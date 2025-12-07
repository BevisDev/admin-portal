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
  isSystem?: boolean; // true = không cho xoá/sửa (vd: planned, done)
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  progress?: number;
  comments?: number;
  views?: number;
  assignees: string[];
  columnId: number;
  order?: number;
}
