import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="size-7" aria-hidden />
        </span>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button>Về Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline">Danh sách công việc</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
