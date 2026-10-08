"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar, MobileDrawer } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { UserDTO } from "@/types";

export function AppShell({ user, children }: { user: UserDTO; children: ReactNode }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const drawerOpen = openAt === pathname;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Bỏ qua nội dung chính
      </a>

      <AppSidebar user={user} />
      <MobileDrawer open={drawerOpen} onClose={() => setOpenAt(null)} user={user} />

      <div className="lg:pl-64">
        <Topbar user={user} onMenuClick={() => setOpenAt(pathname)} />
        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
