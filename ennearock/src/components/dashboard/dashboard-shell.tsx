"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { Icon, type IconName } from "./icon";

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/projects", label: "Projects", icon: "projects" },
  { href: "/dashboard/templates", label: "Templates", icon: "templates" },
  { href: "/dashboard/billing", label: "Billing", icon: "billing" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

const searchItems = [
  { label: "Meridian Finance", meta: "Project", href: "/dashboard/projects" },
  { label: "Northstar Commerce", meta: "Project", href: "/dashboard/projects" },
  { label: "Horizon SaaS", meta: "Template", href: "/dashboard/templates" },
  { label: "Invoices & billing", meta: "Setting", href: "/dashboard/billing" },
];

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="grid h-9 w-9 grid-cols-3 gap-[3px] rounded-[11px] bg-[#c9f26b] p-[7px]" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} className={`rounded-[1px] bg-[#11130f] ${index === 8 ? "translate-x-[2px]" : ""}`} />
        ))}
      </span>
      <span className="text-[18px] font-semibold tracking-[-0.04em] text-white">ennearock</span>
    </span>
  );
}

function SidebarContent({ pathname, closeNav }: { pathname: string; closeNav: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[78px] items-center justify-between px-6">
        <Link href="/dashboard" onClick={closeNav} aria-label="Ennearock dashboard">
          <BrandMark />
        </Link>
        <button
          onClick={closeNav}
          className="grid h-9 w-9 place-items-center rounded-xl text-white/55 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close navigation"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-4 mt-2 rounded-[17px] border border-white/[0.08] bg-white/[0.045] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">Ennearock Studio</p>
            <p className="mt-1 text-[10px] text-white/40">Pro workspace</p>
          </div>
          <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/35 hover:bg-white/[0.07] hover:text-white" aria-label="Switch workspace">
            <Icon name="chevron-down" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="mt-7 px-4" aria-label="Dashboard navigation">
        <p className="mb-3 px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">Workspace</p>
        <div className="space-y-1">
          {navigation.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeNav}
                aria-current={active ? "page" : undefined}
                className={`group flex h-11 items-center gap-3 rounded-[12px] px-3 text-[13px] font-medium transition ${
                  active ? "bg-[#c9f26b] text-[#11130f]" : "text-white/52 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon name={item.icon} className={`h-[18px] w-[18px] ${active ? "text-[#11130f]" : "text-white/40 group-hover:text-white"}`} />
                {item.label}
                {item.label === "Projects" ? (
                  <span className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[9px] ${active ? "bg-black/10" : "bg-white/[0.07] text-white/35"}`}>04</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto p-4">
        <div className="mb-3 rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-4">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c9f26b] text-[#11130f]">
            <Icon name="sparkles" className="h-4 w-4" />
          </span>
          <p className="mt-3 text-xs font-semibold text-white">Invite your team</p>
          <p className="mt-1 text-[10px] leading-4 text-white/38">Two seats are still available on your plan.</p>
          <button className="mt-3 text-[10px] font-semibold text-[#c9f26b] hover:text-white">Send invite →</button>
        </div>
        <div className="flex items-center gap-3 rounded-[14px] px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ece6d7] text-xs font-bold text-[#22251f]">ZM</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Zakaria B.</p>
            <p className="truncate text-[10px] text-white/35">zakaria@ennearock.com</p>
          </div>
          <Link href="/login" className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/[0.06] hover:text-white" aria-label="Sign out">
            <Icon name="logout" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  const current = navigation.find((item) => item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href));
  const filteredSearch = searchItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen w-full bg-[#f3f1e9] text-[#11130f]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[276px] bg-[#11130f] lg:block">
        <SidebarContent pathname={pathname} closeNav={() => setNavOpen(false)} />
      </aside>

      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNavOpen(false)} aria-label="Close navigation overlay" />
          <aside className="relative h-full w-[min(86vw,310px)] bg-[#11130f] shadow-2xl">
            <SidebarContent pathname={pathname} closeNav={() => setNavOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen lg:pl-[276px]">
        <header className="sticky top-0 z-40 flex h-[70px] items-center border-b border-[#dedbd1] bg-[#f3f1e9]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <button
            onClick={() => setNavOpen(true)}
            className="mr-3 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d9d6cc] bg-white text-[#35382f] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <div className="hidden min-w-[110px] sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8b8f86]">Workspace</p>
            <p className="mt-0.5 text-xs font-semibold text-[#2a2d27]">{current?.label ?? "Dashboard"}</p>
          </div>

          <div className="relative mx-auto w-full max-w-[390px] sm:mx-5">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f928a]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              placeholder="Search workspace"
              className="h-10 w-full rounded-[12px] border border-[#dedbd1] bg-white/75 pl-10 pr-12 text-xs outline-none transition placeholder:text-[#999c94] focus:border-[#8a9d65] focus:bg-white focus:ring-4 focus:ring-[#c9f26b]/20"
              aria-label="Search workspace"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[#dedbd1] bg-[#f7f5ef] px-1.5 py-0.5 font-mono text-[8px] text-[#969990]">⌘ K</span>

            {searchFocused && query ? (
              <div className="absolute left-0 right-0 top-[46px] overflow-hidden rounded-[16px] border border-[#d9d6cc] bg-white p-2 shadow-[0_18px_60px_rgba(32,35,29,.14)]">
                {filteredSearch.length ? filteredSearch.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#f4f2eb]">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8d9088]">{item.meta}</span>
                  </Link>
                )) : <p className="px-3 py-4 text-center text-xs text-[#8d9088]">No workspace results</p>}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/projects" className="hidden h-10 items-center gap-2 rounded-[11px] bg-[#11130f] px-4 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2a2e25] md:flex">
              <Icon name="plus" className="h-4 w-4" /> New project
            </Link>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative grid h-10 w-10 place-items-center rounded-[11px] border border-[#dedbd1] bg-white/75 text-[#5e6259] hover:bg-white hover:text-[#11130f]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Icon name="bell" className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e06d45] ring-2 ring-white" />
              </button>
              {notificationsOpen ? (
                <div className="absolute right-0 top-12 w-[min(88vw,330px)] rounded-[18px] border border-[#d9d6cc] bg-white p-2 shadow-[0_18px_60px_rgba(32,35,29,.16)]">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs font-semibold">Notifications</p>
                    <button onClick={() => setNotificationsOpen(false)} className="text-[10px] font-medium text-[#687752]">Mark as read</button>
                  </div>
                  {[
                    ["Client feedback received", "Meridian Finance · 8m"],
                    ["Milestone approved", "Northstar Commerce · 2h"],
                    ["Invoice #1048 paid", "€4,800 · Yesterday"],
                  ].map(([title, meta], index) => (
                    <div key={title} className="flex gap-3 rounded-xl px-3 py-3 hover:bg-[#f5f3ed]">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-[#91b44d]" : "bg-[#cbc9c0]"}`} />
                      <div><p className="text-xs font-medium">{title}</p><p className="mt-1 text-[10px] text-[#8a8e85]">{meta}</p></div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="hidden h-10 w-10 place-items-center rounded-full bg-[#dfd8c8] text-[10px] font-bold text-[#30332d] sm:grid">ZM</div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 pb-12 sm:p-7 lg:p-9 lg:pb-16">{children}</main>
      </div>
    </div>
  );
}
