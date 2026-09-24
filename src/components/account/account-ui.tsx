import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/dashboard/icon";
import type { Inquiry, Project } from "@/lib/account/types";

export const panelClass = "rounded-[22px] border border-[var(--line)] bg-surface p-5 sm:p-7";
export const actionClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs font-semibold text-white transition hover:bg-panel disabled:cursor-wait disabled:opacity-50";
export const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-background px-3.5 py-3 text-sm text-ink placeholder:text-[var(--muted)] focus:border-[var(--focus)] focus:bg-surface";

export function AccountHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-9"><div className="max-w-xl"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-[40px] sm:leading-tight">{title}</h1><p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{description}</p></div>{action}</div>;
}

export function LoadErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--line-dark)] bg-surface p-4" role="alert"><Icon className="mt-0.5 h-5 w-5 shrink-0" name="help" /><div><p className="text-sm font-semibold">Some information is unavailable.</p><p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{message}</p></div></div>;
}

export function EmptyState({ icon, title, children, action }: { icon: IconName; title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="flex flex-col items-center px-3 py-10 text-center"><span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--line)] bg-background"><Icon className="h-6 w-6 text-[var(--muted)]" name={icon} /></span><h3 className="text-base font-semibold tracking-tight">{title}</h3><div className="mt-2 max-w-sm text-xs leading-6 text-[var(--muted)]">{children}</div>{action ? <div className="mt-5">{action}</div> : null}</div>;
}

export function SectionTitle({ title, href, linkText = "View all" }: { title: string; href?: string; linkText?: string }) {
  return <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold tracking-tight">{title}</h2>{href ? <Link className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-ink" href={href}>{linkText}<Icon className="h-3.5 w-3.5" name="arrow-right" /></Link> : null}</div>;
}

const statusLabels: Record<Project["status"] | Inquiry["status"], string> = {
  draft: "Draft", active: "Active", paused: "Paused", completed: "Completed", archived: "Archived", new: "Received", "in-progress": "In progress", resolved: "Resolved", spam: "Closed",
};

export function StatusBadge({ status }: { status: Project["status"] | Inquiry["status"] }) {
  const dark = status === "active" || status === "in-progress";
  return <span className={"inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium " + (dark ? "bg-ink text-white" : "border border-[var(--line)] bg-background text-[var(--muted)]")}><span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />{statusLabels[status]}</span>;
}

export function accountDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return <ul className="divide-y divide-[var(--line)]">{projects.map((project) => <li className="flex items-start gap-3 py-5 first:pt-0 last:pb-0 sm:gap-4" key={project.id}><span className="mt-0.5 hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-background sm:grid"><Icon className="h-5 w-5 text-[var(--muted)]" name="projects" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="break-words text-sm font-semibold [overflow-wrap:anywhere]">{project.name}</h3><StatusBadge status={project.status} /></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-5 text-[var(--muted)]"><span>Updated {accountDate(project.updated_at)}</span>{project.custom_domain ? <span className="break-all">{project.custom_domain}</span> : <span>No domain connected</span>}</div></div></li>)}</ul>;
}

export function RequestList({ inquiries, compact = false }: { inquiries: Inquiry[]; compact?: boolean }) {
  return <ul className="divide-y divide-[var(--line)]">{inquiries.map((inquiry) => <li className="py-5 first:pt-0 last:pb-0" key={inquiry.id}><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere]">{inquiry.subject}</h3><StatusBadge status={inquiry.status} /></div>{compact ? null : <p className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-[var(--muted)] [overflow-wrap:anywhere]">{inquiry.message}</p>}<p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">Submitted {accountDate(inquiry.created_at)}{inquiry.updated_at !== inquiry.created_at ? ` · Updated ${accountDate(inquiry.updated_at)}` : ""}</p></li>)}</ul>;
}
