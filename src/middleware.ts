import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("shopsphere_session")?.value;

  let session: { userId?: string; role?: string; exp?: number } | null = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        // Base64Url decode payload
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        // Verify expiry
        if (parsed.exp && parsed.exp * 1000 > Date.now()) {
          session = parsed;
        }
      }
    } catch {
      session = null;
    }
  }

  // 1. Protect Admin routes (/admin, /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "ADMIN") {
      // Non-admin user attempting to access admin portal
      return NextResponse.redirect(new URL("/?error=unauthorized_admin", request.url));
    }
  }

  // 2. Protect Customer Account routes (/account, /account/*)
  if (pathname.startsWith("/account")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If logged in, redirect away from /login and /register
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
