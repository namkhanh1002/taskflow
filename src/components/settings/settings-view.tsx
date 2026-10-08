"use client";

import { useActionState, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { CheckCircle2, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/card";
import { logoutAction } from "@/lib/actions/auth";
import { updateProfileAction, updateSettingsAction } from "@/lib/actions/settings";
import type { UserDTO, UserSettingsDTO } from "@/types";

function ThemeSegment() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const options = [
    { value: "light", label: "Sáng", icon: Sun },
    { value: "dark", label: "Tối", icon: Moon },
    { value: "system", label: "Hệ thống", icon: Monitor },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Chọn giao diện"
      className="inline-flex rounded-xl border border-border bg-muted p-1"
    >
      {options.map((option) => {
        const Icon = option.icon;
            const active = hydrated && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const NOTIFICATION_ITEMS: {
  key: keyof UserSettingsDTO;
  label: string;
  description: string;
}[] = [
  {
    key: "taskReminders",
    label: "Nhắc nhở công việc",
    description: "Nhận thông báo khi công việc sắp đến hạn.",
  },
  {
    key: "overdueAlerts",
    label: "Cảnh báo quá hạn",
    description: "Nhận thông báo khi công việc đã quá thời hạn.",
  },
  {
    key: "weeklySummary",
    label: "Tổng kết tuần",
    description: "Nhận thống kê tiến độ vào cuối mỗi tuần.",
  },
];

export function SettingsView({
  user,
  settings,
}: {
  user: UserDTO;
  settings: UserSettingsDTO;
}) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    { error: null as string | null, success: false },
  );
  const [notifications, setNotifications] = useState<UserSettingsDTO>(settings);

  async function toggleNotification(key: keyof UserSettingsDTO, value: boolean) {
    const previous = notifications;
    const next = { ...notifications, [key]: value };
    setNotifications(next);

    const result = await updateSettingsAction(next);
    if (result.ok) {
      toast.success("Đã lưu cài đặt thông báo");
    } else {
      setNotifications(previous);
      toast.error(result.error);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar name={user.name} className="size-12 text-sm" />
            <div className="min-w-0">
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Cập nhật họ tên hiển thị của bạn.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            {profileState.error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
              >
                {profileState.error}
              </div>
            ) : null}
            {profileState.success && !profileState.error ? (
              <div
                role="status"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                Đã lưu thay đổi hồ sơ
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Họ và tên" htmlFor="profile-name" required>
                <Input
                  id="profile-name"
                  name="name"
                  defaultValue={user.name}
                  required
                  minLength={2}
                  maxLength={60}
                />
              </FormField>
              <FormField
                label="Email"
                htmlFor="profile-email"
                hint="Email dùng để đăng nhập, không thể thay đổi."
              >
                <Input id="profile-email" value={user.email} readOnly disabled />
              </FormField>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={profilePending}>
                <UserRound className="size-4" aria-hidden />
                Lưu hồ sơ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
          <CardDescription>Chọn chế độ hiển thị phù hợp với bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSegment />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
          <CardDescription>Điều khiển các loại thông báo bạn muốn nhận.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {NOTIFICATION_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => toggleNotification(item.key, checked)}
                label={item.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phiên đăng nhập</CardTitle>
          <CardDescription>Đăng xuất khỏi thiết bị này để bảo vệ tài khoản.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="size-4" aria-hidden />
              Đăng xuất
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
