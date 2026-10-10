import { Spinner } from "@/components/ui/spinner";

export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <Spinner className="size-6 text-primary" />
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          Loading civic resources...
        </p>
      </div>
    </div>
  );
}
