const VI_DATE = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const VI_DATETIME = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

const VI_MONTH_DAY = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const VI_RELATIVE = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDateOnly(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function addDaysUTC(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function formatDateOnly(value: string | Date | null | undefined): string {
  if (!value) return "Không đặt hạn";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "Không đặt hạn";
  return VI_DATE.format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return VI_DATETIME.format(date);
}

export function formatLongDate(date: Date = new Date()): string {
  return VI_MONTH_DAY.format(date);
}

export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < minute) return "vừa xong";
  if (abs < hour) return VI_RELATIVE.format(Math.round(diff / minute), "minute");
  if (abs < day) return VI_RELATIVE.format(Math.round(diff / hour), "hour");
  if (abs < 30 * day) return VI_RELATIVE.format(Math.round(diff / day), "day");
  return formatDateOnly(date);
}

export function isOverdue(
  dueDate: string | null,
  status: string,
  completedAt: string | null = null,
): boolean {
  if (!dueDate || status === "COMPLETED" || completedAt) return false;
  return new Date(dueDate).getTime() < startOfTodayUTC().getTime();
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return toDateOnly(startOfTodayUTC()) === toDateOnly(new Date(dueDate));
}

export function getDueDateMeta(
  dueDate: string | null,
  status: string,
  completedAt: string | null = null,
): { label: string; overdue: boolean; today: boolean } {
  if (!dueDate) {
    return { label: "Không đặt hạn", overdue: false, today: false };
  }
  const overdue = isOverdue(dueDate, status, completedAt);
  const today = isDueToday(dueDate);
  if (overdue) return { label: `Quá hạn · ${formatDateOnly(dueDate)}`, overdue, today };
  if (today) return { label: "Hôm nay", overdue, today };
  return { label: formatDateOnly(dueDate), overdue, today };
}
