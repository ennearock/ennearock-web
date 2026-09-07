"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "./icon";

export type DashboardIdentity = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

type DashboardShellProps = {
  children: ReactNode;
  user: DashboardIdentity;
  logoutAction: () => Promise<void>;
};

const navigation: {
  href: string;
  label: string;
  description: string;
  icon: IconName;
}[] = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Publishing summary",
    icon: "overview",
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    description: "Projects and case studies",
    icon: "projects",
  },
  {
    href: "/dashboard/homepage",
    label: "Homepage",
    description: "Page sections and copy",
    icon: "templates",
  },
  {
    href: "/dashboard/settings",
    label: "Site settings",
    description: "Brand and contact details",
    icon: "settings",
  },
];

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 grid-cols-3 gap-[3px] rounded-[11px] bg-[#c9f26b] p-[7px]"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <span
            className={
              "rounded-[1px] bg-[#11130f] " +
              (index === 8 ? "translate-x-[2px]" : "")
            }
            key={index}
          />
        ))}
      </span>
      <span>
        <span className="block text-[18px] font-semibold tracking-[-0.04em] text-white">
          ennearock
        </span>
        <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.19em] text-white/35">
          Website admin
        </span>
      </span>
    </span>
  );
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "Admin";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SidebarContent({
  pathname,
  closeNav,
  logoutAction,
  user,
}: {
  pathname: string;
  closeNav: () => void;
  logoutAction: () => Promise<void>;
  user: DashboardIdentity;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[78px] items-center justify-between px-6">
        <Link
          aria-label="Ennearock website admin"
          href="/dashboard"
          onClick={closeNav}
        >
          <BrandMark />
        </Link>
        <button
          aria-label="Close navigation"
          className="grid h-9 w-9 place-items-center rounded-xl text-white/55 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={closeNav}
          type="button"
        >
          <Icon className="h-5 w-5" name="close" />
        </button>
      </div>

      <div className="mx-4 mt-2 rounded-[17px] border border-white/[0.08] bg-white/[0.045] p-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#c9f26b] text-[#11130f]">
            <Icon className="h-[17px] w-[17px]" name="globe" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              Ennearock website
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[9px] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9f26b]" />
              Production workspace
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="mt-7 px-4">
        <p className="mb-3 px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
          Content
        </p>
        <div className="space-y-1">
          {navigation.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={
                  "group flex min-h-12 items-center gap-3 rounded-[12px] px-3 text-[13px] font-medium transition " +
                  (active
                    ? "bg-[#c9f26b] text-[#11130f]"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white")
                }
                href={item.href}
                key={item.href}
                onClick={closeNav}
              >
                <Icon
                  className={
                    "h-[18px] w-[18px] " +
                    (active
                      ? "text-[#11130f]"
                      : "text-white/40 group-hover:text-white")
                  }
                  name={item.icon}
                />
                <span>
                  <span className="block">{item.label}</span>
                  <span
                    className={
                      "mt-0.5 hidden text-[8px] font-normal xl:block " +
                      (active ? "text-black/50" : "text-white/25")
                    }
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto p-4">
        <Link
          className="group mb-3 block rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-4 transition hover:bg-white/[0.07]"
          href="/"
          target="_blank"
        >
          <span className="flex items-center justify-between">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c9f26b] text-[#11130f]">
              <Icon className="h-4 w-4" name="external" />
            </span>
            <span className="h-2 w-2 rounded-full bg-[#c9f26b] shadow-[0_0_0_4px_rgba(201,242,107,.1)]" />
          </span>
          <p className="mt-3 text-xs font-semibold text-white">
            View live website
          </p>
          <p className="mt-1 text-[10px] leading-4 text-white/38">
            Open the public site in a new tab.
          </p>
        </Link>

        <div className="flex items-center gap-3 rounded-[14px] px-2 py-2">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              src={user.avatarUrl}
            />
          ) : (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ece6d7] text-xs font-bold text-[#22251f]">
              {getInitials(user.name, user.email)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-[10px] text-white/35">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              aria-label="Sign out"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/[0.06] hover:text-white"
              title="Sign out"
              type="submit"
            >
              <Icon className="h-4 w-4" name="logout" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  logoutAction,
  user,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  const current = navigation.find((item) =>
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href),
  );
  const filteredSearch = useMemo(
    () =>
      navigation.filter((item) =>
        (item.label + " " + item.description)
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="min-h-screen w-full bg-[#f3f1e9] text-[#11130f]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[276px] bg-[#11130f] lg:block">
        <SidebarContent
          closeNav={() => setNavOpen(false)}
          logoutAction={logoutAction}
          pathname={pathname}
          user={user}
        />
      </aside>

      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
            type="button"
          />
          <aside className="relative h-full w-[min(86vw,310px)] bg-[#11130f] shadow-2xl">
            <SidebarContent
              closeNav={() => setNavOpen(false)}
              logoutAction={logoutAction}
              pathname={pathname}
              user={user}
            />
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen lg:pl-[276px]">
        <header className="sticky top-0 z-40 flex h-[70px] items-center border-b border-[#dedbd1] bg-[#f3f1e9]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <button
            aria-label="Open navigation"
            className="mr-3 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d9d6cc] bg-white text-[#35382f] lg:hidden"
            onClick={() => setNavOpen(true)}
            type="button"
          >
            <Icon className="h-5 w-5" name="menu" />
          </button>
          <div className="hidden min-w-[118px] sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8b8f86]">
              Website admin
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#2a2d27]">
              {current?.label ?? "Dashboard"}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[390px] sm:mx-5">
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f928a]"
              name="search"
            />
            <input
              aria-label="Search admin sections"
              className="h-10 w-full rounded-[12px] border border-[#dedbd1] bg-white/75 pl-10 pr-4 text-xs outline-none transition placeholder:text-[#999c94] focus:border-[#8a9d65] focus:bg-white focus:ring-4 focus:ring-[#c9f26b]/20"
              onBlur={() =>
                window.setTimeout(() => setSearchFocused(false), 120)
              }
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Jump to a section"
              type="search"
              value={query}
            />

            {searchFocused && query ? (
              <div className="absolute left-0 right-0 top-[46px] overflow-hidden rounded-[16px] border border-[#d9d6cc] bg-white p-2 shadow-[0_18px_60px_rgba(32,35,29,.14)]">
                {filteredSearch.length ? (
                  filteredSearch.map((item) => (
                    <Link
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#f4f2eb]"
                      href={item.href}
                      key={item.href}
                    >
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8d9088]">
                        Open
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-[#8d9088]">
                    No admin section found
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="hidden h-10 items-center gap-2 rounded-[11px] bg-[#11130f] px-4 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2a2e25] md:flex"
              href="/dashboard/portfolio/new"
            >
              <Icon className="h-4 w-4" name="plus" /> New project
            </Link>
            <Link
              aria-label="View live website"
              className="grid h-10 w-10 place-items-center rounded-[11px] border border-[#dedbd1] bg-white/75 text-[#5e6259] hover:bg-white hover:text-[#11130f]"
              href="/"
              target="_blank"
            >
              <Icon className="h-[18px] w-[18px]" name="external" />
            </Link>
            <div className="hidden h-10 w-10 place-items-center rounded-full bg-[#dfd8c8] text-[10px] font-bold text-[#30332d] sm:grid">
              {getInitials(user.name, user.email)}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 pb-28 sm:p-7 sm:pb-28 lg:p-9 lg:pb-28">
          {children}
        </main>
      </div>
    </div>
  );
}
