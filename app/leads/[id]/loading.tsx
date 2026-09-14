/**
 * Shown the moment a lead link is clicked, so navigation feels instant even
 * though the page itself is rendered per request.
 */
export default function LeadDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200/70" />
    </div>
  );
}
