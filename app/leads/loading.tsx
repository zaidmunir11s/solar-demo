/** Skeleton shown while the board is being rendered on the server. */
export default function LeadsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200/70" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((column) => (
          <div
            key={column}
            className="h-48 animate-pulse rounded-2xl bg-slate-200/70"
          />
        ))}
      </div>
    </div>
  );
}
