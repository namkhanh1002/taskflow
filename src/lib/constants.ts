import {
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  Code2,
  Folder,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Inbox,
  LifeBuoy,
  Music,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Star,
  Dumbbell,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import type { Priority, TaskStatus } from "@/types";

export const APP_NAME = "TaskFlow";

export interface PriorityMeta {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  dotClass: string;
}

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  LOW: {
    label: "Thấp",
    shortLabel: "Thấp",
    description: "Có thể làm khi có thời gian",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/25",
    dotClass: "bg-emerald-500",
  },
  MEDIUM: {
    label: "Trung bình",
    shortLabel: "TB",
    description: "Nên hoàn thành trong thời gian tới",
    badgeClass:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/25",
    dotClass: "bg-amber-500",
  },
  HIGH: {
    label: "Cao",
    shortLabel: "Cao",
    description: "Cần xử lý sớm, độ ưu tiên cao nhất",
    badgeClass:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/25",
    dotClass: "bg-rose-500",
  },
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export interface StatusMeta {
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
}

export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  PENDING: {
    label: "Chờ xử lý",
    description: "Chưa bắt đầu thực hiện",
    badgeClass:
      "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/25",
    dotClass: "bg-slate-400",
  },
  IN_PROGRESS: {
    label: "Đang làm",
    description: "Đang được thực hiện",
    badgeClass:
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/25",
    dotClass: "bg-sky-500",
  },
  COMPLETED: {
    label: "Hoàn thành",
    description: "Đã hoàn thành",
    badgeClass:
      "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/25",
    dotClass: "bg-green-500",
  },
};

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "IN_PROGRESS", label: "Đang làm" },
  { value: "COMPLETED", label: "Hoàn thành" },
];

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Thấp" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HIGH", label: "Cao" },
];

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  folder: Folder,
  user: Heart,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "shopping-cart": ShoppingCart,
  home: Home,
  star: Star,
  code: Code2,
  plane: Plane,
  gift: Gift,
  music: Music,
  book: BookOpen,
  dumbbell: Dumbbell,
  wallet: CircleDollarSign,
  shopping: ShoppingBag,
  support: LifeBuoy,
  calendar: CalendarCheck,
  inbox: Inbox,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const CATEGORY_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#14b8a6",
  "#ec4899",
  "#64748b",
  "#84cc16",
];

export interface DefaultCategory {
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "Cá nhân", color: "#8b5cf6", icon: "user" },
  { name: "Công việc", color: "#0ea5e9", icon: "briefcase" },
  { name: "Học tập", color: "#f59e0b", icon: "graduation-cap" },
  { name: "Mua sắm", color: "#10b981", icon: "shopping-cart" },
  { name: "Khác", color: "#64748b", icon: "folder" },
];

export const TASKS_PAGE_SIZE = 10;
