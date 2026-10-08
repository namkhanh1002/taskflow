import Link from "next/link";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/components/layout/nav-items";

export function Logo({ className, collapsed }: { className?: string; collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "group flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={`${BRAND.name} - về trang chủ`}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-violet-500 text-white shadow-sm">
        <CheckCheck className="size-5" aria-hidden />
      </span>
      {!collapsed ? (
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            {BRAND.name}
          </span>
          <span className="text-[11px] text-muted-foreground">{BRAND.tagline}</span>
        </span>
      ) : null}
    </Link>
  );
}
