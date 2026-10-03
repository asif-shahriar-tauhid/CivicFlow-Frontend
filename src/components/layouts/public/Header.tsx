"use client";

import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { useGetME } from "@/hooks";
import { ArrowRight, LayoutDashboard, Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: userData, isLoading } = useGetME();
  const user = userData?.data;

  const getDashboardUrl = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin";
      case "STAFF":
        return "/staff";
      default:
        return "/citizen";
    }
  };

  const navLinks = [
    { name: "Explore Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Live Telemetry", href: "#telemetry" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Logo />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-foreground">
                CivicFlow
              </span>
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Municipal Services
              </span>
            </div>
          </Link>

          {/* Status pill (desktop) */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-foreground">Grid Active</span>
            <span className="text-muted-foreground/60">•</span>
            <span>24/7 Operations</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <Button
              variant="default"
              size="sm"
              render={<Link href={getDashboardUrl()} />}
              nativeButton={false}
              className="gap-2"
            >
              <LayoutDashboard className="size-4" />
              <span>{user.name.split(" ")[0]} Portal</span>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="gap-1.5"
              >
                <span>Report Issue</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex p-2 text-muted-foreground hover:text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-foreground py-1"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-border">
              {user ? (
                <Button
                  variant="default"
                  render={<Link href={getDashboardUrl()} />}
                  nativeButton={false}
                  className="w-full justify-center"
                >
                  Go to {user.role} Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    render={<Link href="/login" />}
                    nativeButton={false}
                    className="w-full justify-center"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    render={<Link href="/login?redirect=/citizen/report" />}
                    nativeButton={false}
                    className="w-full justify-center"
                  >
                    Report an Issue (60s)
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
