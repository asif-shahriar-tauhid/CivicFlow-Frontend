import { type NextRequest, NextResponse } from "next/server";
import {
  decodeJwtPayload,
  getRoleDashboardUrl,
  resolvePostAuthUrl,
} from "@/lib/authUtils";

const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/account-verify",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const decoded = decodeJwtPayload(token);

  // Validate expiration if exp timestamp is present in JWT payload
  const isExpired = decoded?.exp ? decoded.exp * 1000 < Date.now() : false;
  const validRole = !isExpired && decoded?.role ? decoded.role : null;
  const isAuthenticated = Boolean(validRole);

  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  // 1. Authenticated users attempting to visit auth pages are redirected to their portal or safe redirect target
  if (isAuthPage && isAuthenticated && validRole) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const targetUrl = resolvePostAuthUrl({
      userRole: validRole,
      redirectUrl: redirectParam,
    });
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // 2. Citizen routes protection (/citizen and /citizen/*)
  if (pathname.startsWith("/citizen")) {
    if (!isAuthenticated) {
      const redirectTarget = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", redirectTarget);
      return NextResponse.redirect(loginUrl);
    }

    if (validRole !== "CITIZEN") {
      const properUrl = getRoleDashboardUrl(validRole);
      return NextResponse.redirect(new URL(properUrl, request.url));
    }
  }

  // 3. Staff routes protection (/staff and /staff/*)
  if (pathname.startsWith("/staff")) {
    if (!isAuthenticated) {
      const redirectTarget = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", redirectTarget);
      return NextResponse.redirect(loginUrl);
    }

    if (validRole !== "STAFF") {
      const properUrl = getRoleDashboardUrl(validRole);
      return NextResponse.redirect(new URL(properUrl, request.url));
    }
  }

  // 4. Admin routes protection (/admin and /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const redirectTarget = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", redirectTarget);
      return NextResponse.redirect(loginUrl);
    }

    if (validRole !== "ADMIN") {
      const properUrl = getRoleDashboardUrl(validRole);
      return NextResponse.redirect(new URL(properUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const middleware = proxy;

export default proxy;

export const config = {
  matcher: [
    "/citizen/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/account-verify",
  ],
};
