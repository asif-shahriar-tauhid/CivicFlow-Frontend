"use client";

import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, UserRole } from "@/types/auth.types";
import type { DashboardQuickAction } from "./dashboard.types";

interface DashboardHeaderProps {
  userRole: UserRole;
  roleTitle: string;
  roleBadge: string;
  roleBadgeClassName?: string;
  user: User | null | undefined;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  logoutPending?: boolean;
  quickAction?: DashboardQuickAction;
  topBarActions?: ReactNode;
}

export function DashboardHeader({
  userRole,
  roleTitle,
  roleBadge,
  roleBadgeClassName = "border-primary/20 bg-primary/10 text-primary",
  user,
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
  onOpenProfile,
  onLogout,
  logoutPending = false,
  quickAction,
  topBarActions,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  // Determine current section title based on pathname
  const getContextTitle = () => {
    if (pathname === "/admin") return "Overview & Triage";
    if (pathname?.startsWith("/admin/users"))
      return "Personnel & Citizen Directory";
    if (pathname?.startsWith("/admin/payments"))
      return "Municipal Revenue & Payments";
    if (pathname === "/citizen") return "My Grievances";
    if (pathname?.startsWith("/citizen/requests")) return "Grievance Dossier";
    if (pathname?.startsWith("/citizen/payments")) return "Invoices & Billing";
    if (pathname === "/citizen/report") return "Report New Grievance";
    if (pathname === "/staff") return "Field Work Queue";
    return roleTitle;
  };

  const contextTitle = getContextTitle();
  const isCitizenReportPage = pathname === "/citizen/report";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur-md shrink-0">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu Trigger + Desktop Toggle + Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobile}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted/60"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-muted-foreground hidden sm:inline">
              {roleTitle}
            </span>
            <span className="text-muted-foreground/40 hidden sm:inline">/</span>
            <span className="font-bold text-foreground truncate max-w-[200px] sm:max-w-none">
              {contextTitle}
            </span>
          </div>
        </div>

        {/* Right Section: Actions, Profile Trigger, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Custom page topBarActions if passed */}
          {topBarActions}

          {/* Citizen Quick Report CTA (if not already on report page) */}
          {userRole === "CITIZEN" && !isCitizenReportPage && (
            <Button
              variant="default"
              size="sm"
              render={<Link href="/citizen/report" />}
              nativeButton={false}
              className="hidden sm:inline-flex gap-1.5 shadow-xs text-xs font-semibold"
            >
              <span>+ Report Grievance</span>
            </Button>
          )}

          {/* User Profile Trigger Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="Profile & Avatar Settings"
            className="flex items-center gap-2 rounded-4xl border border-border bg-card/80 hover:bg-muted/70 hover:border-primary/40 px-2.5 py-1 text-xs transition-all cursor-pointer group shadow-2xs"
          >
            <UserAvatar user={user} size="xs" showBadge={true} />
            <span
              className={`font-semibold uppercase text-[10px] tracking-wide px-1.5 py-0.5 rounded-full border ${roleBadgeClassName}`}
            >
              {roleBadge}
            </span>
            <span className="text-muted-foreground text-[11px] hidden md:inline group-hover:text-foreground transition-colors truncate max-w-[130px]">
              {user?.name || user?.email || "Account"}
            </span>
          </button>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onLogout}
            disabled={logoutPending}
            title="Sign Out"
            aria-label="Sign Out"
            className="rounded-4xl text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
