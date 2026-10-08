"use client";

import { ArrowRight, LogOut, ShieldAlert, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getRoleDashboardUrl } from "@/lib/authUtils";
import { useAuth } from "@/providers/authProvider";
import type { UserRole } from "@/types/auth.types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard provides client-side defense-in-depth route guarding:
 * 1. Shows a polished municipal verification spinner during initial session hydration.
 * 2. Redirects unauthenticated users to /login?redirect=<path>.
 * 3. Restricts access to authorized roles and provides instant rerouting or access-denied UX.
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isAuthenticated, isLoading, logout, logoutPending } =
    useAuth();
  const [redirectScheduled, setRedirectScheduled] = useState(false);

  const hasRequiredRole = Boolean(role && allowedRoles.includes(role));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      setRedirectScheduled(true);
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const target = encodeURIComponent(`${pathname}${search}`);
      router.replace(`/login?redirect=${target}`);
      return;
    }

    if (!hasRequiredRole) {
      setRedirectScheduled(true);
      if (role) {
        // Automatically reroute the user to their designated portal
        const targetPortal = getRoleDashboardUrl(role);
        const timer = setTimeout(() => {
          router.replace(targetPortal);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    hasRequiredRole,
    role,
    pathname,
    router,
  ]);

  // Loading state: Verifying session credentials and role clearance
  if (isLoading) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="relative flex items-center justify-center">
            <Logo size={48} />
            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-3" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Spinner className="size-4 text-primary" />
            <span>Verifying Clearance...</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Authenticating municipal session credentials and role access
            permissions.
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated redirecting state
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <Spinner className="size-5 text-primary" />
          <p className="text-sm font-medium text-foreground">
            Session required. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // Mismatched Role state: Access restricted
  if (!hasRequiredRole) {
    const designatedPortal = getRoleDashboardUrl(role);
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" />
          </div>

          <h2 className="text-lg font-bold text-foreground">
            Clearance Restricted
          </h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Your account is assigned the{" "}
            <span className="font-semibold text-foreground uppercase">
              {role || "UNKNOWN"}
            </span>{" "}
            role, which is not permitted to access this portal section.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              variant="default"
              size="sm"
              onClick={() => router.replace(designatedPortal)}
              className="w-full justify-center gap-2"
            >
              <span>Go to Your Designated Portal</span>
              <ArrowRight className="size-3.5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              disabled={logoutPending}
              className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              <span>Sign in with different account</span>
            </Button>
          </div>

          {redirectScheduled && (
            <p className="mt-4 text-[11px] text-muted-foreground animate-pulse">
              Automatically redirecting to your portal...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Authorized: render guarded subtree
  return <>{children}</>;
}
