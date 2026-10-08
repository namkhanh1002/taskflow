"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ListFilter, Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CategoryDTO, TaskFilters } from "@/types";

type ParamPatch = Record<string, string>;

export function TaskFilters({
  filters,
  categories,
  showSearch = true,
  placeholder = "Tìm theo tên công việc...",
}: {
  filters: TaskFilters;
  categories: CategoryDTO[];
  showSearch?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(filters.q);
  const debouncedSearch = useDebounce(search, 350);

  const applyParams = useCallback(
    (patch: ParamPatch) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (!value || value === "ALL" || value === "newest" || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      if (!("page" in patch)) next.delete("page");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (debouncedSearch.trim() === filters.q.trim()) return;
    applyParams({ q: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActiveFilter =
    filters.q !== "" ||
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.category !== "ALL" ||
    filters.sort !== "newest";

  function clearFilters() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="mb-5 rounded-2xl border border-border bg-card p-3.5 shadow-soft sm:p-4">
      <div className="flex flex-col gap-3">
        {showSearch ? (
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <label htmlFor="task-search" className="sr-only">
              Tìm kiếm công việc
            </label>
            <Input
              id="task-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={placeholder}
              className="h-10 pl-10"
              autoComplete="off"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div>
            <label htmlFor="filter-status" className="sr-only">
              Lọc theo trạng thái
            </label>
            <Select
              id="filter-status"
              value={filters.status}
              onChange={(event) => applyParams({ status: event.target.value })}
              aria-label="Lọc theo trạng thái"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="PENDING">Trạng thái: Chờ xử lý</option>
              <option value="IN_PROGRESS">Trạng thái: Đang làm</option>
              <option value="COMPLETED">Trạng thái: Hoàn thành</option>
            </Select>
          </div>

          <div>
            <label htmlFor="filter-priority" className="sr-only">
              Lọc theo mức ưu tiên
            </label>
            <Select
              id="filter-priority"
              value={filters.priority}
              onChange={(event) => applyParams({ priority: event.target.value })}
              aria-label="Lọc theo mức ưu tiên"
            >
              <option value="ALL">Ưu tiên: Tất cả</option>
              <option value="HIGH">Ưu tiên: Cao</option>
              <option value="MEDIUM">Ưu tiên: Trung bình</option>
              <option value="LOW">Ưu tiên: Thấp</option>
            </Select>
          </div>

          <div>
            <label htmlFor="filter-category" className="sr-only">
              Lọc theo danh mục
            </label>
            <Select
              id="filter-category"
              value={filters.category}
              onChange={(event) => applyParams({ category: event.target.value })}
              aria-label="Lọc theo danh mục"
            >
              <option value="ALL">Danh mục: Tất cả</option>
              <option value="NONE">Danh mục: Không có</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  Danh mục: {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="filter-sort" className="sr-only">
              Sắp xếp
            </label>
            <Select
              id="filter-sort"
              value={filters.sort}
              onChange={(event) => applyParams({ sort: event.target.value })}
              aria-label="Sắp xếp danh sách"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="oldest">Sắp xếp: Cũ nhất</option>
              <option value="due">Sắp xếp: Ngày hết hạn</option>
              <option value="priority">Sắp xếp: Mức ưu tiên</option>
            </Select>
          </div>
        </div>

        {hasActiveFilter ? (
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ListFilter className="size-3.5" aria-hidden />
              Đang áp dụng bộ lọc
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="size-3.5" aria-hidden />
              Xóa bộ lọc
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
