"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ProfileSettingsModal } from "@/components/modules/profile/ProfileSettingsModal";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useLogout } from "@/hooks/auth.hooks";
import { useAuth } from "@/providers/authProvider";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import type { DashboardShellProps } from "./dashboard.types";

export function DashboardShell({
  userRole,
  roleTitle,
  roleBadge,
  roleBadgeClassName,
  navGroups,
  quickAction,
  footerNote,
  footerSecurityText,
  children,
  allowedRoles,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();

  // Desktop sidebar collapse preference
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Profile settings modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cf_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is visible
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cf_sidebar_collapsed", String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        gooeyToast.success("Signed Out", {
          description: `${roleTitle} session closed.`,
        });
        router.push(userRole === "CITIZEN" ? "/" : "/login");
      },
    });
  };

  return (
    <RoleGuard allowedRoles={allowedRoles || [userRole]}>
      <div className="min-h-screen bg-background flex flex-row">
        {/* 1. Desktop Persistent Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
          <DashboardSidebar
            userRole={userRole}
            roleTitle={roleTitle}
            roleBadge={roleBadge}
            roleBadgeClassName={roleBadgeClassName}
            navGroups={navGroups}
            quickAction={quickAction}
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onOpenProfile={() => setIsProfileOpen(true)}
            user={user}
            onLogout={handleLogout}
            logoutPending={logoutPending}
          />
        </div>

        {/* 2. Mobile Responsive Off-Canvas Drawer */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar lg:hidden transition-transform duration-300 ease-in-out shadow-2xl ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile navigation drawer"
        >
          <DashboardSidebar
            userRole={userRole}
            roleTitle={roleTitle}
            roleBadge={roleBadge}
            roleBadgeClassName={roleBadgeClassName}
            navGroups={navGroups}
            quickAction={quickAction}
            isCollapsed={false}
            onOpenProfile={() => {
              setIsMobileOpen(false);
              setIsProfileOpen(true);
            }}
            user={user}
            onLogout={handleLogout}
            logoutPending={logoutPending}
            isMobile={true}
            onCloseMobile={() => setIsMobileOpen(false)}
          />
        </div>

        {/* 3. Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Sticky Header */}
          <DashboardHeader
            userRole={userRole}
            roleTitle={roleTitle}
            roleBadge={roleBadge}
            roleBadgeClassName={roleBadgeClassName}
            user={user}
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onOpenMobile={() => setIsMobileOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
            logoutPending={logoutPending}
            quickAction={quickAction}
          />

          {/* Page Content Body */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Municipal Portal Footer */}
          <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground bg-card/20 shrink-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>{footerNote || "CivicFlow Municipal Governance & Routing Administration"}</span>
              <span className="font-mono text-[11px]">
                {footerSecurityText || "Security Level 4 • Audit Logged Operations"}
              </span>
            </div>
          </footer>
        </div>

        {/* 4. Global Profile & Avatar Settings Modal */}
        <ProfileSettingsModal
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </RoleGuard>
  );
}
