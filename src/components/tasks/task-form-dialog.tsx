"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ListPlus, Save } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { TagInput } from "@/components/tasks/tag-input";
import { createTaskAction, updateTaskAction } from "@/lib/actions/tasks";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { toDateOnly } from "@/lib/date";
import type {
  ActionResult,
  CategoryDTO,
  Priority,
  TaskDTO,
  TaskStatus,
} from "@/types";
import type { TaskInput } from "@/lib/validators";

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  categoryId: string;
  tags: string[];
}

function toFormValues(task?: TaskDTO | null): FormValues {
  if (!task) {
    return {
      title: "",
      description: "",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: "",
      categoryId: "",
      tags: [],
    };
  }
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? toDateOnly(new Date(task.dueDate)) : "",
    categoryId: task.category?.id ?? "",
    tags: task.tags,
  };
}

function toInput(values: FormValues): TaskInput {
  return {
    title: values.title,
    description: values.description,
    status: values.status,
    priority: values.priority,
    dueDate: values.dueDate || null,
    categoryId: values.categoryId || null,
    tags: values.tags,
  };
}

export function TaskForm({
  task,
  categories,
  formId,
  onSuccess,
  onCancel,
  submitLabel,
  autoFocus = true,
}: {
  task?: TaskDTO | null;
  categories: CategoryDTO[];
  formId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  autoFocus?: boolean;
}) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(task));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const input = toInput(values);
    const result: ActionResult<{ id?: string }> = task
      ? await updateTaskAction(task.id, input)
      : await createTaskAction(input);

    if (result.ok) {
      toast.success(task ? "Đã cập nhật công việc" : "Đã tạo công việc thành công");
      onSuccess();
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    setPending(false);
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
        >
          {error}
        </div>
      ) : null}

      <FormField label="Tên công việc" htmlFor={`${formId ?? "task"}-title`} required>
        <Input
          id={`${formId ?? "task"}-title`}
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Ví dụ: Hoàn thành báo cáo tuần"
          maxLength={120}
          required
          autoFocus={autoFocus}
          invalid={Boolean(error) && !values.title.trim()}
        />
      </FormField>

      <FormField label="Mô tả" htmlFor={`${formId ?? "task"}-description`}>
        <Textarea
          id={`${formId ?? "task"}-description`}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Mô tả chi tiết (tùy chọn)..."
          maxLength={2000}
          rows={3}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Mức ưu tiên" htmlFor={`${formId ?? "task"}-priority`}>
          <Select
            id={`${formId ?? "task"}-priority`}
            value={values.priority}
            onChange={(event) => update("priority", event.target.value as Priority)}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Trạng thái" htmlFor={`${formId ?? "task"}-status`}>
          <Select
            id={`${formId ?? "task"}-status`}
            value={values.status}
            onChange={(event) => update("status", event.target.value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Ngày hết hạn" htmlFor={`${formId ?? "task"}-due`}>
          <Input
            id={`${formId ?? "task"}-due`}
            type="date"
            value={values.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
          />
        </FormField>

        <FormField label="Danh mục" htmlFor={`${formId ?? "task"}-category`}>
          <Select
            id={`${formId ?? "task"}-category`}
            value={values.categoryId}
            onChange={(event) => update("categoryId", event.target.value)}
          >
            <option value="">Không danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField
        label="Tags"
        htmlFor={`${formId ?? "task"}-tags`}
        hint="Nhấn Enter để thêm tag. Tối đa 10 tag."
      >
        <TagInput value={values.tags} onChange={(tags) => update("tags", tags)} disabled={pending} />
      </FormField>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button variant="outline" onClick={onCancel} disabled={pending} type="button">
            Hủy
          </Button>
        ) : null}
        <Button type="submit" loading={pending}>
          {task ? <Save className="size-4" aria-hidden /> : <ListPlus className="size-4" aria-hidden />}
          {submitLabel ?? (task ? "Lưu thay đổi" : "Tạo công việc")}
        </Button>
      </div>
    </form>
  );
}

export function TaskFormDialog({
  open,
  onOpenChange,
  categories,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryDTO[];
  task?: TaskDTO | null;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={task ? "Chỉnh sửa công việc" : "Tạo công việc mới"}
      description={
        task
          ? "Cập nhật thông tin, thời hạn và mức ưu tiên của công việc."
          : "Điền các thông tin bên dưới để thêm công việc mới."
      }
      contentClassName="max-w-xl"
    >
      <TaskForm
        task={task}
        categories={categories}
        formId="task-dialog-form"
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

export function TaskFormTrigger({
  categories,
  label,
  variant = "primary",
  size = "md",
  className,
}: {
  categories: CategoryDTO[];
  label?: string;
  variant?: "primary" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} className={className}>
        {label ?? "Thêm công việc"}
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} categories={categories} />
    </>
  );
}
