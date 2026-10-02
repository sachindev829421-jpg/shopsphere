import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { SafeUser } from "@/types";

const AUTH_COOKIE_NAME = "shopsphere_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "shopsphere-fallback-secret-key-32chars";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: SessionPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSessionUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      ...user,
      role: user.role as "CUSTOMER" | "ADMIN",
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error getting session user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<SafeUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<SafeUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
