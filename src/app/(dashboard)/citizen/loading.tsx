export default function CitizenLoading() {
  return (
    <div className="flex flex-col gap-8 pb-16 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-muted" />
            <div className="h-3 w-36 bg-muted rounded" />
          </div>
          <div className="h-8 w-72 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted/60 rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-24 bg-muted rounded-full" />
          <div className="h-9 w-40 bg-muted rounded-full" />
        </div>
      </div>

      {/* Metric Chips Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Search & Tabs Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="h-10 w-full max-w-md bg-muted rounded-full" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-muted rounded-full" />
          <div className="h-8 w-24 bg-muted rounded-full" />
          <div className="h-8 w-28 bg-muted rounded-full" />
        </div>
      </div>

      {/* Ticket List Cards Skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded-full" />
              <div className="h-4 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-5 w-2/3 bg-muted rounded" />
            <div className="h-3.5 w-1/2 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
