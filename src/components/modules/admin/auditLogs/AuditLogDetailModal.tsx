"use client";

import {
  Check,
  Copy,
  FileCode,
  Globe,
  Lock,
  Route,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/types/auditLog.types";

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailModal({
  log,
  isOpen,
  onClose,
}: AuditLogDetailModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"after" | "before" | "both">(
    "after",
  );

  if (!isOpen || !log) return null;

  const formattedDate = new Date(log.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-modal-title"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-primary to-sky-400" />

        <div className="flex items-start justify-between p-6 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="audit-modal-title"
                  className="font-bold text-base text-foreground font-mono"
                >
                  {log.action}
                </h3>
                <Badge variant="outline" className="text-[10px] bg-muted/60">
                  {log.entity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Timestamp: {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
              className="h-8 px-2.5 text-xs gap-1 border-border/70"
              title="Copy audit log payload JSON"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[10px] uppercase">
                <User className="h-3 w-3" />
                <span>Actor Profile</span>
              </div>
              <div className="font-semibold text-foreground truncate">
                {log.actorEmail || "System Automation / Internal Job"}
              </div>
              {log.actorId && (
                <div className="font-mono text-[10px] text-muted-foreground truncate">
                  ID: {log.actorId}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[10px] uppercase">
                <Globe className="h-3 w-3" />
                <span>Network & Client</span>
              </div>
              <div className="font-mono text-foreground truncate">
                IP: {log.ipAddress || "127.0.0.1"}
              </div>
              <div
                className="text-[10px] text-muted-foreground truncate"
                title={log.userAgent || "Internal"}
              >
                {log.userAgent || "Direct Service Call"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[10px] uppercase">
                <Route className="h-3 w-3" />
                <span>API Route & Target Entity</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-primary font-medium truncate">
                  {log.route || "Internal Transaction"}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  Target: {log.entity} #{log.entityId.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <FileCode className="h-3.5 w-3.5 text-primary" />
                <span>State Payload Diff</span>
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("after")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeTab === "after"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  After State
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("before")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeTab === "before"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Before State
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("both")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeTab === "both"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {activeTab === "after" && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 overflow-x-auto max-h-60 font-mono text-[11px] text-foreground leading-relaxed">
                {log.after ? (
                  <pre>{JSON.stringify(log.after, null, 2)}</pre>
                ) : (
                  <span className="text-muted-foreground italic">
                    No after-state recorded (e.g. deletion or stateless event).
                  </span>
                )}
              </div>
            )}

            {activeTab === "before" && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 overflow-x-auto max-h-60 font-mono text-[11px] text-foreground leading-relaxed">
                {log.before ? (
                  <pre>{JSON.stringify(log.before, null, 2)}</pre>
                ) : (
                  <span className="text-muted-foreground italic">
                    No before-state recorded (e.g. initial entity creation).
                  </span>
                )}
              </div>
            )}

            {activeTab === "both" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3 overflow-x-auto max-h-60 space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase pb-1 border-b border-border/40">
                    Previous State
                  </div>
                  {log.before ? (
                    <pre>{JSON.stringify(log.before, null, 2)}</pre>
                  ) : (
                    <span className="text-muted-foreground italic">None</span>
                  )}
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/40 p-3 overflow-x-auto max-h-60 space-y-1">
                  <div className="text-[10px] font-bold text-primary uppercase pb-1 border-b border-border/40">
                    Mutated State
                  </div>
                  {log.after ? (
                    <pre>{JSON.stringify(log.after, null, 2)}</pre>
                  ) : (
                    <span className="text-muted-foreground italic">None</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 px-6 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>Immutable Ledger Record #{log.id.slice(0, 12)}</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
