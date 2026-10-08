import { CalendarClock } from "lucide-react";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { getUpcomingTasks } from "@/lib/data/tasks";
import { PageHeader } from "@/components/layout/page-header";
import { SimpleTaskList } from "@/components/tasks/task-list";
import { TaskFormTrigger } from "@/components/tasks/task-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sắp tới",
};

export default async function UpcomingPage() {
  const session = await requireUser();
  const [categories, upcomingTasks] = await Promise.all([
    getCategories(session.userId),
    getUpcomingTasks(session.userId),
  ]);

  return (
    <div>
      <PageHeader
        title="Công việc sắp tới"
        description="Những công việc có thời hạn trong tương lai, được sắp xếp theo ngày."
        actions={<TaskFormTrigger categories={categories} />}
      />

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{upcomingTasks.length}</span> công
          việc đang chờ bạn ở phía trước
        </p>
      </div>

      <SimpleTaskList
        tasks={upcomingTasks}
        categories={categories}
        className="space-y-3"
        emptyState={
          <EmptyState
            icon={CalendarClock}
            title="Không có công việc sắp tới"
            description="Khi bạn tạo công việc có thời hạn trong tương lai, chúng sẽ xuất hiện tại đây."
            action={<TaskFormTrigger categories={categories} label="Tạo công việc" />}
          />
        }
      />
    </div>
  );
}
