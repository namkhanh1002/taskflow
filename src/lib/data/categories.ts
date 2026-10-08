import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, safeQuery } from "@/lib/errors";
import type { CategoryDTO } from "@/types";

export async function getCategories(userId: string): Promise<CategoryDTO[]> {
  const db = getDb();
  const categories = await safeQuery(
    () =>
      db.category.findMany({
        where: { userId },
        orderBy: [{ createdAt: "asc" }],
        include: { _count: { select: { tasks: true } } },
      }),
    ERROR_MESSAGES.categoryList,
  );

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    taskCount: category._count.tasks,
  }));
}

export async function getCategoryNames(userId: string): Promise<string[]> {
  const db = getDb();
  const categories = await safeQuery(
    () => db.category.findMany({ where: { userId }, select: { name: true } }),
    ERROR_MESSAGES.categoryList,
  );
  return categories.map((category) => category.name);
}
