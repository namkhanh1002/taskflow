import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge, PriorityBadge } from "@/components/tasks/task-badges";
import { getDueDateMeta } from "@/lib/date";
import type { TaskDTO } from "@/types";

export function DashboardSection({
  title,
  icon: Icon,
  href,
  linkLabel,
  tasks,
  emptyState,
}: {
  title: string;
  icon: LucideIcon;
  href: string;
  linkLabel: string;
  tasks: TaskDTO[];
  emptyState: { title: string; description: string };
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4.5" aria-hidden />
          </span>
          <CardTitle className="text-[15px]">{title}</CardTitle>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-7 text-center">
            <p className="text-sm font-medium text-foreground">{emptyState.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {emptyState.description}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {tasks.slice(0, 5).map((task) => {
              const due = getDueDateMeta(task.dueDate, task.status, task.completedAt);
              return (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        task.status === "COMPLETED"
                          ? "bg-emerald-500"
                          : due.overdue
                            ? "bg-rose-500"
                            : "bg-primary/70",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary",
                          task.status === "COMPLETED" && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "text-xs",
                            due.overdue ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
                          )}
                        >
                          {due.label}
                        </span>
                        {task.category ? (
                          <CategoryBadge
                            name={task.category.name}
                            color={task.category.color}
                            className="px-1.5 py-0 text-[10px]"
                          />
                        ) : null}
                      </span>
                    </span>
                    <PriorityBadge priority={task.priority} compact className="shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function SectionGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
