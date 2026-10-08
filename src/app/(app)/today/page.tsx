import { CalendarCheck, PartyPopper } from "lucide-react";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { getTodaysTasks } from "@/lib/data/tasks";
import { formatLongDate } from "@/lib/date";
import { PageHeader } from "@/components/layout/page-header";
import { SimpleTaskList } from "@/components/tasks/task-list";
import { TaskFormTrigger } from "@/components/tasks/task-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hôm nay",
};

export default async function TodayPage() {
  const session = await requireUser();
  const [categories, todaysTasks] = await Promise.all([
    getCategories(session.userId),
    getTodaysTasks(session.userId),
  ]);

  const pending = todaysTasks.filter((task) => task.status !== "COMPLETED");
  const completed = todaysTasks.filter((task) => task.status === "COMPLETED");

  return (
    <div>
      <PageHeader
        title="Hôm nay"
        description={formatLongDate()}
        actions={<TaskFormTrigger categories={categories} />}
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{pending.length}</span> công việc
          đang chờ xử lý hôm nay
        </p>
        {completed.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {completed.length}
            </span>{" "}
            đã hoàn thành
          </p>
        ) : null}
      </div>

      {pending.length > 0 ? (
        <SimpleTaskList
          tasks={pending}
          categories={categories}
          emptyState={null}
          className="space-y-3"
        />
      ) : completed.length > 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Hôm nay bạn đã hoàn thành tất cả công việc!"
          description="Tuyệt vời – hãy nghỉ ngơi hoặc lên kế hoạch cho ngày mai."
          action={<TaskFormTrigger categories={categories} label="Thêm công việc mới" variant="outline" />}
        />
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="Không có công việc đến hạn hôm nay"
          description="Tạo một công việc mới để bắt đầu ngày làm việc hiệu quả."
          action={<TaskFormTrigger categories={categories} label="Tạo công việc" />}
        />
      )}

      {completed.length > 0 && pending.length > 0 ? (
        <section aria-label="Đã hoàn thành hôm nay" className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Đã hoàn thành hôm nay
          </h2>
          <SimpleTaskList
            tasks={completed}
            categories={categories}
            emptyState={null}
            className="space-y-3"
          />
        </section>
      ) : null}
    </div>
  );
}
