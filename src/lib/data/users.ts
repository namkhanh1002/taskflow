import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, safeQuery } from "@/lib/errors";
import type { UserDTO, UserSettingsDTO } from "@/types";

export async function findUserByEmail(email: string) {
  const db = getDb();
  return safeQuery(
    () =>
      db.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { settings: true },
      }),
    ERROR_MESSAGES.generic,
  );
}

export async function getUserById(userId: string): Promise<UserDTO | null> {
  const db = getDb();
  const user = await safeQuery(
    () => db.user.findUnique({ where: { id: userId } }),
    ERROR_MESSAGES.generic,
  );
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUserSettings(userId: string): Promise<UserSettingsDTO> {
  const db = getDb();
  const settings = await safeQuery(
    () => db.userSettings.findUnique({ where: { userId } }),
    ERROR_MESSAGES.settingsLoad,
  );

  if (!settings) {
    return { taskReminders: true, overdueAlerts: true, weeklySummary: false };
  }
  return {
    taskReminders: settings.taskReminders,
    overdueAlerts: settings.overdueAlerts,
    weeklySummary: settings.weeklySummary,
  };
}
