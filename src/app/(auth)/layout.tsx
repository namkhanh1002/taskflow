import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { getSession } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return <AuthShell>{children}</AuthShell>;
}
