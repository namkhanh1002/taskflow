"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { findUserByEmail } from "@/lib/data/users";
import { ERROR_MESSAGES, isUniqueViolation, toFriendlyError } from "@/lib/errors";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/password";
import { formatZodError, loginSchema, registerSchema } from "@/lib/validators";
import { getDb } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import type { FormState } from "@/types";

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  try {
    const user = await findUserByEmail(parsed.data.email);
    const isValid = await verifyPassword(
      parsed.data.password,
      user?.password ?? DUMMY_HASH,
    );

    if (!user || !isValid) {
      return { error: "Email hoặc mật khẩu không chính xác." };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    return { error: toFriendlyError(error, ERROR_MESSAGES.generic).message };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  try {
    const db = getDb();
    const email = parsed.data.email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email đã được sử dụng. Vui lòng dùng email khác." };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        password: passwordHash,
        settings: { create: {} },
        categories: {
          create: DEFAULT_CATEGORIES.map((category) => ({
            name: category.name,
            color: category.color,
            icon: category.icon,
          })),
        },
      },
    });

    await createSession({ userId: user.id, email: user.email, name: user.name });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "Email đã được sử dụng. Vui lòng dùng email khác." };
    }
    return { error: toFriendlyError(error, ERROR_MESSAGES.generic).message };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function validateSessionAction(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
