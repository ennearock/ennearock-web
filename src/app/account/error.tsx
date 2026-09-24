"use client";

import Link from "next/link";
import { Icon } from "@/components/dashboard/icon";

export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="rounded-[24px] border border-[var(--line)] bg-surface p-7 sm:p-10"><Icon className="mb-6 h-8 w-8 text-[var(--muted)]" name="help" /><p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Client space</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">We couldn’t load this page.</h1><p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">Please try again. If a form was being submitted, check your projects or requests before sending it again.</p><div className="mt-7 flex flex-wrap gap-3"><button className="min-h-11 rounded-xl bg-ink px-5 text-xs font-semibold text-white hover:bg-panel" onClick={reset} type="button">Try again</button><Link className="inline-flex min-h-11 items-center rounded-xl border border-[var(--line)] px-5 text-xs font-medium" href="/">Back to website</Link></div></section>;
}
