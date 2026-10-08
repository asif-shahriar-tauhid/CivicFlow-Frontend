import type { JWTPayload, UserRole } from "@/types/auth.types";

/**
 * Safely decodes base64url encoded JWT payload in browser or node environments.
 */
export function decodeJwtPayload(token?: string | null): JWTPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const decodedString = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );

    const parsed = JSON.parse(decodedString) as JWTPayload;
    if (parsed && typeof parsed === "object" && parsed.role) {
      return parsed;
    }
    return parsed || null;
  } catch {
    return null;
  }
}

/**
 * Returns the designated portal entry point URL for a verified role.
 */
export function getRoleDashboardUrl(role?: UserRole | string | null): string {
  const normalized = role?.toUpperCase();
  switch (normalized) {
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/staff";
    case "CITIZEN":
      return "/citizen";
    default:
      return "/citizen";
  }
}

/**
 * Resolves the target destination URL after successful authentication.
 * Prioritizes safe user redirect parameter, falling back to role-based dashboard.
 */
export function resolvePostAuthUrl(options: {
  accessToken?: string | null;
  userRole?: string | null;
  redirectUrl?: string | null;
}): string {
  const { accessToken, userRole, redirectUrl } = options;

  let role = userRole;
  if (!role && accessToken) {
    const decoded = decodeJwtPayload(accessToken);
    if (decoded?.role) {
      role = decoded.role;
    }
  }

  const defaultDashboard = getRoleDashboardUrl(role);

  if (!redirectUrl) {
    return defaultDashboard;
  }

  let cleanRedirect = redirectUrl.trim();
  try {
    cleanRedirect = decodeURIComponent(cleanRedirect);
  } catch {
    // preserve if malformed
  }

  // Handle absolute URLs targeting same-origin or localhost
  if (
    cleanRedirect.startsWith("http://") ||
    cleanRedirect.startsWith("https://")
  ) {
    try {
      const parsed = new URL(cleanRedirect);
      cleanRedirect = `${parsed.pathname}${parsed.search}`;
    } catch {
      return defaultDashboard;
    }
  }

  // Security & validity check: must begin with single '/' and avoid auth pages
  const isSafeRelative =
    cleanRedirect.startsWith("/") &&
    !cleanRedirect.startsWith("//") &&
    !cleanRedirect.startsWith("/login") &&
    !cleanRedirect.startsWith("/register") &&
    !cleanRedirect.startsWith("/account-verify") &&
    !cleanRedirect.startsWith("/forgot-password") &&
    !cleanRedirect.startsWith("/reset-password");

  if (!isSafeRelative) {
    return defaultDashboard;
  }

  // Role compatibility check: ensure target matches user clearance
  const normalizedRole = role?.toUpperCase();
  if (normalizedRole === "CITIZEN") {
    // Citizens cannot access /admin or /staff
    if (
      cleanRedirect.startsWith("/admin") ||
      cleanRedirect.startsWith("/staff")
    ) {
      return "/citizen";
    }
    return cleanRedirect;
  }

  if (normalizedRole === "STAFF") {
    // Staff cannot access /admin
    if (cleanRedirect.startsWith("/admin")) {
      return "/staff";
    }
    return cleanRedirect;
  }

  if (normalizedRole === "ADMIN") {
    return cleanRedirect;
  }

  return cleanRedirect;
}
