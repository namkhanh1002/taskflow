import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AppError, ERROR_MESSAGES } from "@/lib/errors";

export const SESSION_COOKIE = "session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface Session {
  userId: string;
  email: string;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new AppError(
      "Thiếu biến môi trường AUTH_SECRET. Hãy tạo file .env theo mẫu .env.example.",
    );
  }
  return new TextEncoder().encode(secret);
}

function getSessionTtl(): number {
  const raw = Number(process.env.AUTH_SESSION_TTL);
  if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
  return DEFAULT_TTL_SECONDS;
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${getSessionTtl()}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionTtl(),
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    const userId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    if (typeof userId !== "string" || typeof email !== "string" || typeof name !== "string") {
      return null;
    }
    return { userId, email, name };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new AppError(ERROR_MESSAGES.sessionExpired);
  }
  return session;
}
