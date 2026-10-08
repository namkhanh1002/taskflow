"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft animate-rise-in">
        <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <RefreshCw className="size-7" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Không thể tải dữ liệu</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {error.message || "Đã xảy ra lỗi, vui lòng thử lại."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={retry}>Thử lại</Button>
        </div>
      </div>
    </div>
  );
}
