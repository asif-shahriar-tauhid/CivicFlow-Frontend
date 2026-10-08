"use client";

import { ClipboardList, HardHat, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Logo from "@/asset/svg/Logo";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useLogout } from "@/hooks/auth.hooks";
import { useAuth } from "@/providers/authProvider";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        gooeyToast.success("Signed Out", {
          description: "Staff session ended.",
        });
        router.push("/login");
      },
    });
  };

  return (
    <RoleGuard allowedRoles={["STAFF"]}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Staff App Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/staff"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <Logo size={36} />
                <div className="flex flex-col">
                  <span className="text-base font-bold leading-none tracking-tight text-foreground">
                    CivicFlow
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                    Field Staff Desk
                  </span>
                </div>
              </Link>

              <div className="h-6 w-px bg-border hidden sm:block" />

              <nav className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/staff"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    pathname === "/staff"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <ClipboardList className="size-3.5" />
                  <span>Work Queue</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Staff Pill Display */}
              <div className="flex items-center gap-2 rounded-4xl border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs">
                <HardHat className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase text-[11px] tracking-wide">
                  Department Staff
                </span>
                <span className="text-muted-foreground text-[11px] hidden sm:inline">
                  • {user?.email || "Field Staff"}
                </span>
              </div>

              {/* Sign out */}
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleLogout}
                disabled={logoutPending}
                title="Sign Out"
                aria-label="Sign Out"
                className="rounded-4xl text-muted-foreground hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Staff Footer */}
        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CivicFlow Municipal Department Field Operations</span>
            <span className="font-mono text-[11px]">
              SLA Tracked • Investigation Notes Logged
            </span>
          </div>
        </footer>
      </div>
    </RoleGuard>
  );
}
