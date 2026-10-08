"use server";

import { requireUser } from "@/lib/guards";
import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, isUniqueViolation, toFriendlyError } from "@/lib/errors";
import { revalidateApp } from "@/lib/revalidate";
import { parseDateOnly } from "@/lib/date";
import { formatZodError, taskSchema, type TaskInput } from "@/lib/validators";
import type { ActionResult, ActionResultWithData, TaskStatus } from "@/types";
import type { Prisma } from "@/generated/prisma/client";

async function ensureCategoryOwnership(userId: string, categoryId: string | null) {
  if (!categoryId) return { valid: true as const };
  const db = getDb();
  const category = await db.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });
  return category ? { valid: true as const } : { valid: false as const };
}

function buildTagRelations(userId: string, names: string[]) {
  const unique = Array.from(
    new Set(names.map((name) => name.trim()).filter(Boolean)),
  ).slice(0, 10);

  return unique.map((name) => ({
    tag: {
      connectOrCreate: {
        where: { userId_name: { userId, name } },
        create: { name, userId },
      },
    },
  })) satisfies Prisma.TaskTagCreateWithoutTaskInput[];
}

export async function createTaskAction(input: TaskInput): Promise<ActionResultWithData<{ id: string }>> {
  try {
    const session = await requireUser();
    const parsed = taskSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: formatZodError(parsed.error) };
    }

    const data = parsed.data;
    const category = await ensureCategoryOwnership(session.userId, data.categoryId ?? null);
    if (!category.valid) {
      return { ok: false, error: "Danh mục không hợp lệ." };
    }

    const db = getDb();
    const task = await db.task.create({
      data: {
        userId: session.userId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? parseDateOnly(data.dueDate) : null,
        completedAt: data.status === "COMPLETED" ? new Date() : null,
        categoryId: data.categoryId || null,
        tags: { create: buildTagRelations(session.userId, data.tags) },
      },
      select: { id: true },
    });

    revalidateApp();
    return { ok: true, data: { id: task.id } };
  } catch (error) {
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.taskCreate).message };
  }
}

export async function updateTaskAction(
  taskId: string,
  input: TaskInput,
): Promise<ActionResult> {
  try {
    const session = await requireUser();
    const parsed = taskSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: formatZodError(parsed.error) };
    }

    const db = getDb();
    const existing = await db.task.findFirst({
      where: { id: taskId, userId: session.userId },
      select: { id: true, status: true },
    });
    if (!existing) {
      return { ok: false, error: "Không tìm thấy công việc." };
    }

    const data = parsed.data;
    const category = await ensureCategoryOwnership(session.userId, data.categoryId ?? null);
    if (!category.valid) {
      return { ok: false, error: "Danh mục không hợp lệ." };
    }

    const completedAt =
      data.status === "COMPLETED"
        ? existing.status === "COMPLETED"
          ? undefined
          : new Date()
        : null;

    await db.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? parseDateOnly(data.dueDate) : null,
        completedAt,
        categoryId: data.categoryId || null,
        tags: {
          deleteMany: {},
          create: buildTagRelations(session.userId, data.tags),
        },
      },
    });

    revalidateApp();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.taskUpdate).message };
  }
}

export async function toggleTaskStatusAction(
  taskId: string,
): Promise<ActionResultWithData<{ status: TaskStatus }>> {
  try {
    const session = await requireUser();
    const db = getDb();
    const task = await db.task.findFirst({
      where: { id: taskId, userId: session.userId },
      select: { id: true, status: true },
    });
    if (!task) {
      return { ok: false, error: "Không tìm thấy công việc." };
    }

    const nextStatus: TaskStatus =
      task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    await db.task.update({
      where: { id: taskId },
      data: {
        status: nextStatus,
        completedAt: nextStatus === "COMPLETED" ? new Date() : null,
      },
    });

    revalidateApp();
    return { ok: true, data: { status: nextStatus } };
  } catch (error) {
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.taskUpdate).message };
  }
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const session = await requireUser();
    const db = getDb();
    const deleted = await db.task.deleteMany({
      where: { id: taskId, userId: session.userId },
    });
    if (deleted.count === 0) {
      return { ok: false, error: "Không tìm thấy công việc." };
    }

    revalidateApp();
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, error: ERROR_MESSAGES.generic };
    }
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.taskDelete).message };
  }
}
