import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import type { Priority, TaskStatus } from "@/types";

export function PriorityBadge({
  priority,
  compact = false,
  className,
}: {
  priority: Priority;
  compact?: boolean;
  className?: string;
}) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge className={cn(meta.badgeClass, className)}>
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {compact ? meta.shortLabel : meta.label}
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn(meta.badgeClass, className)}>
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {meta.label}
    </Badge>
  );
}

export function CategoryBadge({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "border-transparent bg-muted text-muted-foreground ring-0 dark:bg-muted/60",
        className,
      )}
      style={{ backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)` }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="text-foreground/80">{name}</span>
    </Badge>
  );
}

export function TagChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      #{name}
    </span>
  );
}
