export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SORT_KEYS = ["newest", "oldest", "due", "priority"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const STATUS_FILTERS = ["ALL", ...TASK_STATUSES] as const;
export const PRIORITY_FILTERS = ["ALL", ...PRIORITIES] as const;

export interface CategoryDTO {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount?: number;
}

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryDTO | null;
  tags: string[];
}

export interface TaskFilters {
  q: string;
  status: (typeof STATUS_FILTERS)[number];
  priority: (typeof PRIORITY_FILTERS)[number];
  category: string;
  sort: SortKey;
  page: number;
}

export interface TaskListResult {
  tasks: TaskDTO[];
  total: number;
  page: number;
  pageCount: number;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface UserSettingsDTO {
  taskReminders: boolean;
  overdueAlerts: boolean;
  weeklySummary: boolean;
}

export interface FormState {
  error: string | null;
}

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export type ActionResultWithData<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
