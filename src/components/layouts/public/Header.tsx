"use client";

import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Logo from "@/asset/svg/Logo";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useGetME, useLogout } from "@/hooks";

import { getRoleDashboardUrl } from "@/lib/authUtils";

const NAV_LINKS = [
  { name: "Services", href: "/#services" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Telemetry", href: "/#telemetry" },
  { name: "About Us", href: "/about-us" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activePath = mounted ? pathname : "";

  const isLinkActive = (href: string) => {
    if (!activePath) return false;
    if (href === "/about-us") {
      return activePath.startsWith("/about-us");
    }
    return href === activePath;
  };

  const { data: userData, isLoading } = useGetME();
  const { mutate: logout, isPending: logoutPending } = useLogout();
  const user = userData?.data;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const getDashboardUrl = () => getRoleDashboardUrl(user?.role);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        gooeyToast.success("Logged Out", {
          description: "You have been signed out of CivicFlow.",
        });
        router.push("/");
      },
      onError: () => {
        gooeyToast.info("Session Ended", {
          description: "Your session has ended.",
        });
        router.push("/");
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-all">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
          >
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Logo />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-foreground">
                CivicFlow
              </span>
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Municipal Services
              </span>
            </div>
          </Link>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative text-sm font-medium transition-colors py-1 ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{link.name}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-primary rounded-full transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Button
                variant="default"
                size="sm"
                render={<Link href={getDashboardUrl()} />}
                nativeButton={false}
                className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard className="size-4" />
                <span>
                  {user?.name
                    ? `${user.name.split(" ")[0]} Portal`
                    : "Dashboard"}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutPending}
                className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>{logoutPending ? "Signing out..." : "Logout"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/login" />}
                nativeButton={false}
                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                render={<Link href="/login?redirect=/citizen/report" />}
                nativeButton={false}
                className="gap-1.5 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Report Issue</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex p-2 text-muted-foreground hover:text-foreground md:hidden transition-transform active:scale-95"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Real-time telemetry conduit scroll indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-[#75D8FC] to-primary origin-left pointer-events-none"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-background px-4 py-5 shadow-lg md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-1 transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-border">
                {user ? (
                  <>
                    <Button
                      variant="default"
                      render={<Link href={getDashboardUrl()} />}
                      nativeButton={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full justify-center gap-2"
                    >
                      <LayoutDashboard className="size-4" />
                      <span>Go to {user?.role || "Citizen"} Dashboard</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      disabled={logoutPending}
                      className="w-full justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      <span>{logoutPending ? "Signing out..." : "Logout"}</span>
                    </Button>
                  </>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
