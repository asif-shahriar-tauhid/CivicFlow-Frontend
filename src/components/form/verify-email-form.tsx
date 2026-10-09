"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getMe } from "@/api/auth.api";
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
import { useResendOtp, useVerifyEmail } from "@/hooks/auth.hooks";
import { decodeJwtPayload, resolvePostAuthUrl } from "@/lib/authUtils";
import type { AuthSuccessResponse } from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";
import { emailVerificationZodSchema } from "@/validation";

function VerifyEmailFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const redirectUrl = searchParams.get("redirect");

  const queryClient = useQueryClient();
  const { mutate: verify, isPending: verifyPending } = useVerifyEmail();
  const { mutate: resendOtp, isPending: resendPending } = useResendOtp();
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
    },
    validators: {
      onSubmit: emailVerificationZodSchema,
    },
    onSubmit: ({ value }) => {
      verify(
        {
          email: value.email.trim(),
          otp: value.otp.trim(),
        },
        {
          onSuccess: async (res: ApiResponse<AuthSuccessResponse>) => {
            gooeyToast.success("Account Activated!", {
              description:
                "Welcome to CivicFlow. Your citizen profile is active.",
            });

            const token = res?.data?.accessToken;
            let role =
              res?.data?.user?.role ||
              decodeJwtPayload(token)?.role ||
              "CITIZEN";

            if (res?.data?.user) {
              queryClient.setQueryData(["user"], {
                success: true,
                statusCode: 200,
                message: "User profile",
                data: res.data.user,
              });
            }

            try {
              const meRes = await getMe();
              queryClient.setQueryData(["user"], meRes);
              if (meRes?.data?.role) {
                role = meRes.data.role;
              }
            } catch {
            }
            queryClient.invalidateQueries({ queryKey: ["user"] });

            const targetUrl = resolvePostAuthUrl({
              accessToken: token,
              userRole: role,
              redirectUrl,
            });

            router.push(targetUrl);
            router.refresh();
          },
          onError: (err: unknown) => {
            const apiErr = err as {
              message?: string;
              data?: { message?: string };
            };
            gooeyToast.error("Verification Failed", {
              description:
                apiErr?.data?.message ||
                apiErr?.message ||
                "Invalid or expired OTP code. Please retry.",
            });
          },
        },
      );
    },
  });

  const handleResendOtp = () => {
    const emailValue = form.getFieldValue("email")?.trim();
    if (!emailValue || !emailValue.includes("@")) {
      gooeyToast.error("Email Required", {
        description:
          "Please specify a valid registered email address to receive a fresh verification code.",
      });
      return;
    }

    resendOtp(
      { email: emailValue },
      {
        onSuccess: () => {
          setResendCooldown(60);
          gooeyToast.success("Verification Code Resent", {
            description: `A fresh 6-digit confirmation code was dispatched to ${emailValue}.`,
          });
        },
        onError: (err: unknown) => {
          const apiErr = err as {
            message?: string;
            data?: { message?: string };
          };
          gooeyToast.error("Could Not Resend Code", {
            description:
              apiErr?.data?.message ||
              apiErr?.message ||
              "Unable to resend code. If your registration session expired, please re-register.",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <Mail className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">
            Check your inbox:
          </span>{" "}
          Enter the 6-digit confirmation code sent to your registered email
          address.
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
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
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
                      6-Digit Verification Code (OTP)
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || resendPending}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer transition-opacity"
                    >
                      {resendPending ? (
                        <>
                          <Spinner className="size-3 text-primary" />
                          <span>Resending...</span>
                        </>
                      ) : resendCooldown > 0 ? (
                        <span>Resend in {resendCooldown}s</span>
                      ) : (
                        <>
                          <RefreshCw className="size-3" />
                          <span>Resend Code</span>
                        </>
                      )}
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

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={verifyPending}
            className="w-full gap-2 mt-2 shadow-xs"
          >
            {verifyPending ? (
              <Spinner>Verifying code...</Spinner>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Verify & Activate Account</span>
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
            <span>Didn't receive the email code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || resendPending}
              className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
            >
              {resendCooldown > 0
                ? `Retry in ${resendCooldown}s`
                : "Click to Resend OTP"}
            </button>
          </div>
        </FieldGroup>
      </form>

      <div className="text-center pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href={
            redirectUrl
              ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
              : "/register"
          }
          className="hover:text-foreground"
        >
          Wrong email address?
        </Link>
        <Link
          href={
            redirectUrl
              ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
              : "/login"
          }
          className="text-primary hover:underline font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="h-48 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <VerifyEmailFormInner />
    </Suspense>
  );
}
