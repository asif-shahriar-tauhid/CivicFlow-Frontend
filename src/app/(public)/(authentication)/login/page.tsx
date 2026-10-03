import AuthLayout from "@/components/layouts/public/AuthLayout";
import LoginForm from "@/components/form/login-form";

export const metadata = {
  title: "Sign In — CivicFlow",
  description: "Sign in to your CivicFlow municipal account.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in with your email or select a pre-seeded role to access your civic portal."
      mode="login"
    >
      <LoginForm />
    </AuthLayout>
  );
}
