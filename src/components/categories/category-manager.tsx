"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FolderKanban, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_ICON_KEYS,
} from "@/lib/constants";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import type { CategoryDTO } from "@/types";

interface CategoryFormValues {
  name: string;
  color: string;
  icon: string;
}

function toValues(category?: CategoryDTO | null): CategoryFormValues {
  if (!category) {
    return { name: "", color: CATEGORY_COLORS[0], icon: "folder" };
  }
  return { name: category.name, color: category.color, icon: category.icon };
}

function CategoryForm({
  category,
  formId,
  onSuccess,
  onCancel,
}: {
  category?: CategoryDTO | null;
  formId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<CategoryFormValues>(() => toValues(category));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = category
      ? await updateCategoryAction(category.id, values)
      : await createCategoryAction(values);

    if (result.ok) {
      toast.success(category ? "Đã cập nhật danh mục" : "Đã tạo danh mục mới");
      onSuccess();
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    setPending(false);
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
        >
          {error}
        </div>
      ) : null}

      <FormField label="Tên danh mục" htmlFor={`${formId}-name`} required>
        <Input
          id={`${formId}-name`}
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Ví dụ: Dự án cá nhân"
          maxLength={40}
          required
          autoFocus
        />
      </FormField>

      <FormField label="Màu sắc" htmlFor={`${formId}-color`}>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn màu danh mục">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={values.color === color}
              aria-label={`Màu ${color}`}
              onClick={() => setValues((prev) => ({ ...prev, color }))}
              className={cn(
                "size-8 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                values.color === color &&
                  "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Biểu tượng" htmlFor={`${formId}-icon`}>
        <div className="grid grid-cols-9 gap-2" role="radiogroup" aria-label="Chọn biểu tượng">
          {CATEGORY_ICON_KEYS.map((key) => {
            const Icon = CATEGORY_ICONS[key];
            const active = values.icon === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Biểu tượng ${key}`}
                onClick={() => setValues((prev) => ({ ...prev, icon: key }))}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4.5" aria-hidden />
              </button>
            );
          })}
        </div>
      </FormField>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          Hủy
        </Button>
        <Button type="submit" loading={pending}>
          {category ? "Lưu thay đổi" : "Tạo danh mục"}
        </Button>
      </div>
    </form>
  );
}

export function CategoryManager({ categories }: { categories: CategoryDTO[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [deleting, setDeleting] = useState<CategoryDTO | null>(null);

  async function handleDelete(): Promise<boolean> {
    if (!deleting) return false;
    const result = await deleteCategoryAction(deleting.id);
    if (result.ok) {
      toast.success("Đã xóa danh mục");
      return true;
    }
    toast.error(result.error);
    return false;
  }

  return (
    <div>
      <PageHeader
        title="Danh mục"
        description="Tổ chức công việc theo nhóm của riêng bạn."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <FolderPlus className="size-4" aria-hidden />
            Tạo danh mục
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Chưa có danh mục nào"
          description="Tạo danh mục đầu tiên để phân loại công việc của bạn."
          action={<Button onClick={() => setCreateOpen(true)}>Tạo danh mục</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon] ?? FolderKanban;
            return (
              <Card
                key={category.id}
                className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${category.color} 16%, transparent)`,
                      color: category.color,
                    }}
                  >
                    <Icon className="size-5.5" aria-hidden />
                  </span>
                  <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => setEditing(category)}
                      aria-label={`Chỉnh sửa danh mục ${category.name}`}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(category)}
                      aria-label={`Xóa danh mục ${category.name}`}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>

                <h2 className="mt-4 text-[15px] font-semibold text-foreground">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.taskCount ?? 0} công việc
                </p>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: category.color,
                      width: `${Math.min(100, Math.max(6, (category.taskCount ?? 0) * 12))}%`,
                    }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tạo danh mục mới"
        description="Đặt tên, chọn màu và biểu tượng cho danh mục."
      >
        <CategoryForm
          formId="category-create-form"
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </Dialog>

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        title="Chỉnh sửa danh mục"
        description="Cập nhật thông tin của danh mục."
      >
        <CategoryForm
          category={editing}
          formId="category-edit-form"
          onSuccess={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này không? Các công việc trong danh mục sẽ không bị xóa."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleDelete}
      />
    </div>
  );
}
