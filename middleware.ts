import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "sigeko_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "sigeko-secure-secret-admin-session-salt-2026";

/** Import HMAC key from the session secret — Web Crypto API (Edge compatible) */
async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

/** Base64url decode to Uint8Array */
function base64urlToBytes(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Base64url decode to string */
function base64urlToStr(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

/** Edge-compatible token verification using Web Crypto API (SubtleCrypto) */
async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;

    const dataPart = token.slice(0, lastDot);
    const sigPart = token.slice(lastDot + 1);

    const key = await getHmacKey();
    const enc = new TextEncoder();

    const sigBytes = base64urlToBytes(sigPart);
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(dataPart));
    if (!isValid) return false;

    // Decode payload (dataPart is base64url JSON)
    const payloadStr = base64urlToStr(dataPart);
    const payload = JSON.parse(payloadStr) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

// Routes that are always public (no auth required)
const PUBLIC_PATHS = [
  "/login",
  "/api/admin/auth/login",
  "/api/admin/auth/logout",
  "/api/admin/auth/session",
];

const PUBLIC_PREFIXES = [
  "/_next/",
  "/favicon",
  "/robots",
  "/sitemap",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static files and public paths
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = sessionCookie?.value
    ? await verifyTokenEdge(sessionCookie.value)
    : false;

  if (!isAuthenticated) {
    // API routes: return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Nicht angemeldet. Bitte einloggen." },
        { status: 401 }
      );
    }
    // Page routes: redirect to /login with original destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
