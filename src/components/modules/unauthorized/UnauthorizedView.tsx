"use client";

import { Home, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { getRoleDashboardUrl } from "@/lib/authUtils";
import { useAuth } from "@/providers/authProvider";

export default function UnauthorizedView() {
  const router = useRouter();
  const { user, role, isAuthenticated, logout, logoutPending } = useAuth();

  const portalUrl = getRoleDashboardUrl(role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-sm text-center">
        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <Logo size={42} />
        </div>

        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-destructive">
          Security Alert • 403
        </span>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Access Restricted
        </h1>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          You do not have permission to access this page.
        </p>

        {isAuthenticated && user && (
          <div className="mt-5 rounded-xl border border-border bg-muted/30 p-3 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Session:</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Assigned Role:</span>
              <span className="font-mono font-bold text-primary uppercase">
                {role || "GUEST"}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          {isAuthenticated ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(portalUrl)}
              className="w-full justify-center gap-2"
            >
              <span>Return to My Portal</span>
              <span className="text-xs opacity-75">({portalUrl})</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              render={<Link href="/login" />}
              nativeButton={false}
              className="w-full justify-center gap-2"
            >
              <span>Sign In to CivicFlow</span>
            </Button>
          )}

          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              disabled={logoutPending}
              className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              <span>Sign in with different credentials</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="w-full justify-center gap-2 text-muted-foreground"
          >
            <Home className="size-3.5" />
            <span>Return to Public Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
