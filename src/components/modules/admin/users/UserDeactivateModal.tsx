"use client";

import { AlertTriangle, UserX, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useSoftDeleteUser } from "@/hooks/user.hooks";
import type { User } from "@/types/auth.types";

interface UserDeactivateModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserDeactivateModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: UserDeactivateModalProps) {
  const { mutateAsync: softDeleteMutate, isPending: isDeactivating } =
    useSoftDeleteUser();

  if (!isOpen || !user) return null;

  const handleDeactivate = async () => {
    try {
      await softDeleteMutate(user.id);

      gooeyToast.warning("User Account Suspended", {
        description: `Account for ${user.email} has been deactivated and status set to BLOCKED.`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      gooeyToast.error("Deactivation Failed", {
        description:
          error?.data?.message ||
          error?.message ||
          "Could not deactivate user account.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-destructive/25 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        role="alertdialog"
        aria-labelledby="deactivate-user-title"
        aria-describedby="deactivate-user-description"
        aria-modal="true"
      >
        {/* Warning Accent */}
        <div className="h-1.5 w-full bg-linear-to-r from-destructive via-red-500 to-amber-500" />

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3
                  id="deactivate-user-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Suspend User Account?
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {user.id.slice(0, 8)}...
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeactivating}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* User Preview */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{user.name}</span>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono"
                >
                  {user.role}
                </Badge>
                <Badge
                  variant={user.status === "ACTIVE" ? "default" : "secondary"}
                  className="text-[10px] uppercase font-mono"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground font-mono text-[11px] truncate">
              {user.email}
            </p>
            {user.department && (
              <p className="text-muted-foreground text-[11px]">
                Dept: {user.department.name}
              </p>
            )}
          </div>

          <p
            id="deactivate-user-description"
            className="text-xs text-muted-foreground leading-relaxed"
          >
            Suspending this account will immediately revoke all portal session
            tokens, block authentication, and flag the record as deactivated in
            the municipal governance directory. This action is permanently
            logged in the system audit trail.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3.5 bg-muted/20 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeactivating}
            className="rounded-4xl px-4 text-xs"
          >
            Keep Active
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="gap-2 rounded-4xl px-4 text-xs font-semibold shadow-xs"
          >
            {isDeactivating ? (
              <>
                <Spinner className="size-3.5" />
                <span>Suspending...</span>
              </>
            ) : (
              <>
                <UserX className="size-3.5" />
                <span>Yes, Suspend Account</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
