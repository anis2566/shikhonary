import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Tenant App Middleware
 *
 * Protects all routes by checking for a better-auth session token cookie.
 * This is a fast "gate" check — full session validation happens deeper
 * in tRPC middleware (isTenantMember) and server components.
 *
 * Edge middleware cannot run Prisma/better-auth (requires Node.js runtime),
 * so we only check cookie presence here.
 */

const PUBLIC_ROUTES = ["/auth/sign-in", "/auth/sign-up"];
const API_PREFIXES = ["/api/auth", "/api/trpc"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Always allow API routes through (auth API handles its own validation, tRPC has its own middleware)
  if (API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. Check for session token
  const sessionCookie = getSessionCookie(req);

  // 3. If user is authenticated and trying to visit auth pages, redirect to dashboard
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) &&
    sessionCookie
  ) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  // 4. Allow public pages for unauthenticated users
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 5. No session token → redirect to sign-in with callback URL
  if (!sessionCookie) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/auth/sign-in";
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 6. Token exists → allow through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
