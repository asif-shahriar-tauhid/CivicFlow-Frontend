"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FilePlus2,
  Home,
  LayoutDashboard,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useGetME, useLogout } from "@/hooks";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData, isLoading } = useGetME();
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

  return (
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
                  !isReportPage
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <LayoutDashboard className="size-3.5" />
                <span>My Tickets</span>
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

            {/* User pill display */}
            <div className="flex items-center gap-2 rounded-4xl border border-border bg-muted/30 px-3 py-1 text-xs">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <span className="font-medium text-foreground max-w-[120px] truncate hidden sm:inline">
                {user?.name || "Citizen User"}
              </span>
            </div>

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
              !isReportPage
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            My Complaints
          </Link>
          <Link
            href="/citizen/report"
            className={`flex-1 text-center py-1.5 rounded-4xl text-xs font-medium ${
              isReportPage
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            + Report Issue
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
    </div>
  );
}
