import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, safeQuery } from "@/lib/errors";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import { startOfTodayUTC, addDaysUTC } from "@/lib/date";
import type { Priority, TaskDTO, TaskFilters, TaskListResult, TaskStatus } from "@/types";
import type { Prisma } from "@/generated/prisma/client";

type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    category: true;
    tags: { include: { tag: true } };
  };
}>;

export function toTaskDTO(task: TaskWithRelations): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority as Priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    category: task.category
      ? {
          id: task.category.id,
          name: task.category.name,
          color: task.category.color,
          icon: task.category.icon,
        }
      : null,
    tags: task.tags.map((relation) => relation.tag.name),
  };
}

const taskInclude = {
  category: true,
  tags: { include: { tag: true, }, orderBy: { tag: { name: "asc" as const } } },
} satisfies Prisma.TaskInclude;

function buildWhere(userId: string, filters: TaskFilters): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = { userId };

  if (filters.q.trim()) {
    where.OR = [
      { title: { contains: filters.q.trim(), mode: "insensitive" } },
      { description: { contains: filters.q.trim(), mode: "insensitive" } },
    ];
  }
  if (filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters.priority !== "ALL") {
    where.priority = filters.priority;
  }
  if (filters.category === "NONE") {
    where.categoryId = null;
  } else if (filters.category !== "ALL") {
    where.categoryId = filters.category;
  }
  return where;
}

function buildOrderBy(sort: TaskFilters["sort"]): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "due":
      return [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }];
    case "priority":
      return [{ priority: "desc" }, { createdAt: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function getTasks(
  userId: string,
  filters: TaskFilters,
): Promise<TaskListResult> {
  const db = getDb();
  const where = buildWhere(userId, filters);
  const orderBy = buildOrderBy(filters.sort);

  const [total, tasks] = await safeQuery(
    () =>
      Promise.all([
        db.task.count({ where }),
        db.task.findMany({
          where,
          include: taskInclude,
          orderBy,
          skip: (filters.page - 1) * TASKS_PAGE_SIZE,
          take: TASKS_PAGE_SIZE,
        }),
      ]),
    ERROR_MESSAGES.taskList,
  );

  return {
    tasks: tasks.map(toTaskDTO),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / TASKS_PAGE_SIZE)),
  };
}

export async function getTaskById(
  userId: string,
  taskId: string,
): Promise<TaskDTO | null> {
  const db = getDb();
  const task = await safeQuery(
    () =>
      db.task.findFirst({
        where: { id: taskId, userId },
        include: taskInclude,
      }),
    ERROR_MESSAGES.taskLoad,
  );
  return task ? toTaskDTO(task) : null;
}

export async function getTasksDueToday(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const today = startOfTodayUTC();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: { gte: today, lt: addDaysUTC(today, 1) },
        },
        include: taskInclude,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}

export async function getTodaysTasks(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const today = startOfTodayUTC();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: {
          userId,
          dueDate: { gte: today, lt: addDaysUTC(today, 1) },
        },
        include: taskInclude,
        orderBy: [{ status: "asc" }, { priority: "desc" }],
        take: 30,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}

export async function getUpcomingTasks(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const today = startOfTodayUTC();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: { gte: addDaysUTC(today, 1) },
        },
        include: taskInclude,
        orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
        take: 8,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}

export async function getRecentlyCompletedTasks(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: { userId, status: "COMPLETED" },
        include: taskInclude,
        orderBy: [{ completedAt: "desc" }, { updatedAt: "desc" }],
        take: 8,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}

export async function getPendingTasksWithoutDueDate(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: { userId, status: { not: "COMPLETED" }, dueDate: null },
        include: taskInclude,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}

export async function getOverdueTasks(userId: string): Promise<TaskDTO[]> {
  const db = getDb();
  const tasks = await safeQuery(
    () =>
      db.task.findMany({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: { lt: startOfTodayUTC() },
        },
        include: taskInclude,
        orderBy: [{ dueDate: "asc" }],
        take: 8,
      }),
    ERROR_MESSAGES.taskList,
  );
  return tasks.map(toTaskDTO);
}
