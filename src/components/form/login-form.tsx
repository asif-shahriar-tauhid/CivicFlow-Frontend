"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, Suspense, useState } from "react";
import { getMe } from "@/api/auth.api";
import GoogleLoginComponent from "@/components/GoogleLogin";
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
import { useLogin } from "@/hooks/auth.hooks";
import {
  decodeJwtPayload,
  resolvePostAuthUrl,
  syncClientAuthCookie,
} from "@/lib/authUtils";
import type { AuthTokens } from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";
import { LoginZodSchema } from "@/validation";

const DEMO_ACCOUNTS = [
  {
    role: "CITIZEN",
    label: "Citizen Demo",
    email: "citizen.sarah@example.com",
    password: "Password@123",
    icon: Users,
    desc: "Report & track issues",
  },
  {
    role: "STAFF",
    label: "Field Staff",
    email: "staff.drainage@civicflow.org",
    password: "Password@123",
    icon: UserCheck,
    desc: "Department work queues",
  },
  {
    role: "ADMIN",
    label: "City Admin",
    email: "superadmin@example.com",
    password: "Password@123",
    icon: Shield,
    desc: "SLA & routing rules",
  },
];

interface LoginFormProps {
  googleLogin?: ReactNode;
}

function LoginFormInner({ googleLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const queryClient = useQueryClient();
  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "citizen.sarah@example.com",
      password: "Password@123",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      login(
        {
          email: value.email.trim(),
          password: value.password,
        },
        {
          onSuccess: async (res: ApiResponse<AuthTokens>) => {
            gooeyToast.success("Login Successful", {
              description: "Welcome back to CivicFlow Municipal Portal.",
            });

            const token = res?.data?.accessToken;
            if (token) {
              syncClientAuthCookie(token);
            }
            const decodedJwt = decodeJwtPayload(token);
            let tokenRole = decodedJwt?.role;

            // Pre-hydrate authoritative user profile in query cache immediately
            try {
              const meRes = await getMe();
              queryClient.setQueryData(["user"], meRes);
              if (meRes?.data?.role) {
                tokenRole = meRes.data.role;
              }
            } catch {
            }
            queryClient.invalidateQueries({ queryKey: ["user"] });

            const targetUrl = resolvePostAuthUrl({
              accessToken: token,
              userRole: tokenRole,
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
            gooeyToast.error("Authentication Failed", {
              description:
                apiErr?.data?.message ||
                apiErr?.message ||
                "Invalid email or password. Please verify.",
            });
          },
        },
      );
    },
  });

  const handleSelectDemo = (email: string, pass: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", pass);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-muted/30 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Demo Access:
          </span>
          <span className="font-mono text-xs text-primary">Pre-seeded</span>
        </div>
        <form.Subscribe selector={(state) => state.values.email}>
          {(currentEmail) => (
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((demo) => {
                const Icon = demo.icon;
                const isSelected = currentEmail === demo.email;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleSelectDemo(demo.email, demo.password)}
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
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
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

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
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

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={loginPending}
            className="w-full gap-2 mt-2 shadow-xs"
          >
            {loginPending ? (
              <Spinner>Authenticating...</Spinner>
            ) : (
              <>
                <KeyRound className="size-4" />
                <span>Sign In to CivicFlow</span>
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="flex flex-col gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>

        <div className="flex justify-center w-full">
          {googleLogin ?? <GoogleLoginComponent />}
        </div>
      </div>

      <div className="text-center pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>Register as Citizen</span>
            <ArrowRight className="size-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginForm({ googleLogin }: LoginFormProps) {
  return (
    <Suspense
      fallback={
        <div className="h-48 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <LoginFormInner googleLogin={googleLogin} />
    </Suspense>
  );
}
