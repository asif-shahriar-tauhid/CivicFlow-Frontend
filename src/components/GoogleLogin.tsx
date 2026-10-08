"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMe } from "@/api/auth.api";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useGoogleOAuth } from "@/hooks";
import { decodeJwtPayload, resolvePostAuthUrl } from "@/lib/authUtils";
import type { AuthTokens } from "@/types/auth.types";
import type { ApiResponse } from "@/types/dashboard.types";

function GoogleLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const queryClient = useQueryClient();
  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      gooeyToast.error("Google Sign-In Incomplete", {
        description:
          "Google did not return a valid credential token. Please retry.",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async (res: ApiResponse<AuthTokens>) => {
          gooeyToast.success("Authentication Verified", {
            description: "Signed in via Google OAuth successfully.",
          });

          const token = res?.data?.accessToken;
          const decodedJwt = decodeJwtPayload(token);
          let tokenRole = decodedJwt?.role || "CITIZEN";

          // Hydrate user profile in query cache immediately to eliminate RoleGuard race conditions
          try {
            const meRes = await getMe();
            queryClient.setQueryData(["user"], meRes);
            if (meRes?.data?.role) {
              tokenRole = meRes.data.role;
            }
          } catch {
            // Proceed with decoded token role
          }
          queryClient.invalidateQueries({ queryKey: ["user"] });

          const targetUrl = resolvePostAuthUrl({
            accessToken: token,
            userRole: tokenRole,
            redirectUrl,
          });

          // Navigate cleanly to /citizen or requested destination
          router.push(targetUrl);
          router.refresh();
        },
        onError: (err: unknown) => {
          const apiErr = err as {
            message?: string;
            data?: { message?: string };
          };
          gooeyToast.error("Google Sign-In Failed", {
            description:
              apiErr?.data?.message ||
              apiErr?.message ||
              "Could not complete Google sign-in. Please try again.",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    gooeyToast.error("Google Sign-In Cancelled", {
      description: "Google OAuth dialog closed or encountered an error.",
    });
  };

  return (
    <GoogleLogin
      theme="outline"
      text="continue_with"
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
}

const GoogleLoginComponent = () => {
  return (
    <Suspense
      fallback={
        <div className="h-10 w-full animate-pulse bg-muted/40 rounded-4xl" />
      }
    >
      <GoogleLoginInner />
    </Suspense>
  );
};

export default GoogleLoginComponent;
