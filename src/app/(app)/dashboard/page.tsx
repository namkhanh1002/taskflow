import Link from "next/link";
import {
  AlertOctagon,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  PlusCircle,
} from "lucide-react";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { getDashboardStats } from "@/lib/data/dashboard";
import {
  getRecentlyCompletedTasks,
  getTasksDueToday,
  getUpcomingTasks,
} from "@/lib/data/tasks";
import { formatLongDate } from "@/lib/date";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardSection, SectionGrid } from "@/components/dashboard/dashboard-sections";
import { TaskFormTrigger } from "@/components/tasks/task-form-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default async function DashboardPage() {
  const session = await requireUser();

  const [stats, categories, todayTasks, upcomingTasks, completedTasks] =
    await Promise.all([
      getDashboardStats(session.userId),
      getCategories(session.userId),
      getTasksDueToday(session.userId),
      getUpcomingTasks(session.userId),
      getRecentlyCompletedTasks(session.userId),
    ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={`${getGreeting()}, ${session.name.split(" ").slice(-1)[0] ?? session.name}!`}
        description={formatLongDate()}
        actions={<TaskFormTrigger categories={categories} />}
      />

      <section aria-label="Thống kê công việc">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <StatCard
            icon={ListTodo}
            label="Tổng công việc"
            value={stats.total}
            accent="neutral"
          />
          <StatCard
            icon={CheckCircle2}
            label="Đã hoàn thành"
            value={stats.completed}
            accent="success"
          />
          <StatCard
            icon={Clock3}
            label="Chưa hoàn thành"
            value={stats.pending}
            accent="warning"
          />
          <StatCard
            icon={AlertOctagon}
            label="Quá hạn"
            value={stats.overdue}
            accent="danger"
          />
          <div className="col-span-2 xl:col-span-1">
            <StatCard
              icon={CheckCircle2}
              label="Tỉ lệ hoàn thành"
              value={`${stats.completionRate}%`}
              accent="primary"
              progress={stats.completionRate}
            />
          </div>
        </div>
      </section>

      <section aria-label="Công việc nổi bật" className="space-y-4">
        <SectionGrid>
          <DashboardSection
            title="Công việc hôm nay"
            icon={CalendarCheck}
            href="/today"
            linkLabel="Xem tất cả"
            tasks={todayTasks}
            emptyState={{
              title: "Không có công việc đến hạn hôm nay",
              description: "Hãy thêm công việc mới hoặc tận hưởng ngày trống của bạn.",
            }}
          />
          <DashboardSection
            title="Công việc sắp tới"
            icon={CalendarClock}
            href="/upcoming"
            linkLabel="Xem tất cả"
            tasks={upcomingTasks}
            emptyState={{
              title: "Không có công việc sắp tới",
              description: "Các công việc có thời hạn trong tương lai sẽ xuất hiện ở đây.",
            }}
          />
          <DashboardSection
            title="Vừa hoàn thành"
            icon={CheckCircle2}
            href="/completed"
            linkLabel="Xem tất cả"
            tasks={completedTasks}
            emptyState={{
              title: "Chưa có công việc nào được hoàn thành",
              description: "Hoàn thành công việc đầu tiên để theo dõi tiến độ của bạn.",
            }}
          />
        </SectionGrid>
      </section>

      <section className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <PlusCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Có kế hoạch mới cho hôm nay?
              </p>
              <p className="text-sm text-muted-foreground">
                Tạo công việc và đặt mức ưu tiên để không bỏ lỡ điều quan trọng.
              </p>
            </div>
          </div>
          <Link
            href="/tasks"
            className="shrink-0 text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Đi tới danh sách công việc →
          </Link>
        </div>
      </section>
    </div>
  );
}
