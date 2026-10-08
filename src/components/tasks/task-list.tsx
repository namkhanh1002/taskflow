import type { ReactNode } from "react";
import { getTasks } from "@/lib/data/tasks";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import { TaskCard } from "@/components/tasks/task-card";
import { Pagination } from "@/components/tasks/pagination";
import type { CategoryDTO, TaskDTO, TaskFilters } from "@/types";

export async function TaskListSection({
  userId,
  filters,
  categories,
  emptyState,
}: {
  userId: string;
  filters: TaskFilters;
  categories: CategoryDTO[];
  emptyState: ReactNode;
}) {
  const { tasks, total, page, pageCount } = await getTasks(userId, filters);

  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} categories={categories} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} total={total} pageSize={TASKS_PAGE_SIZE} />
    </div>
  );
}

export function SimpleTaskList({
  tasks,
  categories,
  emptyState,
  className,
}: {
  tasks: TaskDTO[];
  categories: CategoryDTO[];
  emptyState: ReactNode;
  className?: string;
}) {
  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} categories={categories} />
        ))}
      </div>
    </div>
  );
}
