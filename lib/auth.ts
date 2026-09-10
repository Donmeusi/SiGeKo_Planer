import crypto from "crypto";
import { cookies } from "next/headers";
import { db as prisma } from "@/lib/db";

const SESSION_COOKIE_NAME = "sigeko_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "sigeko-secure-secret-admin-session-salt-2026";
const SESSION_DURATION_HOURS = 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  username: string;
  name: string | null;
  role: string;
  exp: number;
}

/**
 * Hashes a plaintext password using crypto.scryptSync with a cryptographically secure random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Verifies a plaintext password against the stored salt:hash string.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Creates a signed session token string.
 */
export function signSessionToken(payload: Omit<SessionPayload, "exp">): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_HOURS * 3600,
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }
    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current admin/user session from Next.js cookies.
 */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Sets the session cookie on the response/cookie jar.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_HOURS * 3600,
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Ensures at least one admin account exists. If no users exist, creates the default admin.
 */
export async function ensureDefaultAdmin() {
  const count = await prisma.user.count();
  if (count === 0) {
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
    await prisma.user.create({
      data: {
        username: "admin",
        name: "Hauptadministrator",
        email: "admin@sigeko-planer.local",
        passwordHash: hashPassword(defaultPassword),
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("Created initial default admin account: admin / admin123");
  }
}
