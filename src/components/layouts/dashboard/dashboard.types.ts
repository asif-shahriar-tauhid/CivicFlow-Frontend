import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { UserRole } from "@/types/auth.types";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "default" | "outline" | "secondary" | "emerald";
  isActive?: (pathname: string) => boolean;
  description?: string;
}

export interface DashboardNavGroup {
  title?: string;
  items: DashboardNavItem[];
}

export interface DashboardQuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardShellProps {
  userRole: UserRole;
  roleTitle: string;
  roleBadge: string;
  roleBadgeClassName?: string;
  navGroups: DashboardNavGroup[];
  quickAction?: DashboardQuickAction;
  footerNote?: string;
  footerSecurityText?: string;
  children: ReactNode;
  allowedRoles?: UserRole[];
}
