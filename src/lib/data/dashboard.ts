import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, safeQuery } from "@/lib/errors";
import { startOfTodayUTC } from "@/lib/date";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const db = getDb();
  const today = startOfTodayUTC();

  const [total, completed, overdue] = await safeQuery(
    () =>
      Promise.all([
        db.task.count({ where: { userId } }),
        db.task.count({ where: { userId, status: "COMPLETED" } }),
        db.task.count({
          where: {
            userId,
            status: { not: "COMPLETED" },
            dueDate: { lt: today },
          },
        }),
      ]),
    ERROR_MESSAGES.dashboard,
  );

  return {
    total,
    completed,
    pending: total - completed,
    overdue,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
