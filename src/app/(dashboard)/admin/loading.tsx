export default function AdminLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-64 bg-muted rounded-lg" />
            <div className="h-5 w-24 bg-muted/60 rounded-full" />
          </div>
          <div className="h-4 w-96 bg-muted/50 rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-36 bg-muted rounded-full" />
          <div className="h-8 w-32 bg-muted rounded-full" />
          <div className="h-8 w-32 bg-muted rounded-full" />
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="size-8 rounded-lg bg-muted/70" />
            </div>
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-3 w-36 bg-muted/50 rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="h-5 w-44 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-muted rounded-full" />
            <div className="h-7 w-20 bg-muted rounded-full" />
          </div>
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/10 p-3.5"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted/60 rounded" />
              </div>
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-7 w-20 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
