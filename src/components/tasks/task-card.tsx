"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryBadge, PriorityBadge, StatusBadge, TagChip } from "@/components/tasks/task-badges";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { deleteTaskAction, toggleTaskStatusAction } from "@/lib/actions/tasks";
import { getDueDateMeta } from "@/lib/date";
import type { CategoryDTO, TaskDTO } from "@/types";

export function TaskCard({
  task,
  categories,
}: {
  task: TaskDTO;
  categories: CategoryDTO[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const completed = task.status === "COMPLETED";
  const due = getDueDateMeta(task.dueDate, task.status, task.completedAt);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleTaskStatusAction(task.id);
      if (result.ok) {
        toast.success(
          result.data.status === "COMPLETED"
            ? "Đã hoàn thành công việc"
            : "Đã khôi phục công việc",
        );
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleDelete(): Promise<boolean> {
    const result = await deleteTaskAction(task.id);
    if (result.ok) {
      toast.success("Đã xóa công việc");
      return true;
    }
    toast.error(result.error);
    return false;
  }

  return (
    <>
      <article
        className={cn(
          "group relative rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5",
          completed && "bg-muted/40 opacity-85 hover:opacity-100",
        )}
      >
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5">
            <Checkbox
              checked={completed}
              onCheckedChange={handleToggle}
              pending={pending}
              aria-label={completed ? `Bỏ đánh dấu ${task.title}` : `Hoàn thành ${task.title}`}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/tasks/${task.id}`}
                  className={cn(
                    "block truncate text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                    completed && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </Link>
                {task.description ? (
                  <p
                    className={cn(
                      "mt-1 line-clamp-1 text-sm text-muted-foreground",
                      completed && "opacity-70",
                    )}
                  >
                    {task.description}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  aria-label={`Chỉnh sửa công việc ${task.title}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Pencil className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  aria-label={`Xóa công việc ${task.title}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <PriorityBadge priority={task.priority} compact />
              {completed ? <StatusBadge status={task.status} /> : null}
              {task.category ? (
                <CategoryBadge name={task.category.name} color={task.category.color} />
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                  due.overdue
                    ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/25"
                    : due.today
                      ? "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/25"
                      : "bg-muted text-muted-foreground ring-transparent dark:bg-muted/60",
                )}
              >
                <CalendarDays className="size-3.5" aria-hidden />
                {due.label}
              </span>
              {task.tags.slice(0, 4).map((tag) => (
                <TagChip key={tag} name={tag} />
              ))}
              {task.tags.length > 4 ? (
                <span className="text-[11px] text-muted-foreground">
                  +{task.tags.length - 4}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <TaskFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        categories={categories}
        task={task}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Xóa công việc"
        description="Bạn có chắc chắn muốn xóa công việc này không?"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleDelete}
      />
    </>
  );
}
