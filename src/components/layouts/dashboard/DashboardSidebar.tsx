"use client";

import {
  Globe,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/asset/svg/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, UserRole } from "@/types/auth.types";
import type {
  DashboardNavGroup,
  DashboardNavItem,
  DashboardQuickAction,
} from "./dashboard.types";

interface DashboardSidebarProps {
  userRole: UserRole;
  roleTitle: string;
  roleBadge: string;
  roleBadgeClassName?: string;
  navGroups: DashboardNavGroup[];
  quickAction?: DashboardQuickAction;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  onOpenProfile: () => void;
  user: User | null | undefined;
  onLogout: () => void;
  logoutPending?: boolean;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({
  userRole,
  roleTitle,
  roleBadge,
  roleBadgeClassName = "border-primary/20 bg-primary/10 text-primary",
  navGroups,
  quickAction,
  isCollapsed,
  onToggleCollapse,
  onOpenProfile,
  user,
  onLogout,
  logoutPending = false,
  isMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const isItemActive = (item: DashboardNavItem) => {
    if (item.isActive) {
      return item.isActive(pathname);
    }
    return pathname === item.href;
  };

  // On mobile drawer, never show collapsed mode
  const effectiveCollapsed = isMobile ? false : isCollapsed;

  return (
    <aside
      className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-[width] duration-300 ease-in-out select-none ${
        effectiveCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* 1. Header / Brand Bar */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 shrink-0">
        <Link
          href={
            userRole === "ADMIN"
              ? "/admin"
              : userRole === "STAFF"
                ? "/staff"
                : "/citizen"
          }
          onClick={handleLinkClick}
          className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none"
          title={`CivicFlow ${roleTitle}`}
        >
          <Logo
            size={effectiveCollapsed ? 32 : 36}
            className="shrink-0 transition-transform group-hover:scale-105"
          />
          {!effectiveCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold leading-none tracking-tight text-sidebar-foreground">
                  CivicFlow
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
                  {roleTitle}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium border ${roleBadgeClassName}`}
                >
                  {roleBadge}
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        {isMobile && onCloseMobile && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCloseMobile}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </Button>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleCollapse}
            className={`hidden lg:inline-flex text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors ${
              effectiveCollapsed ? "mx-auto mt-0" : ""
            }`}
            title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={
              effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {effectiveCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        )}
      </div>

      {/* 2. Optional Role Quick Action Button (e.g. + Report Grievance for Citizen) */}
      {quickAction && (
        <div className="p-3 border-b border-sidebar-border/60 shrink-0">
          <Link
            href={quickAction.href}
            onClick={handleLinkClick}
            className={`flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all ${
              effectiveCollapsed
                ? "h-10 w-10 mx-auto p-0"
                : "w-full py-2.5 px-3"
            }`}
            title={quickAction.label}
          >
            <quickAction.icon className="size-4 shrink-0" />
            {!effectiveCollapsed && (
              <span className="truncate">{quickAction.label}</span>
            )}
          </Link>
        </div>
      )}

      {/* 3. Navigation Links (Scrollable area) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-5 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={group.title || groupIdx} className="space-y-1">
            {group.title && !effectiveCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  title={effectiveCollapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl text-xs font-medium transition-all ${
                    effectiveCollapsed
                      ? "justify-center size-10 mx-auto"
                      : "px-3 py-2.5 w-full"
                  } ${
                    active
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/70"
                  }`}
                >
                  {/* Active Indicator Bar (when expanded) */}
                  {active && !effectiveCollapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                  )}

                  <Icon
                    className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />

                  {!effectiveCollapsed && (
                    <div className="flex flex-1 items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-mono tracking-tight"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Active Dot when collapsed */}
                  {active && effectiveCollapsed && (
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Secondary Portal Utilities */}
        <div className="pt-2 border-t border-sidebar-border/60 space-y-1">
          {!effectiveCollapsed && (
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              External Portal
            </div>
          )}
          <Link
            href="/"
            onClick={handleLinkClick}
            title={effectiveCollapsed ? "Public Portal Home" : undefined}
            className={`group flex items-center gap-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/70 transition-all ${
              effectiveCollapsed
                ? "justify-center size-10 mx-auto"
                : "px-3 py-2.5 w-full"
            }`}
          >
            <Globe className="size-4 shrink-0 transition-transform group-hover:scale-110" />
            {!effectiveCollapsed && (
              <span className="truncate">Public Portal Home</span>
            )}
          </Link>
        </div>
      </div>

      {/* 4. Footer & User Account Strip */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/20 shrink-0 space-y-2">
        {/* User Card */}
        <div
          className={`flex items-center gap-2.5 rounded-xl border border-sidebar-border/80 bg-background/60 p-2 ${
            effectiveCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <button
            type="button"
            onClick={onOpenProfile}
            title="Open Profile Settings"
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <UserAvatar user={user} size="sm" showBadge={true} />
            {!effectiveCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate max-w-[110px]">
                  {user?.name || "Civic User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">
                  {user?.email || "Account"}
                </span>
              </div>
            )}
          </button>

          {!effectiveCollapsed && (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onOpenProfile}
                title="Profile & Avatar Settings"
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onLogout}
                disabled={logoutPending}
                title="Sign Out"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Collapsed quick logout */}
        {effectiveCollapsed && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onLogout}
              disabled={logoutPending}
              title="Sign Out"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        )}

        {/* Operational Pulse */}
        {!effectiveCollapsed && (
          <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SLA Engine Online
            </span>
            <span className="font-mono text-[9px] opacity-75">v1.4</span>
          </div>
        )}
      </div>
    </aside>
  );
}
