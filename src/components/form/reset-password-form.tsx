"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword, useResetPassword } from "@/hooks/auth.hooks";

const clientResetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Please provide a valid email address."),
    otp: z
      .string()
      .trim()
      .length(6, "Verification code must be exactly 6 characters."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must include at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must include at least one special character.",
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface ApiErrorResponse {
  message?: string;
  data?: {
    message?: string;
  };
}

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { mutate: resetPwd, isPending: resetPending } = useResetPassword();
  const { mutate: resendOtp, isPending: resendPending } = useForgotPassword();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: clientResetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      resetPwd(
        {
          email: value.email.trim(),
          otp: value.otp.trim(),
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            gooeyToast.success("Password Reset Successful", {
              description:
                "Your password has been updated. Please sign in with your new credentials.",
            });
            setTimeout(() => {
              router.push("/login");
            }, 800);
          },
          onError: (err: unknown) => {
            const apiErr = err as ApiErrorResponse;
            const message =
              apiErr?.data?.message ||
              apiErr?.message ||
              "Could not reset password. The OTP code may be invalid or expired.";
            gooeyToast.error("Reset Failed", {
              description: message,
            });
          },
        },
      );
    },
  });

  const pwd = form.state.values.newPassword;
  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const handleResendOtp = () => {
    const currentEmail = form.getFieldValue("email").trim();
    if (!currentEmail || !currentEmail.includes("@")) {
      gooeyToast.error("Email Required", {
        description: "Please specify a valid email to receive a new code.",
      });
      return;
    }

    resendOtp(
      { email: currentEmail },
      {
        onSuccess: () => {
          setResendCooldown(60);
          gooeyToast.success("Fresh Code Dispatched", {
            description: `A new 6-digit verification code was sent to ${currentEmail}.`,
          });
        },
        onError: (err: unknown) => {
          const apiErr = err as ApiErrorResponse;
          gooeyToast.error("Resend Failed", {
            description:
              apiErr?.data?.message ||
              apiErr?.message ||
              "Could not dispatch code. Please try again shortly.",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">
            Cryptographic Authentication Reset:
          </span>{" "}
          Verify your one-time code and specify a strong replacement password to
          re-establish municipal credentials.
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Account Email</FieldLabel>
                    {field.state.value && (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Verified account
                      </span>
                    )}
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>
                      6-Digit Recovery Code (OTP)
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || resendPending}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline font-medium"
                    >
                      <RotateCcw
                        className={`size-3 ${resendPending ? "animate-spin" : ""}`}
                      />
                      <span>
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : resendPending
                            ? "Sending..."
                            : "Resend Code"}
                      </span>
                    </button>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    className="font-mono text-center tracking-widest text-lg font-bold"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {pwd.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs flex flex-col gap-1.5 animate-in fade-in duration-150">
              <span className="font-semibold text-muted-foreground">
                Password Complexity Requirements:
              </span>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasMinLength ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  8+ characters
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasUpper && hasLower ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasUpper && hasLower ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  Upper & lower case
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasNumber ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasNumber ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  At least 1 number
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${
                    hasSpecial ? "text-emerald-600 font-medium" : ""
                  }`}
                >
                  {hasSpecial ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3 text-muted-foreground/60" />
                  )}
                  Special character
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={resetPending}
            className="w-full gap-2 mt-2 shadow-xs rounded-4xl"
          >
            {resetPending ? (
              <Spinner>Updating credentials...</Spinner>
            ) : (
              <>
                <KeyRound className="size-4" />
                <span>Reset Password & Sign In</span>
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Sign In</span>
        </Link>
        <Link
          href="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          Request Fresh OTP
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="h-48 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
