import type { Metadata } from "next";
import { requireUser } from "@/lib/guards";
import { getUserSettings } from "@/lib/data/users";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Cài đặt",
};

export default async function SettingsPage() {
  const session = await requireUser();
  const settings = await getUserSettings(session.userId);

  return (
    <div>
      <PageHeader
        title="Cài đặt"
        description="Quản lý tài khoản, giao diện và thông báo của bạn."
      />
      <SettingsView
        user={{ id: session.userId, name: session.name, email: session.email }}
        settings={settings}
      />
    </div>
  );
}
