// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 👇 Allow public routes and NextAuth endpoints to work freely
  if (
    pathname.startsWith("/api/auth") || // next-auth internal routes
    pathname.startsWith("/_next") || // next.js internals
    pathname.startsWith("/static") || // static files
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 👇 Redirect unauthenticated users trying to access dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply only to protected routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
