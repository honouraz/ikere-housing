// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow these routes (public + internal)
  const publicPaths = ["/", "/login", "/signup", "/api/auth", "/_next", "/static"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Check if user has a valid token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie:
      process.env.NODE_ENV === "production" && process.env.VERCEL_URL
        ? true
        : false,
  });

  // ❌ If there’s no valid token, redirect to /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Token is valid, continue normally
  return NextResponse.next();
}

// ✅ Apply middleware only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
