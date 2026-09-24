"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/logo";
import { Icon, type IconName } from "@/components/dashboard/icon";

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: "/account", label: "Overview", icon: "overview" },
  { href: "/account/projects", label: "My projects", icon: "projects" },
  { href: "/account/requests", label: "Requests", icon: "mail" },
  { href: "/account/profile", label: "Profile", icon: "users" },
];

type AccountShellProps = {
  children: ReactNode;
  user: { fullName: string | null; email: string; isAdmin: boolean };
  logoutAction: () => Promise<void>;
};

function Navigation({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  return (
    <nav aria-label="Client navigation" className={mobile ? "grid grid-cols-2 gap-1 sm:grid-cols-4" : "space-y-1.5"}>
      {navigation.map((item) => {
        const active = item.href === "/account" ? pathname === item.href : pathname.startsWith(item.href + "/") || pathname === item.href;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={"flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-xs font-medium transition " + (active ? "bg-accent text-ink" : "text-white/65 hover:bg-white/10 hover:text-white")}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4 shrink-0" name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountShell({ children, user, logoutAction }: AccountShellProps) {
  const pathname = usePathname();
  const current = navigation.find((item) => item.href === pathname);
  const displayName = user.fullName || user.email.split("@")[0] || "Your account";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-ink">
      <a className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-white px-4 py-3 text-sm shadow-lg focus:translate-y-0" href="#account-content">Skip to content</a>
      <aside className="fixed inset-y-0 left-0 hidden w-[252px] flex-col overflow-y-auto bg-ink px-5 py-7 text-white lg:flex">
        <Link aria-label="Ennearock client space" className="px-1" href="/account"><BrandLockup inverse subtitle="Client space" /></Link>
        <div className="mb-5 mt-12 px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">Your workspace</div>
        <Navigation pathname={pathname} />
        <div className="mt-auto pt-10">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <Icon className="mb-3 h-5 w-5 text-accent" name="lock" />
            <p className="text-xs font-medium">Your own space.</p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/55">Keep your projects, requests and account details together.</p>
          </div>
          {user.isAdmin ? <Link className="mb-2 flex min-h-10 items-center gap-2 px-2 text-xs text-white/70 hover:text-white" href="/dashboard"><Icon className="h-4 w-4" name="shield" />Website administration</Link> : null}
          <Link className="flex min-h-10 items-center gap-2 px-2 text-xs text-white/70 hover:text-white" href="/"><Icon className="h-4 w-4" name="external" />Back to website</Link>
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-ink">{initials}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{displayName}</p><p className="mt-1 truncate text-[10px] text-white/50">{user.email}</p></div>
          </div>
          <form action={logoutAction} className="mt-3"><button className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-xs text-white/65 hover:bg-white/10 hover:text-white" type="submit"><Icon className="h-4 w-4" name="logout" />Sign out</button></form>
        </div>
      </aside>
      <div className="lg:pl-[252px]">
        <header className="border-b border-[var(--line)] bg-ink px-4 pb-3 pt-5 text-white sm:px-7 lg:hidden">
          <div className="mb-5 flex items-center justify-between gap-4"><Link aria-label="Ennearock client space" href="/account"><BrandLockup inverse subtitle="Client space" /></Link><form action={logoutAction}><button aria-label="Sign out" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/15 hover:bg-white/10" title="Sign out" type="submit"><Icon name="logout" /></button></form></div>
          <Navigation mobile pathname={pathname} />
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 px-3 text-[11px] text-white/65"><Link className="py-2 hover:text-white" href="/">Back to website</Link>{user.isAdmin ? <Link className="py-2 hover:text-white" href="/dashboard">Website administration</Link> : null}</div>
        </header>
        <div className="hidden h-[78px] items-center justify-between gap-5 border-b border-[var(--line)] px-9 lg:flex">
          <p className="text-xs text-[var(--muted)]">Client space <span className="mx-3 text-[var(--line)]">/</span><span className="font-medium text-ink">{current?.label ?? "Your account"}</span></p>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]"><Icon className="h-3.5 w-3.5" name="lock" />Private workspace</span>
        </div>
        <main className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-7 sm:py-10 lg:px-9" id="account-content" tabIndex={-1}>{children}</main>
        <footer className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 pb-7 pt-5 text-[10px] text-[var(--muted)] sm:px-7 lg:px-9"><span>Ennearock / Client space</span><Link className="underline underline-offset-4 hover:text-ink" href="/privacy">Privacy policy</Link></footer>
      </div>
    </div>
  );
}
