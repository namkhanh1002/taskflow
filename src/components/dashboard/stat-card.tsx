import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  progress,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "danger" | "neutral";
  progress?: number;
}) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  } as const;

  return (
    <Card className="p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl",
            accentClasses[accent ?? "neutral"],
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        {progress !== undefined ? (
          <span className="text-xs font-semibold text-muted-foreground">{progress}%</span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {progress !== undefined ? (
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tỉ lệ hoàn thành"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
