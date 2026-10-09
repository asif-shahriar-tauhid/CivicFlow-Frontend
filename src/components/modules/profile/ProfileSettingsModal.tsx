"use client";

import {
  Building2,
  Camera,
  CheckCircle2,
  Mail,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Spinner } from "@/components/ui/spinner";
import { useUploadProfileImage } from "@/hooks/user.hooks";
import type { User } from "@/types/auth.types";

interface ProfileSettingsModalProps {
  user: User | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ProfileSettingsModal({
  user,
  isOpen,
  onClose,
}: ProfileSettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: uploadImage, isPending: isUploading } =
    useUploadProfileImage();

  if (!isOpen || !user) return null;

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg(
        "Please choose a valid image file (PNG, JPEG, WEBP, or GIF).",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(
        "Image size exceeds 5MB limit. Please choose a smaller photo.",
      );
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadImage(selectedFile, {
      onSuccess: () => {
        gooeyToast.success("Profile Photo Updated", {
          description: "Your profile photo has been updated successfully.",
        });
        handleClearPreview();
      },
      onError: (err: unknown) => {
        const errorDescription =
          err instanceof Error
            ? err.message
            : "Unable to upload image. Please verify file integrity and retry.";
        gooeyToast.error("Upload Failed", {
          description: errorDescription,
        });
      },
    });
  };

  const roleLabel = {
    ADMIN: "Municipal Administrator",
    STAFF: "Department Field Staff",
    CITIZEN: "Verified Resident",
  }[user.role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4.5 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserIcon className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Profile & Account Telemetry
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your avatar photo and municipal access clearance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="rounded-xl border border-border bg-muted/20 p-4.5 flex items-start gap-4">
            <div className="relative group shrink-0">
              <UserAvatar user={user} size="xl" showBadge />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 pointer-events-none group-hover:pointer-events-auto"
                title="Change Photo"
              >
                <Camera className="size-6" />
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-base text-foreground truncate">
                  {user.name}
                </span>
                <Badge
                  variant="outline"
                  className={
                    user.role === "ADMIN"
                      ? "border-primary/30 text-primary bg-primary/5"
                      : user.role === "STAFF"
                        ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                        : "border-border text-muted-foreground"
                  }
                >
                  {roleLabel}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate font-mono">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {user.department?.name && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate font-medium">
                    Department: {user.department.name}
                  </span>
                </div>
              )}

              <div className="pt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3" />
                  Account Active
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-photo-input"
                className="text-xs font-semibold text-foreground uppercase tracking-wide cursor-pointer"
              >
                Update Profile Photo
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                PNG, JPG, WEBP • Max 5MB
              </span>
            </div>

            <input
              id="profile-photo-input"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleInputChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-xs">
                    <Image
                      src={previewUrl}
                      alt="New avatar preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        New Photo Preview
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                        <CheckCircle2 className="size-3" />
                        Ready to save
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                      {selectedFile?.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                      {selectedFile ? (selectedFile.size / 1024).toFixed(0) : 0}{" "}
                      KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-primary/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearPreview}
                    disabled={isUploading}
                    className="text-xs rounded-full h-8 px-4 font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="gap-1.5 text-xs rounded-full h-8 px-4.5 font-medium shadow-xs"
                  >
                    {isUploading ? (
                      <>
                        <Spinner className="size-3.5" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5" />
                        <span>Save Photo</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-2">
                  <Upload className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  Click to choose image or drag & drop here
                </span>
                <span className="mt-1 text-[11px] text-muted-foreground">
                  High-resolution square photos recommended
                </span>
              </button>
            )}

            {errorMsg && (
              <p className="text-xs text-destructive font-medium animate-in fade-in">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border px-6 py-3.5 bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            Encrypted session • Role: {user.role}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-4xl text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
