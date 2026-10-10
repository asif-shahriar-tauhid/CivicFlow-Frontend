import Logo from "@/asset/svg/Logo";
import { Spinner } from "@/components/ui/spinner";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="relative flex items-center justify-center animate-pulse">
          <Logo size={52} />
        </div>
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Spinner className="size-4 text-primary" />
          <span>Connecting to CivicFlow...</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Loading municipal portal telemetry and operational services.
        </p>
      </div>
    </div>
  );
}
