import { z } from "zod";
import { PRIORITIES, TASK_STATUSES } from "@/types";

const emailField = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email")
  .max(160, "Email quá dài")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(60, "Tên tối đa 60 ký tự"),
    email: emailField,
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(72, "Mật khẩu tối đa 72 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên công việc")
    .max(120, "Tên công việc tối đa 120 ký tự"),
  description: z
    .string()
    .trim()
    .max(2000, "Mô tả tối đa 2000 ký tự")
    .optional()
    .transform((value) => (value ? value : null)),
  status: z.enum(TASK_STATUSES, { message: "Trạng thái không hợp lệ" }),
  priority: z.enum(PRIORITIES, { message: "Mức ưu tiên không hợp lệ" }),
  dueDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày hết hạn không hợp lệ")
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
  categoryId: z.string().trim().nullable().optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag không được để trống")
        .max(30, "Tag tối đa 30 ký tự"),
    )
    .max(10, "Tối đa 10 tag")
    .default([]),
});

export type TaskInput = z.input<typeof taskSchema>;
export type TaskPayload = z.output<typeof taskSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(40, "Tên danh mục tối đa 40 ký tự"),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Màu không hợp lệ"),
  icon: z
    .string()
    .trim()
    .min(1)
    .max(40, "Icon không hợp lệ"),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(60, "Tên tối đa 60 ký tự"),
});

export const settingsSchema = z.object({
  taskReminders: z.boolean(),
  overdueAlerts: z.boolean(),
  weeklySummary: z.boolean(),
});

export function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return "Dữ liệu không hợp lệ";
  return first.message;
}
