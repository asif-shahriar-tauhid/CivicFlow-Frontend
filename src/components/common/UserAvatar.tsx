"use client";

import { HardHat, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { User, UserRole } from "@/types/auth.types";

interface UserAvatarProps {
  user?: Partial<User> | null;
  imageUrl?: string | null;
  name?: string;
  role?: UserRole;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

const sizeConfig = {
  xs: {
    container: "size-5 text-[10px]",
    dimension: 20,
    badge: "size-2.5 -bottom-0.5 -right-0.5",
    badgeIcon: "size-1.5",
  },
  sm: {
    container: "size-7 text-xs",
    dimension: 28,
    badge: "size-3 -bottom-0.5 -right-0.5",
    badgeIcon: "size-2",
  },
  md: {
    container: "size-9 text-sm",
    dimension: 36,
    badge: "size-4 bottom-0 right-0",
    badgeIcon: "size-2.5",
  },
  lg: {
    container: "size-12 text-base font-semibold",
    dimension: 48,
    badge: "size-5 bottom-0 right-0",
    badgeIcon: "size-3",
  },
  xl: {
    container: "size-20 text-2xl font-bold",
    dimension: 80,
    badge: "size-6 bottom-0 right-0",
    badgeIcon: "size-3.5",
  },
};

export function UserAvatar({
  user,
  imageUrl: directImageUrl,
  name: directName,
  role: directRole,
  size = "md",
  className = "",
  showBadge = false,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const effectiveImageUrl = directImageUrl ?? user?.imageUrl;
  const effectiveName = directName || user?.name || "User";
  const effectiveRole = directRole || user?.role || "CITIZEN";

  const {
    container: sizeClass,
    dimension,
    badge: badgeClass,
    badgeIcon: badgeIconClass,
  } = sizeConfig[size];

  const initial = effectiveName.trim().charAt(0).toUpperCase() || "U";

  // Role based fallback gradients
  const roleStyles = {
    ADMIN:
      "bg-gradient-to-br from-indigo-500/20 via-primary/20 to-cyan-500/30 text-primary border-primary/30",
    STAFF:
      "bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/30 text-amber-600 dark:text-amber-400 border-amber-500/30",
    CITIZEN:
      "bg-gradient-to-br from-primary/15 via-sky-500/15 to-blue-600/20 text-foreground border-border",
  }[effectiveRole];

  return (
    <div
      className={`relative inline-flex shrink-0 select-none ${sizeClass} ${className}`}
    >
      {/* Circular avatar body (masked to circle) */}
      <div
        className={`size-full rounded-full overflow-hidden border flex items-center justify-center font-mono font-bold shadow-2xs ${roleStyles}`}
      >
        {effectiveImageUrl && !imageError ? (
          <Image
            src={effectiveImageUrl}
            alt={effectiveName}
            width={dimension}
            height={dimension}
            className="size-full object-cover object-center"
            onError={() => setImageError(true)}
            priority={size === "xl"}
          />
        ) : (
          <span className="flex items-center justify-center font-semibold tracking-tight">
            {initial}
          </span>
        )}
      </div>

      {/* Role badge (positioned on bottom-right, unclipped) */}
      {showBadge && (
        <span
          className={`absolute z-10 rounded-full border-2 border-background flex items-center justify-center shadow-xs ${badgeClass} ${
            effectiveRole === "ADMIN"
              ? "bg-primary text-primary-foreground"
              : effectiveRole === "STAFF"
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white"
          }`}
          title={`Role: ${effectiveRole}`}
        >
          {effectiveRole === "ADMIN" ? (
            <Shield className={badgeIconClass} strokeWidth={2.5} />
          ) : effectiveRole === "STAFF" ? (
            <HardHat className={badgeIconClass} strokeWidth={2.5} />
          ) : (
            <UserIcon className={badgeIconClass} strokeWidth={2.5} />
          )}
        </span>
      )}
    </div>
  );
}
