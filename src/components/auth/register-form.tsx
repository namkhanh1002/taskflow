"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import type { FormState } from "@/types";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tạo tài khoản</h1>
        <p className="text-sm text-muted-foreground">
          Miễn phí – bắt đầu quản lý công việc trong vài giây.
        </p>
      </div>

      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
        >
          {state.error}
        </div>
      ) : null}

      <FormField label="Họ và tên" htmlFor="register-name" required>
        <Input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          required
          minLength={2}
          maxLength={60}
        />
      </FormField>

      <FormField label="Email" htmlFor="register-email" required>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ban@example.com"
          required
        />
      </FormField>

      <FormField
        label="Mật khẩu"
        htmlFor="register-password"
        required
        hint="Tối thiểu 8 ký tự."
      >
        <Input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Ít nhất 8 ký tự"
          required
          minLength={8}
        />
      </FormField>

      <FormField label="Xác nhận mật khẩu" htmlFor="register-confirm" required>
        <Input
          id="register-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          required
        />
      </FormField>

      <Button type="submit" className="w-full" loading={pending} size="lg">
        <UserPlus className="size-4" aria-hidden />
        Đăng ký
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Đăng nhập
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </p>
    </form>
  );
}
