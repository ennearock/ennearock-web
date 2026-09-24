import Link from "next/link";
import { Icon, type IconName } from "@/components/dashboard/icon";
import { LogoMark } from "@/components/logo";
import { EmptyState, LoadErrorBanner, panelClass, ProjectList, RequestList, SectionTitle } from "@/components/account/account-ui";
import { getAccountData } from "@/lib/account/data";

export default async function AccountPage() {
  const { user, projects, inquiries, loadError } = await getAccountData();
  const firstName = user.fullName?.trim().split(/\s+/)[0];
  const stats: { label: string; value: number; icon: IconName; href: string }[] = [
    { label: "Recent projects", value: projects.length, icon: "projects", href: "/account/projects" },
    { label: "Active (recent)", value: projects.filter((project) => project.status === "active").length, icon: "bolt", href: "/account/projects" },
    { label: "Open requests (recent)", value: inquiries.filter((inquiry) => inquiry.status === "new" || inquiry.status === "in-progress").length, icon: "mail", href: "/account/requests" },
  ];

  return <div className="space-y-6">
    <section className="relative isolate overflow-hidden rounded-[24px] bg-ink p-6 text-white sm:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[440px] w-[440px] rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-[310px] w-[310px] rounded-full border border-white/10" />
      <div className="flex items-start justify-between gap-5"><div className="min-w-0 max-w-xl"><p className="mb-5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">Ennearock / Your client space</p><h1 className="break-words text-3xl font-medium tracking-[-0.055em] [overflow-wrap:anywhere] sm:text-[42px] sm:leading-tight">{firstName ? `Welcome, ${firstName}.` : "Welcome to your space."}</h1><p className="mt-4 max-w-md text-sm leading-6 text-white/60">A clear place for your next idea. Organize your projects, submit a request and keep your details up to date.</p></div><div className="hidden shrink-0 sm:block"><LogoMark size={64} /></div></div>
      <div className="mt-7 flex flex-wrap gap-3"><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-ink hover:bg-white" href="/account/projects">My projects<Icon className="h-4 w-4" name="arrow-right" /></Link><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-xs font-medium text-white hover:bg-white/10" href="/account/requests">Send a request</Link></div>
    </section>
    <LoadErrorBanner message={loadError} />
    {!loadError ? <>
      <div className="grid gap-3 sm:grid-cols-3">{stats.map((stat) => <Link className="group rounded-[20px] border border-[var(--line)] bg-surface p-5 transition hover:border-[var(--muted)]" href={stat.href} key={stat.label}><div className="flex items-center justify-between"><span className="text-xs text-[var(--muted)]">{stat.label}</span><Icon className="h-4 w-4 text-[var(--muted)]" name={stat.icon} /></div><p className="mt-5 text-4xl font-medium tracking-[-0.06em]">{stat.value}</p></Link>)}</div>
      <p className="text-[11px] text-[var(--muted)]">Counts are based on your latest 100 projects and 100 requests.</p>
      <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_1fr]">
        <section className={panelClass}><SectionTitle href="/account/projects" title="Recent projects" />{projects.length ? <ProjectList projects={projects.slice(0, 4)} /> : <EmptyState icon="projects" title="Room for your next idea." action={<Link className="inline-flex items-center gap-2 text-xs font-semibold" href="/account/projects">Create your first draft<Icon className="h-4 w-4" name="arrow-right" /></Link>}>Start with a project name. Your private drafts will appear here, ready for your next step.</EmptyState>}</section>
        <section className={panelClass}><SectionTitle href="/account/requests" title="Recent requests" />{inquiries.length ? <RequestList compact inquiries={inquiries.slice(0, 4)} /> : <EmptyState icon="mail" title="Nothing in the queue." action={<Link className="inline-flex items-center gap-2 text-xs font-semibold" href="/account/requests">Make a request<Icon className="h-4 w-4" name="arrow-right" /></Link>}>Have a question or a project in mind? Submit a request and find its status here.</EmptyState>}</section>
      </div>
    </> : null}
    <section className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] border border-[var(--line)] px-5 py-5 sm:px-7"><div className="flex items-start gap-3"><Icon className="mt-1 h-5 w-5 shrink-0 text-[var(--muted)]" name="users" /><div><h2 className="text-sm font-semibold">Make it yours.</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Add your name, company and website to your profile.</p></div></div><Link className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold" href="/account/profile">Edit profile<Icon className="h-4 w-4" name="arrow-right" /></Link></section>
  </div>;
}
