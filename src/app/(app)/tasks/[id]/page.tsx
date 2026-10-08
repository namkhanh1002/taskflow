import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { getTaskById } from "@/lib/data/tasks";
import { TaskDetailView } from "@/components/tasks/task-detail";

export const metadata: Metadata = {
  title: "Chi tiết công việc",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: Props) {
  const session = await requireUser();
  const { id } = await params;

  const [task, categories] = await Promise.all([
    getTaskById(session.userId, id),
    getCategories(session.userId),
  ]);

  if (!task) {
    notFound();
  }

  return <TaskDetailView task={task} categories={categories} />;
}
