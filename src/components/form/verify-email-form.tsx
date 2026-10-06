"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, KeyRound, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
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
import { useVerifyEmail } from "@/hooks/auth.hooks";
import { emailVerificationZodSchema } from "@/validation";

function VerifyEmailFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const { mutate: verify, isPending: verifyPending } = useVerifyEmail();

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
          onSuccess: () => {
            gooeyToast.success("Account Activated!", {
              description:
                "Welcome to CivicFlow. Your citizen profile is active.",
            });
            setTimeout(() => {
              router.push("/citizen");
            }, 600);
          },
          onError: (err: any) => {
            gooeyToast.error("Verification Failed", {
              description:
                err.message || "Invalid or expired OTP code. Please retry.",
            });
          },
        },
      );
    },
  });

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
          {/* Email field */}
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

          {/* 6-Digit OTP field */}
          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    6-Digit Verification Code (OTP)
                  </FieldLabel>
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
        </FieldGroup>
      </form>

      <div className="text-center pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <Link href="/register" className="hover:text-foreground">
          Wrong email address?
        </Link>
        <Link
          href="/login"
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
