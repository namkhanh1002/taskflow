"use server";

import { requireUser } from "@/lib/guards";
import { getDb } from "@/lib/prisma";
import { ERROR_MESSAGES, toFriendlyError } from "@/lib/errors";
import { revalidateApp } from "@/lib/revalidate";
import { formatZodError, profileSchema, settingsSchema } from "@/lib/validators";
import type { ActionResult, UserSettingsDTO } from "@/types";

export async function updateProfileAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  try {
    const session = await requireUser();
    const parsed = profileSchema.safeParse({ name: formData.get("name") });
    if (!parsed.success) {
      return { error: formatZodError(parsed.error), success: false };
    }

    const db = getDb();
    await db.user.update({
      where: { id: session.userId },
      data: { name: parsed.data.name },
    });

    revalidateApp();
    return { error: null, success: true };
  } catch (error) {
    return {
      error: toFriendlyError(error, ERROR_MESSAGES.settingsUpdate).message,
      success: false,
    };
  }
}

export async function updateSettingsAction(
  input: UserSettingsDTO,
): Promise<ActionResult> {
  try {
    const session = await requireUser();
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: formatZodError(parsed.error) };
    }

    const db = getDb();
    await db.userSettings.upsert({
      where: { userId: session.userId },
      update: parsed.data,
      create: { userId: session.userId, ...parsed.data },
    });

    revalidateApp();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toFriendlyError(error, ERROR_MESSAGES.settingsUpdate).message };
  }
}
