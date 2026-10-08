import { Suspense } from "react";
import Link from "next/link";
import { ClipboardList, SearchX } from "lucide-react";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { hasActiveFilters, parseTaskFilters } from "@/lib/task-filters";
import { PageHeader } from "@/components/layout/page-header";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskListSection } from "@/components/tasks/task-list";
import { TaskFormTrigger } from "@/components/tasks/task-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả công việc",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TasksPage({ searchParams }: Props) {
  const [session, params] = await Promise.all([requireUser(), searchParams]);
  const filters = parseTaskFilters(params);
  const categories = await getCategories(session.userId);
  const filtered = hasActiveFilters(filters);

  return (
    <div>
      <PageHeader
        title="Tất cả công việc"
        description="Tìm kiếm, lọc và sắp xếp toàn bộ công việc của bạn."
        actions={<TaskFormTrigger categories={categories} />}
      />

      <TaskFilters filters={filters} categories={categories} />

      <Suspense key={JSON.stringify(filters)} fallback={<ListSkeleton count={5} />}>
        <TaskListSection
          userId={session.userId}
          filters={filters}
          categories={categories}
          emptyState={
            filtered ? (
              <EmptyState
                icon={SearchX}
                title="Không tìm thấy công việc phù hợp"
                description="Hãy thử từ khóa khác hoặc thay đổi bộ lọc để xem thêm kết quả."
                action={
                  <Link href="/tasks">
                    <Button variant="outline">Xóa bộ lọc</Button>
                  </Link>
                }
              />
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Bạn chưa có công việc nào"
                description="Tạo công việc đầu tiên để bắt đầu tổ chức ngày làm việc của bạn."
                action={<TaskFormTrigger categories={categories} label="Tạo công việc đầu tiên" />}
              />
            )
          }
        />
      </Suspense>
    </div>
  );
}
