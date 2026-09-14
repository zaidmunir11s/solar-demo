/**
 * Footer for the authenticated app.
 * Both lines are plain static text, as required by the assignment.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-0.5 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Zaid Munir</p>
        <p>14-09-2026</p>
      </div>
    </footer>
  );
}
