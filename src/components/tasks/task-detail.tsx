"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  History,
  ListTodo,
  Pencil,
  RotateCcw,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryBadge, PriorityBadge, StatusBadge, TagChip } from "@/components/tasks/task-badges";
import { TaskForm } from "@/components/tasks/task-form-dialog";
import { deleteTaskAction, toggleTaskStatusAction } from "@/lib/actions/tasks";
import { formatDateTime, getDueDateMeta, formatRelative } from "@/lib/date";
import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import type { CategoryDTO, TaskDTO } from "@/types";

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{children}</div>
      </div>
    </div>
  );
}

export function TaskDetailView({
  task,
  categories,
}: {
  task: TaskDTO;
  categories: CategoryDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
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
      router.push("/tasks");
      router.refresh();
      return true;
    }
    toast.error(result.error);
    return false;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại danh sách
        </Link>
        {!editing ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="size-4" aria-hidden />
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              loading={pending}
            >
              {completed ? (
                <>
                  <RotateCcw className="size-4" aria-hidden />
                  Khôi phục
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" aria-hidden />
                  Đánh dấu hoàn thành
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4" aria-hidden />
              Xóa
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.category ? (
                  <CategoryBadge name={task.category.name} color={task.category.color} />
                ) : null}
              </div>
              <CardTitle className="pt-2 text-xl sm:text-2xl">
                {editing ? "Chỉnh sửa công việc" : task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {editing ? (
                <TaskForm
                  task={task}
                  categories={categories}
                  formId="task-detail-form"
                  onSuccess={() => {
                    setEditing(false);
                    router.refresh();
                  }}
                  onCancel={() => setEditing(false)}
                  autoFocus={false}
                />
              ) : (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Mô tả
                    </h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {task.description?.trim() ||
                        "Không có mô tả chi tiết cho công việc này."}
                    </p>
                  </div>

                  <div className="divide-y divide-border rounded-xl border border-border bg-muted/30 px-4">
                    <MetaRow icon={CalendarDays} label="Ngày hết hạn">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          due.overdue ? "text-destructive" : "text-foreground",
                        )}
                      >
                        {due.label}
                      </span>
                      {task.dueDate ? (
                        <span className="text-xs text-muted-foreground">
                          ({formatDateTime(task.dueDate)})
                        </span>
                      ) : null}
                    </MetaRow>
                    <MetaRow icon={ListTodo} label="Trạng thái">
                      <span className="text-sm text-foreground">
                        {STATUS_META[task.status].label} – {STATUS_META[task.status].description}
                      </span>
                    </MetaRow>
                    <MetaRow icon={History} label="Mức ưu tiên">
                      <span className="text-sm text-foreground">
                        {PRIORITY_META[task.priority].label} –{" "}
                        {PRIORITY_META[task.priority].description}
                      </span>
                    </MetaRow>
                    <MetaRow icon={TagIcon} label="Tags">
                      {task.tags.length > 0 ? (
                        task.tags.map((tag) => <TagChip key={tag} name={tag} />)
                      ) : (
                        <span className="text-sm text-muted-foreground">Không có tag</span>
                      )}
                    </MetaRow>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Hoàn thành</CardTitle>
                <Checkbox
                  checked={completed}
                  onCheckedChange={handleToggle}
                  pending={pending}
                  aria-label={
                    completed ? "Bỏ đánh dấu hoàn thành" : "Đánh dấu hoàn thành"
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {completed
                  ? "Công việc này đã được đánh dấu hoàn thành."
                  : "Đánh dấu công việc là hoàn thành khi bạn đã xử lý xong."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Ngày tạo</span>
                <span className="font-medium text-foreground">
                  {formatDateTime(task.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Cập nhật</span>
                <span className="font-medium text-foreground">
                  {formatRelative(task.updatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Hoàn thành lúc</span>
                <span className="font-medium text-foreground">
                  {task.completedAt ? formatDateTime(task.completedAt) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Danh mục</span>
                {task.category ? (
                  <CategoryBadge name={task.category.name} color={task.category.color} />
                ) : (
                  <span className="font-medium text-foreground">Không có</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Xóa công việc"
        description="Bạn có chắc chắn muốn xóa công việc này không?"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleDelete}
      />
    </div>
  );
}
