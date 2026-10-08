import {
  CalendarCheck,
  CalendarClock,
  CheckCheck,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Tổng quan",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Công việc",
    items: [
      { href: "/tasks", label: "Tất cả công việc", icon: ListTodo },
      { href: "/today", label: "Hôm nay", icon: CalendarCheck },
      { href: "/upcoming", label: "Sắp tới", icon: CalendarClock },
      { href: "/completed", label: "Đã hoàn thành", icon: CheckCheck },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { href: "/categories", label: "Danh mục", icon: FolderKanban },
      { href: "/settings", label: "Cài đặt", icon: Settings },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Công việc",
  "/today": "Hôm nay",
  "/upcoming": "Sắp tới",
  "/completed": "Đã hoàn thành",
  "/categories": "Danh mục",
  "/settings": "Cài đặt",
};

export const BRAND = {
  name: APP_NAME,
  tagline: "Quản lý công việc thông minh",
};
