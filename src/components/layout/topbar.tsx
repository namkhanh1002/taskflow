"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { PAGE_TITLES } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/ui/card";
import type { UserDTO } from "@/types";

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/tasks/")) return "Chi tiết công việc";
  return "TaskFlow";
}

export function Topbar({
  user,
  onMenuClick,
}: {
  user: UserDTO;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu điều hướng"
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>

        <span className="lg:hidden">
          <Logo collapsed />
        </span>

        <div className="hidden min-w-0 lg:block">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {getPageTitle(pathname)}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:inline-flex">
            <Avatar name={user.name} className="size-7 text-[10px] ring-0" />
            <span className="max-w-32 truncate text-xs font-medium text-foreground">
              {user.name}
            </span>
          </span>
          <span className="sm:hidden">
            <Avatar name={user.name} className="size-8 text-[11px]" />
          </span>
        </div>
      </div>
    </header>
  );
}
