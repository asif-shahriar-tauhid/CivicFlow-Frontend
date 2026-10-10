export default function StaffLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse select-none p-4 sm:p-6 lg:p-8">
      {/* Staff Field Operations Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-muted rounded-lg" />
          <div className="h-4 w-80 bg-muted/60 rounded" />
        </div>
        <div className="h-9 w-28 bg-muted rounded-full" />
      </div>

      {/* Queue Tabs Skeleton */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card w-fit">
        <div className="h-8 w-36 bg-muted rounded-lg" />
        <div className="h-8 w-44 bg-muted/60 rounded-lg" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="h-9 w-full sm:w-72 bg-muted/70 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted/60 rounded-full" />
          <div className="h-9 w-24 bg-muted/60 rounded-full" />
        </div>
      </div>

      {/* Field Incident Cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-28 bg-muted rounded-full" />
                <div className="h-5 w-20 bg-muted/80 rounded-full" />
              </div>
              <div className="h-4 w-28 bg-muted/60 rounded" />
            </div>
            <div className="h-5 w-3/4 max-w-lg bg-muted rounded" />
            <div className="h-4 w-1/2 max-w-sm bg-muted/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
