import { CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { getRecentlyCompletedTasks } from "@/lib/data/tasks";
import { PageHeader } from "@/components/layout/page-header";
import { SimpleTaskList } from "@/components/tasks/task-list";
import { TaskFormTrigger } from "@/components/tasks/task-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đã hoàn thành",
};

export default async function CompletedPage() {
  const session = await requireUser();
  const [categories, completedTasks] = await Promise.all([
    getCategories(session.userId),
    getRecentlyCompletedTasks(session.userId),
  ]);

  return (
    <div>
      <PageHeader
        title="Đã hoàn thành"
        description="Các công việc bạn đã hoàn thành gần đây nhất."
        actions={<TaskFormTrigger categories={categories} />}
      />

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{completedTasks.length}</span> công
          việc đã được hoàn thành
        </p>
      </div>

      <SimpleTaskList
        tasks={completedTasks}
        categories={categories}
        className="space-y-3"
        emptyState={
          <EmptyState
            icon={CheckCircle2}
            title="Chưa có công việc nào được hoàn thành"
            description="Hoàn thành công việc đầu tiên để theo dõi tiến độ của bạn tại Dashboard."
            action={<TaskFormTrigger categories={categories} label="Tạo công việc" />}
          />
        }
      />
    </div>
  );
}
