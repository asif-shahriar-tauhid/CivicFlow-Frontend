"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";

const GoogleLoginComponent = () => {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.add({
        title: "Failed to login using google.",
        description: "Something went wrong. Please try again!",
        type: "error",
      });
      return;
    }
    googleLogin(
      { idToken },
      {
        onSuccess: () => {
          toast.add({
            title: "Logged In Successfully.",
            description: "Welcome back!!!",
            type: "success",
          });
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Failed to login using google.",
            description:
              err.message || "Something went wrong. Please try again!",
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Failed to login using google.",
      description: "Something went wrong. Please try again!",
      type: "error",
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
};

export default GoogleLoginComponent;
