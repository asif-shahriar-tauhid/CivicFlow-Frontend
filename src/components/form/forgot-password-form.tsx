"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
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
import { useForgotPassword } from "@/hooks/auth.hooks";
import { forgotPasswordZodSchema } from "@/validation/auth.validation";

const DEMO_RECOVERY_ACCOUNTS = [
  {
    role: "CITIZEN",
    label: "Citizen Demo",
    email: "citizen@example.com",
    icon: Users,
  },
  {
    role: "STAFF",
    label: "Staff Demo",
    email: "staff.drainage.1@civicflow.org",
    icon: UserCheck,
  },
  {
    role: "ADMIN",
    label: "Admin Demo",
    email: "superadmin@example.com",
    icon: Shield,
  },
];

interface ApiErrorResponse {
  message?: string;
  data?: {
    message?: string;
  };
}

function ForgotPasswordFormInner() {
  const router = useRouter();
  const { mutate: sendRecoveryOtp, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "citizen@example.com",
    },
    validators: {
      onSubmit: forgotPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      const targetEmail = value.email.trim();
      sendRecoveryOtp(
        { email: targetEmail },
        {
          onSuccess: () => {
            gooeyToast.success("Recovery Code Sent", {
              description: `A 6-digit verification code has been dispatched to ${targetEmail}.`,
            });
            setTimeout(() => {
              router.push(
                `/reset-password?email=${encodeURIComponent(targetEmail)}`,
              );
            }, 600);
          },
          onError: (err: unknown) => {
            const apiErr = err as ApiErrorResponse;
            const message =
              apiErr?.data?.message ||
              apiErr?.message ||
              "Could not send recovery OTP. Please verify the email address.";
            gooeyToast.error("Request Failed", {
              description: message,
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
            Identity-Verified Dispatch:
          </span>{" "}
          Provide your registered municipal email. If an account is found, an
          unambiguous 6-digit one-time token will be sent to your inbox.
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Recovery Autofill:
          </span>
          <span className="font-mono text-xs text-primary">Pre-seeded</span>
        </div>
        <form.Subscribe selector={(state) => state.values.email}>
          {(currentEmail) => (
            <div className="grid grid-cols-3 gap-2">
              {DEMO_RECOVERY_ACCOUNTS.map((demo) => {
                const Icon = demo.icon;
                const isSelected = currentEmail === demo.email;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => form.setFieldValue("email", demo.email)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="size-3.5 mb-1" />
                    <span className="text-xs leading-none">{demo.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </form.Subscribe>
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
                  <FieldLabel htmlFor={field.name}>
                    Registered Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="citizen@example.com"
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

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isPending}
            className="w-full gap-2 mt-2 shadow-xs rounded-4xl"
          >
            {isPending ? (
              <Spinner>Sending recovery code...</Spinner>
            ) : (
              <>
                <KeyRound className="size-4" />
                <span>Send 6-Digit Recovery Code</span>
                <ArrowRight className="size-4 ml-auto" />
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
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Create New Citizen Profile
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="h-48 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ForgotPasswordFormInner />
    </Suspense>
  );
}
