"use client";

import {
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import Logo from "@/asset/svg/Logo";
import { RoleGuard } from "@/components/common/RoleGuard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ProfileSettingsModal } from "@/components/modules/profile/ProfileSettingsModal";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useLogout } from "@/hooks/auth.hooks";
import { useAuth } from "@/providers/authProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const { mutate: logout, isPending: logoutPending } = useLogout();


  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        gooeyToast.success("Signed Out", {
          description: "Admin session closed.",
        });
        router.push("/login");
      },
    });
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Admin Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <Logo size={36} />
                <div className="flex flex-col">
                  <span className="text-base font-bold leading-none tracking-tight text-foreground">
                    CivicFlow
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                    Admin Desk
                  </span>
                </div>
              </Link>

              <div className="h-6 w-px bg-border hidden sm:block" />

              <nav className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    pathname === "/admin"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/admin/users"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    pathname?.startsWith("/admin/users")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Users className="size-3.5" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/payments"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    pathname?.startsWith("/admin/payments")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <CircleDollarSign className="size-3.5" />
                  <span>Municipal Revenue</span>
                </Link>
              </nav>
            </div>


            <div className="flex items-center gap-3">
              {/* Role Clearance & Profile Trigger */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                title="Profile & Avatar Settings"
                className="flex items-center gap-2 rounded-4xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 px-2.5 py-1 text-xs transition-all cursor-pointer group"
              >
                <UserAvatar user={user} size="xs" />
                <span className="font-semibold text-primary uppercase text-[11px] tracking-wide">
                  Super Admin
                </span>
                <span className="text-muted-foreground text-[11px] hidden sm:inline group-hover:text-foreground transition-colors truncate max-w-[140px]">
                  • {user?.email || "Administrator"}
                </span>
              </button>

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

        {/* Admin Content Area */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Municipal Admin Footer */}
        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CivicFlow Municipal Governance & Routing Administration</span>
            <span className="font-mono text-[11px]">
              Security Level 4 • Audit Logged Operations
            </span>
          </div>
        </footer>

        {/* Profile & Avatar Settings Modal */}
        <ProfileSettingsModal
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </RoleGuard>
  );
}

