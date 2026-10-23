"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? "sm" : "icon-sm"}
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative rounded-full border-border bg-card/80 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all",
        showLabel && "gap-2 px-3",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="size-4 text-primary transition-transform duration-300 rotate-0 scale-100" />
        )
      ) : (
        <span className="size-4" />
      )}
      {showLabel && (
        <span className="text-xs font-medium">
          {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Theme"}
        </span>
      )}
    </Button>
  );
}
