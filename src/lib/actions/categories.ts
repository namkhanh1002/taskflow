"use server";

import { requireUser } from "@/lib/guards";
import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, isUniqueViolation, toFriendlyError } from "@/lib/errors";
import { revalidateApp } from "@/lib/revalidate";
import { categorySchema, formatZodError } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function createCategoryAction(
  input: { name: string; color: string; icon: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireUser();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: formatZodError(parsed.error) };
    }

    const db = getDb();
    const category = await db.category.create({
      data: {
        userId: session.userId,
        name: parsed.data.name,
        color: parsed.data.color,
        icon: parsed.data.icon,
      },
      select: { id: true },
    });

    revalidateApp();
    return { ok: true, data: { id: category.id } };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, error: "Tên danh mục đã tồn tại." };
    }
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.categoryCreate).message };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  input: { name: string; color: string; icon: string },
): Promise<ActionResult> {
  try {
    const session = await requireUser();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: formatZodError(parsed.error) };
    }

    const db = getDb();
    const existing = await db.category.findFirst({
      where: { id: categoryId, userId: session.userId },
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: "Không tìm thấy danh mục." };
    }

    await db.category.update({
      where: { id: categoryId },
      data: {
        name: parsed.data.name,
        color: parsed.data.color,
        icon: parsed.data.icon,
      },
    });

    revalidateApp();
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, error: "Tên danh mục đã tồn tại." };
    }
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.categoryUpdate).message };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionResult> {
  try {
    const session = await requireUser();
    const db = getDb();
    const deleted = await db.category.deleteMany({
      where: { id: categoryId, userId: session.userId },
    });
    if (deleted.count === 0) {
      return { ok: false, error: "Không tìm thấy danh mục." };
    }

    revalidateApp();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.categoryDelete).message };
  }
}
