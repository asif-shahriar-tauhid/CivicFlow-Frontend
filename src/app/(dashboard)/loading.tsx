export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="h-6 w-48 rounded-lg bg-muted/60" />
          <div className="h-4 w-72 rounded-lg bg-muted/40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 rounded-full bg-muted/50" />
          <div className="h-9 w-32 rounded-full bg-muted/60" />
        </div>
      </div>

      {/* KPI Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-muted/50" />
              <div className="size-6 rounded-lg bg-muted/60" />
            </div>
            <div className="h-7 w-16 rounded bg-muted/70" />
            <div className="h-2.5 w-28 rounded bg-muted/40" />
          </div>
        ))}
      </div>

      {/* Filters & Search Toolbar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3.5 sm:p-4">
        <div className="h-9 w-full max-w-xs rounded-full bg-muted/50" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-full bg-muted/40" />
          <div className="h-9 w-24 rounded-full bg-muted/40" />
        </div>
      </div>

      {/* Main Content / Table Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="h-4 w-36 rounded bg-muted/60" />
          <div className="h-3 w-24 rounded bg-muted/40" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/10 p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-muted/50" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-48 rounded bg-muted/60" />
                  <div className="h-2.5 w-28 rounded bg-muted/40" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 rounded-full bg-muted/50" />
                <div className="h-5 w-16 rounded-full bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
