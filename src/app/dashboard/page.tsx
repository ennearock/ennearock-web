import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";
import { SetupNotice } from "@/components/dashboard/editor-fields";
import {
  getDashboardPortfolio,
  getDashboardSiteContent,
} from "./data";

export const metadata: Metadata = {
  title: "Overview",
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not published yet";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardOverviewPage() {
  const [portfolio, site] = await Promise.all([
    getDashboardPortfolio(),
    getDashboardSiteContent(),
  ]);
  const published = portfolio.projects.filter((project) => project.published);
  const drafts = portfolio.projects.length - published.length;
  const featured = published.filter((project) => project.featured).length;
  const setupMessage = portfolio.setupMessage ?? site.setupMessage;

  const stats: {
    label: string;
    value: string;
    note: string;
    icon: IconName;
    href: string;
  }[] = [
    {
      label: "Portfolio projects",
      value: String(portfolio.projects.length).padStart(2, "0"),
      note: published.length + " live on the site",
      icon: "projects",
      href: "/dashboard/portfolio",
    },
    {
      label: "Drafts",
      value: String(drafts).padStart(2, "0"),
      note: drafts ? "Waiting for review" : "Everything is published",
      icon: "edit",
      href: "/dashboard/portfolio?status=draft",
    },
    {
      label: "Homepage features",
      value: String(featured).padStart(2, "0"),
      note: "Selected portfolio stories",
      icon: "sparkles",
      href: "/dashboard/portfolio",
    },
    {
      label: "Homepage sections",
      value: "10",
      note: "Structured and editable",
      icon: "templates",
      href: "/dashboard/homepage",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Website control room"
        title="Keep Ennearock current."
        description="Edit your portfolio, refine the homepage, and publish changes without touching the codebase."
        action={
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#11130f] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2e25]"
            href="/dashboard/portfolio/new"
          >
            <Icon className="h-4 w-4" name="plus" /> Add project
          </Link>
        }
      />

      <SetupNotice message={setupMessage} />

      <section
        aria-label="Website content summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <Link
            className="group rounded-[20px] border border-[#dedbd1] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cbc8bd] hover:shadow-[0_14px_40px_rgba(41,44,37,.07)]"
            href={stat.href}
            key={stat.label}
          >
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#f1efe8] text-[#62665c] transition group-hover:bg-[#c9f26b] group-hover:text-[#11130f]">
                <Icon className="h-[18px] w-[18px]" name={stat.icon} />
              </span>
              <Icon
                className="h-4 w-4 text-[#b0b2ab] transition group-hover:translate-x-0.5 group-hover:text-[#11130f]"
                name="arrow-right"
              />
            </div>
            <p className="mt-6 text-[28px] font-semibold tracking-[-0.05em] text-[#11130f]">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[#454940]">{stat.label}</p>
            <p className="mt-1 text-[9px] text-[#969990]">{stat.note}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.72fr)]">
        <section className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
          <div className="flex items-center justify-between border-b border-[#e6e3da] p-5 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold">Portfolio at a glance</h2>
              <p className="mt-1 text-[10px] text-[#8d9088]">
                Most recently updated projects
              </p>
            </div>
            <Link
              className="flex items-center gap-1 text-[10px] font-semibold text-[#5c6e45] hover:text-[#11130f]"
              href="/dashboard/portfolio"
            >
              Manage all <Icon className="h-3.5 w-3.5" name="arrow-right" />
            </Link>
          </div>

          {portfolio.projects.length ? (
            <div className="divide-y divide-[#eeece6]">
              {portfolio.projects.slice(0, 5).map((project) => (
                <div
                  className="flex items-center gap-3 px-5 py-4 hover:bg-[#faf9f5] sm:px-6"
                  key={project.id}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] text-[9px] font-bold"
                    style={{ backgroundColor: project.accent }}
                  >
                    {project.name
                      .split(/\s+/)
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{project.name}</p>
                    <p className="mt-1 truncate text-[9px] text-[#969990]">
                      {project.category} · {project.tagline}
                    </p>
                  </div>
                  {project.featured ? (
                    <span className="hidden rounded-full bg-[#eef7dc] px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#4d692d] sm:inline-flex">
                      Featured
                    </span>
                  ) : null}
                  <span
                    className={
                      "rounded-full px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.08em] " +
                      (project.published
                        ? "bg-[#e5f3de] text-[#3e6b32]"
                        : "bg-[#ecebe6] text-[#64675f]")
                    }
                  >
                    {project.published ? "Live" : "Draft"}
                  </span>
                  <Link
                    aria-label={"Edit " + project.name}
                    className="grid h-8 w-8 place-items-center rounded-[9px] text-[#858980] hover:bg-[#f0eee8] hover:text-[#11130f]"
                    href={"/dashboard/portfolio/" + project.id}
                  >
                    <Icon className="h-4 w-4" name="edit" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-semibold">Your portfolio is ready for its first project.</p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-[#5c6e45]"
                href="/dashboard/portfolio/new"
              >
                Create a case study <Icon className="h-3.5 w-3.5" name="arrow-right" />
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-[22px] border border-[#dedbd1] bg-[#151813] p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.19em] text-white/35">
                Publishing status
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em]">
                Website content
              </h2>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#c9f26b] text-[#11130f]">
              <Icon className="h-4 w-4" name="globe" />
            </span>
          </div>

          <div className="mt-8 rounded-[16px] border border-white/[0.08] bg-white/[0.045] p-4">
            <p className="text-[10px] text-white/42">Last homepage update</p>
            <p className="mt-2 text-xs font-semibold">{formatDate(site.updatedAt)}</p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Portfolio data", setupMessage ? "Setup needed" : "Connected"],
              ["Homepage content", site.updatedAt ? "Published" : "Using defaults"],
              ["Global details", site.content.general.contactEmail],
            ].map(([label, value], index) => (
              <div
                className="flex items-center justify-between border-b border-white/[0.08] pb-3 last:border-0"
                key={label}
              >
                <span className="text-[10px] text-white/45">{label}</span>
                <span className="flex max-w-[160px] items-center gap-2 truncate text-[9px] font-medium text-white/78">
                  <span
                    className={
                      "h-1.5 w-1.5 shrink-0 rounded-full " +
                      (index === 0 && setupMessage ? "bg-[#e49a6a]" : "bg-[#c9f26b]")
                    }
                  />
                  <span className="truncate">{value}</span>
                </span>
              </div>
            ))}
          </div>

          <Link
            className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[11px] bg-[#c9f26b] text-[10px] font-semibold text-[#11130f] transition hover:bg-[#d6fa82]"
            href="/dashboard/homepage"
          >
            Edit homepage <Icon className="h-3.5 w-3.5" name="arrow-right" />
          </Link>
        </section>
      </div>

      <section className="relative overflow-hidden rounded-[22px] border border-[#d7d3c8] bg-[#7568f8] px-6 py-7 text-white sm:px-8">
        <span className="absolute -right-16 -top-32 h-72 w-72 rounded-full border-[42px] border-white/10" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-white/60">
              Quick check
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              See every edit in its real context.
            </h2>
            <p className="mt-2 text-[10px] leading-5 text-white/65">
              Open the public website after publishing to review desktop and mobile layouts.
            </p>
          </div>
          <Link
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#c9f26b] px-5 text-[10px] font-semibold text-[#11130f]"
            href="/"
            target="_blank"
          >
            View live site <Icon className="h-3.5 w-3.5" name="external" />
          </Link>
        </div>
      </section>
    </div>
  );
}
