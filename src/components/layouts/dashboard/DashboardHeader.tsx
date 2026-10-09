"use client";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  ClipboardList,
  ClockAlert,
  LoaderCircle,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  ShieldAlert,
  Star,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/notification.hooks";
import type { User, UserRole } from "@/types/auth.types";
import type { Notification } from "@/types/notification.types";
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
  topBarActions,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  // Queries scoped to user UUID to prevent cross-account leak
  const { data: notificationsResponse, isLoading: notificationsLoading } =
    useGetNotifications({ limit: 30 }, Boolean(user), user?.id);
  const { data: unreadCountResponse } = useGetUnreadNotificationCount(
    Boolean(user),
    user?.id,
  );

  const { mutate: markNotificationRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();

  const notifications = notificationsResponse?.data || [];
  const unreadNotifications = notifications.filter(
    (notification) => !notification.readAt,
  );
  const effectiveUnreadCount = unreadNotifications.length;

  const displayedNotifications =
    activeTab === "unread" ? unreadNotifications : notifications;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNotificationsOpen) {
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNotificationsOpen]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markNotificationRead(notification.id);
    }
    setIsNotificationsOpen(false);

    const requestId = notification.metadata?.requestId as string | undefined;
    const paymentId = notification.metadata?.paymentId as string | undefined;

    if (userRole === "CITIZEN") {
      if (requestId) {
        router.push(`/citizen/requests/${requestId}`);
        return;
      }
      if (
        paymentId ||
        notification.eventKey.includes("PAYMENT") ||
        notification.metadata?.trxId
      ) {
        router.push("/citizen/payments");
        return;
      }
      router.push("/citizen");
    } else if (userRole === "STAFF") {
      if (requestId) {
        router.push(`/staff/requests/${requestId}`);
        return;
      }
      router.push("/staff");
    } else if (userRole === "ADMIN") {
      if (
        notification.eventKey.includes("SLA") ||
        notification.title.toLowerCase().includes("sla")
      ) {
        router.push("/admin/sla");
        return;
      }
      if (
        notification.eventKey.includes("FEEDBACK") ||
        notification.metadata?.rating
      ) {
        router.push("/admin/feedback-reports");
        return;
      }
      if (
        notification.eventKey.includes("PAYMENT") ||
        notification.metadata?.trxId
      ) {
        router.push("/admin/payments");
        return;
      }
      if (requestId) {
        router.push("/admin");
        return;
      }
      router.push("/admin");
    }
  };

  const handleDismissNotification = (
    e: React.MouseEvent,
    notificationId: string,
  ) => {
    e.stopPropagation();
    markNotificationRead(notificationId);
  };

  const handleMarkAllRead = () => {
    const unreadIds = unreadNotifications.map((n) => n.id);
    markAllRead(unreadIds);
  };

  const getContextTitle = () => {
    if (pathname === "/admin") return "Overview & Triage";
    if (pathname?.startsWith("/admin/users"))
      return "Personnel & Citizen Directory";
    if (pathname?.startsWith("/admin/departments"))
      return "Municipal Departments";
    if (pathname?.startsWith("/admin/routing-rules"))
      return "Automated Routing Rules";
    if (pathname?.startsWith("/admin/sla"))
      return "SLA Breach & Escalation Desk";
    if (pathname?.startsWith("/admin/payments"))
      return "Municipal Revenue & Ledger";
    if (pathname?.startsWith("/admin/audit-logs")) return "Audit Trail Ledger";
    if (pathname?.startsWith("/admin/feedback-reports"))
      return "Satisfaction & Citizen Feedback";
    if (pathname === "/citizen") return "My Grievances";
    if (
      pathname?.startsWith("/citizen/requests") ||
      pathname?.startsWith("/staff/requests") ||
      pathname?.startsWith("/admin/requests")
    )
      return "Grievance Dossier";
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
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobile}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>

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

        <div className="flex items-center gap-2.5 sm:gap-3">
          {topBarActions}

          <div className="relative" ref={notificationPanelRef}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsNotificationsOpen((open) => !open)}
              aria-label={`Notifications${effectiveUnreadCount ? `, ${effectiveUnreadCount} unread` : ""}`}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="dialog"
              className="relative rounded-4xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Bell className="size-4" />
              {effectiveUnreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-600 px-1 font-mono text-[9px] font-bold tabular-nums leading-none text-white ring-2 ring-background animate-in fade-in zoom-in-75">
                  {effectiveUnreadCount > 99 ? "99+" : effectiveUnreadCount}
                </span>
              )}
            </Button>

            {isNotificationsOpen && (
              <div
                role="dialog"
                aria-label="Notifications Panel"
                className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-card shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      Notifications
                    </h2>
                    {effectiveUnreadCount > 0 ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-destructive tabular-nums">
                        {effectiveUnreadCount} unread
                      </span>
                    ) : (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
                        All caught up
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleMarkAllRead}
                    disabled={effectiveUnreadCount === 0 || isMarkingAllRead}
                    className="gap-1 text-[11px] text-primary hover:text-primary hover:bg-primary/10 rounded-full px-2"
                  >
                    {isMarkingAllRead ? (
                       <LoaderCircle className="size-3 animate-spin" />
                    ) : (
                      <CheckCheck className="size-3" />
                    )}
                    Mark all read
                  </Button>
                </div>

                <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3 py-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                      activeTab === "all"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("unread")}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                      activeTab === "unread"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Unread ({effectiveUnreadCount})
                  </button>
                </div>

                <div className="max-h-[min(24rem,60vh)] overflow-y-auto divide-y divide-border/60">
                  {notificationsLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-xs text-muted-foreground">
                      <LoaderCircle className="size-5 animate-spin text-primary" />
                      <span>Loading notifications...</span>
                    </div>
                  ) : displayedNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-xs text-muted-foreground">
                      <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
                        <Bell className="size-5 text-muted-foreground/60" />
                      </div>
                      <span className="font-medium text-foreground">
                        {activeTab === "unread"
                          ? "No unread notifications"
                          : "No notifications yet"}
                      </span>
                      <span className="mt-1 text-[11px] text-muted-foreground/80 max-w-[220px]">
                        {activeTab === "unread"
                          ? "You are up to date on all civic grievances and actions."
                          : "Notifications for your role will appear here automatically."}
                      </span>
                    </div>
                  ) : (
                    displayedNotifications.map((notification) => {
                      const isUnread = !notification.readAt;
                      const Icon = getNotificationIcon(notification.eventKey);

                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleNotificationClick(notification);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          className={`group relative flex w-full cursor-pointer items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                            isUnread
                              ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary"
                              : "border-l-2 border-l-transparent opacity-85 hover:opacity-100"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${getNotificationIconColor(
                              notification.eventKey,
                            )}`}
                          >
                            <Icon className="size-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1.5">
                              <span
                                className={`text-xs font-semibold leading-tight ${
                                  isUnread
                                    ? "text-foreground font-bold"
                                    : "text-foreground/90 font-medium"
                                }`}
                              >
                                {notification.title}
                              </span>

                              {isUnread && (
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleDismissNotification(
                                      e,
                                      notification.id,
                                    )
                                  }
                                  title="Mark as read"
                                  aria-label="Mark as read"
                                  className="shrink-0 p-1 rounded-full text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors opacity-70 group-hover:opacity-100"
                                >
                                  <Check className="size-3" />
                                </button>
                              )}
                            </div>

                            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px]">
                              {Boolean(
                                notification.metadata?.requestNumber,
                              ) && (
                                <span className="font-mono tabular-nums px-1.5 py-0.5 rounded bg-muted font-medium text-foreground text-[10px]">
                                  {String(notification.metadata?.requestNumber)}
                                </span>
                              )}
                              {Boolean(notification.metadata?.trxId) && (
                                <span className="font-mono tabular-nums px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                                  {String(notification.metadata?.trxId)}
                                </span>
                              )}
                              <span className="font-mono tabular-nums text-muted-foreground/70">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-border bg-card/60 px-4 py-2 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span className="font-medium">
                    {userRole === "CITIZEN"
                      ? "Resident Intake & Verification"
                      : userRole === "STAFF"
                        ? "Department Dispatch Queue"
                        : "Governance & Operations"}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    Municipal Alerts
                  </span>
                </div>
              </div>
            )}
          </div>

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

function getNotificationIcon(eventKey: string) {
  if (
    eventKey === "SLA_BREACHED" ||
    eventKey === "SLA_BREACH_ALERT" ||
    eventKey.includes("BREACH")
  ) {
    return ClockAlert;
  }
  if (eventKey === "NEW_HIGH_PRIORITY_REQUEST") {
    return ShieldAlert;
  }
  if (
    eventKey === "PAYMENT_COMPLETED" ||
    eventKey === "PAYMENT_RECONCILED" ||
    eventKey.includes("PAYMENT")
  ) {
    return ReceiptText;
  }
  if (eventKey === "NEW_CITIZEN_FEEDBACK") {
    return Star;
  }
  if (eventKey === "REQUEST_ASSIGNED") {
    return UserCheck;
  }
  if (eventKey === "REQUEST_RESOLVED") {
    return CheckCheck;
  }
  if (eventKey === "REQUEST_ACTION_REQUIRED") {
    return AlertTriangle;
  }
  return ClipboardList;
}

function getNotificationIconColor(eventKey: string) {
  if (
    eventKey === "SLA_BREACHED" ||
    eventKey === "SLA_BREACH_ALERT" ||
    eventKey === "NEW_HIGH_PRIORITY_REQUEST"
  ) {
    return "bg-destructive/10 text-destructive";
  }
  if (
    eventKey === "PAYMENT_COMPLETED" ||
    eventKey === "PAYMENT_RECONCILED" ||
    eventKey === "REQUEST_RESOLVED"
  ) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  if (
    eventKey === "NEW_CITIZEN_FEEDBACK" ||
    eventKey === "REQUEST_ACTION_REQUIRED"
  ) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  if (eventKey === "REQUEST_ASSIGNED") {
    return "bg-cobalt-flow/10 text-cobalt-flow";
  }
  return "bg-primary/10 text-primary";
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
