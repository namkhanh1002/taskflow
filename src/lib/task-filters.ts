import { PRIORITY_FILTERS, SORT_KEYS, STATUS_FILTERS, type TaskFilters } from "@/types";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseTaskFilters(
  params: Record<string, string | string[] | undefined>,
): TaskFilters {
  const statusValue = first(params.status) ?? "ALL";
  const priorityValue = first(params.priority) ?? "ALL";
  const categoryValue = first(params.category) ?? "ALL";
  const sortValue = first(params.sort) ?? "newest";
  const pageValue = Number.parseInt(first(params.page) ?? "1", 10);

  const status = STATUS_FILTERS.find((item) => item === statusValue) ?? "ALL";
  const priority = PRIORITY_FILTERS.find((item) => item === priorityValue) ?? "ALL";
  const sort = SORT_KEYS.find((item) => item === sortValue) ?? "newest";
  const category =
    categoryValue === "ALL" || categoryValue === "NONE"
      ? categoryValue
      : /^[a-zA-Z0-9_-]{1,64}$/.test(categoryValue)
        ? categoryValue
        : "ALL";

  return {
    q: (first(params.q) ?? "").slice(0, 100),
    status,
    priority,
    category,
    sort,
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.min(pageValue, 10_000) : 1,
  };
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return (
    filters.q !== "" ||
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.category !== "ALL" ||
    filters.sort !== "newest"
  );
}
