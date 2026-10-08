"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { ArrowRight, KeyRound, LogIn } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/label";
import type { FormState } from "@/types";

const DEMO_EMAIL = "demo@taskflow.app";
const DEMO_PASSWORD = "Demo1234!";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, {
    error: null,
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fillDemoAccount() {
    if (emailRef.current) emailRef.current.value = DEMO_EMAIL;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          Chào mừng trở lại – tiếp tục công việc của bạn.
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

      <FormField label="Email" htmlFor="login-email" required>
        <Input
          ref={emailRef}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ban@example.com"
          required
        />
      </FormField>

      <FormField label="Mật khẩu" htmlFor="login-password" required>
        <Input
          ref={passwordRef}
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ít nhất 8 ký tự"
          required
        />
      </FormField>

      <Button type="submit" className="w-full" loading={pending} size="lg">
        <LogIn className="size-4" aria-hidden />
        Đăng nhập
      </Button>

      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-3.5 py-3">
        <KeyRound className="size-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
          Trải nghiệm ngay với tài khoản demo{" "}
          <span className="font-medium text-foreground">{DEMO_EMAIL}</span>
        </div>
        <Button variant="outline" size="sm" onClick={fillDemoAccount} className="shrink-0">
          Điền
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Đăng ký
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </p>
    </form>
  );
}
