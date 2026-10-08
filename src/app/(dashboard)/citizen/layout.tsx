"use client";

import { FilePlus2, LayoutDashboard, LogOut, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import Logo from "@/asset/svg/Logo";
import { RoleGuard } from "@/components/common/RoleGuard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ProfileSettingsModal } from "@/components/modules/profile/ProfileSettingsModal";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useGetME, useLogout } from "@/hooks";


export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: userData } = useGetME();
  const { mutate: logout, isPending: logoutPending } = useLogout();


  const user = userData?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        gooeyToast.success("Signed Out", {
          description: "You have been logged out of CivicFlow.",
        });
        router.push("/");
      },
    });
  };

  const isReportPage = pathname === "/citizen/report";
  const isPaymentsPage = pathname?.startsWith("/citizen/payments");
  const isTicketsPage = !isReportPage && !isPaymentsPage;

  return (
    <RoleGuard allowedRoles={["CITIZEN"]}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Citizen Top App Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Brand & Portal Label */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <Logo size={36} />
                <div className="flex flex-col">
                  <span className="text-base font-bold leading-none tracking-tight text-foreground">
                    CivicFlow
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Citizen Portal
                  </span>
                </div>
              </Link>

              <div className="h-6 w-px bg-border hidden sm:block" />

              {/* Navigation links */}
              <nav className="hidden sm:flex items-center gap-2">
                <Link
                  href="/citizen"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    isTicketsPage
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>My Tickets</span>
                </Link>
                <Link
                  href="/citizen/payments"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    isPaymentsPage
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <ReceiptText className="size-3.5" />
                  <span>Invoices & Billing</span>
                </Link>
                <Link
                  href="/citizen/report"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-4xl text-xs font-medium transition-colors ${
                    isReportPage
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <FilePlus2 className="size-3.5" />
                  <span>Report Issue</span>
                </Link>
              </nav>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              {!isReportPage && (
                <Button
                  variant="default"
                  size="sm"
                  render={<Link href="/citizen/report" />}
                  nativeButton={false}
                  className="hidden md:inline-flex gap-1.5 shadow-xs"
                >
                  <FilePlus2 className="size-3.5" />
                  <span>Report Issue (60s)</span>
                </Button>
              )}

              {/* User avatar and profile trigger */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                title="Profile & Avatar Settings"
                className="flex items-center gap-2 rounded-4xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/40 px-2.5 py-1 text-xs transition-all cursor-pointer group"
              >
                <UserAvatar user={user} size="xs" />
                <span className="font-medium text-foreground max-w-[120px] truncate hidden sm:inline group-hover:text-primary transition-colors">
                  {user?.name || "Citizen User"}
                </span>
              </button>

              {/* Logout button */}
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

          {/* Mobile Navigation bar */}
          <div className="flex sm:hidden border-t border-border px-4 py-2 gap-2 bg-muted/20">
            <Link
              href="/citizen"
              className={`flex-1 text-center py-1.5 rounded-4xl text-xs font-medium ${
                isTicketsPage
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              My Complaints
            </Link>
            <Link
              href="/citizen/payments"
              className={`flex-1 text-center py-1.5 rounded-4xl text-xs font-medium ${
                isPaymentsPage
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Invoices
            </Link>
            <Link
              href="/citizen/report"
              className={`flex-1 text-center py-1.5 rounded-4xl text-xs font-medium ${
                isReportPage
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              + Report
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Municipal Telemetry Footer Note */}
        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CivicFlow Public Intake & Verification Engine</span>
            <span className="font-mono text-[11px]">
              SLA Monitored • 7-Day Reopen Rights Guaranteed
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
