import { redirect } from "next/navigation";
import { getSession, type Session } from "@/lib/auth";

export async function requireUser(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
