export default function AccountLoading() {
  return <div aria-busy="true" aria-label="Loading your client space" className="space-y-6" role="status"><p className="text-sm text-[var(--muted)]">Loading your workspace…</p><div aria-hidden="true" className="h-52 rounded-[24px] bg-surface-muted motion-safe:animate-pulse" /><div aria-hidden="true" className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div className="h-32 rounded-[20px] bg-surface-muted motion-safe:animate-pulse" key={item} />)}</div></div>;
}
