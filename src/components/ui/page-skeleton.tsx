import { Skeleton, ListSkeleton, StatCardSkeleton } from "@/components/ui/skeleton";

export function PageSkeleton({
  variant = "list",
}: {
  variant?: "stats" | "list" | "form" | "detail";
}) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải trang">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {variant === "stats" ? (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <div className="col-span-2 xl:col-span-1">
            <StatCardSkeleton />
          </div>
        </div>
      ) : null}

      {variant === "form" ? (
        <div className="max-w-3xl space-y-5 rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      ) : null}

      {variant === "detail" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>
        </div>
      ) : null}

      {variant !== "form" && variant !== "detail" ? (
        <ListSkeleton count={variant === "stats" ? 3 : 5} />
      ) : null}
    </div>
  );
}
