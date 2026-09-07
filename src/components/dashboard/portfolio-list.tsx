"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePortfolioAction } from "@/app/dashboard/actions";
import type { PortfolioListItem } from "./admin-types";
import { Icon } from "./icon";

type Filter = "all" | "published" | "draft" | "featured";

function formatUpdatedAt(value?: string | null) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function PortfolioList({
  initialFilter = "all",
  projects,
}: {
  initialFilter?: Filter;
  projects: PortfolioListItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        const queryMatch = (project.name + " " + project.tagline + " " + project.category)
          .toLowerCase()
          .includes(query.toLowerCase());
        const filterMatch =
          filter === "all" ||
          (filter === "published" && project.published) ||
          (filter === "draft" && !project.published) ||
          (filter === "featured" && project.featured);
        return queryMatch && filterMatch;
      }),
    [filter, projects, query],
  );

  function remove(project: PortfolioListItem) {
    if (!window.confirm('Delete "' + project.name + '"? This cannot be undone.')) return;
    setMessage("");
    startTransition(async () => {
      const result = await deletePortfolioAction(project.id ?? "");
      setMessage(result.message);
      if (result.status === "success") router.refresh();
    });
  }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    { id: "published", label: "Live", count: projects.filter((project) => project.published).length },
    { id: "draft", label: "Drafts", count: projects.filter((project) => !project.published).length },
    { id: "featured", label: "Featured", count: projects.filter((project) => project.featured).length },
  ];

  return (
    <>
      <section className="rounded-[20px] border border-[#dedbd1] bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-[11px] bg-[#f2f0e9] p-1">
            {filters.map((item) => (
              <button
                className={
                  "whitespace-nowrap rounded-[8px] px-3 py-2 text-[10px] font-semibold transition " +
                  (filter === item.id
                    ? "bg-white text-[#11130f] shadow-sm"
                    : "text-[#7f837a] hover:text-[#11130f]")
                }
                key={item.id}
                onClick={() => setFilter(item.id)}
                type="button"
              >
                {item.label}
                <span className="ml-1.5 font-mono text-[8px] text-[#a0a29b]">{item.count}</span>
              </button>
            ))}
          </div>
          <label className="relative sm:w-72">
            <span className="sr-only">Search portfolio</span>
            <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#93968f]" name="search" />
            <input
              className="h-10 w-full rounded-[11px] border border-[#dedbd1] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#8b9e66] focus:ring-4 focus:ring-[#c9f26b]/20"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              type="search"
              value={query}
            />
          </label>
        </div>
      </section>

      {message ? (
        <p aria-live="polite" className="rounded-[13px] border border-[#d5d1c6] bg-white px-4 py-3 text-[10px] text-[#5f635a]">
          {message}
        </p>
      ) : null}

      {visible.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <article
              className="group overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white transition hover:-translate-y-1 hover:border-[#c8c5ba] hover:shadow-[0_18px_50px_rgba(41,44,37,.09)]"
              key={project.id}
            >
              <div className="relative h-44 overflow-hidden" style={{ backgroundColor: project.accent }}>
                {project.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-full w-full object-cover" src={project.coverImageUrl} />
                ) : (
                  <>
                    <span className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[34px] border-white/25" />
                    <span className="absolute bottom-5 right-5 h-20 w-32 rounded-[12px] border border-black/10 bg-white/35 p-3 backdrop-blur-sm">
                      <span className="block h-1.5 w-1/2 rounded-full bg-black/20" />
                      <span className="mt-3 block h-1 w-full rounded-full bg-black/10" />
                      <span className="mt-2 block h-1 w-3/4 rounded-full bg-black/10" />
                    </span>
                  </>
                )}
                <div className="absolute inset-x-4 top-4 flex items-start justify-between">
                  <span className="rounded-full bg-[#11130f]/90 px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">
                    {project.category}
                  </span>
                  <span
                    className={
                      "rounded-full px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] shadow-sm " +
                      (project.published
                        ? "bg-[#e5f3de] text-[#3e6b32]"
                        : "bg-white/90 text-[#64675f]")
                    }
                  >
                    {project.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-[15px] font-semibold tracking-[-0.025em]">{project.name}</h2>
                      {project.featured ? (
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#718b41]" name="sparkles" />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#8b8f86]">{project.tagline || "No tagline yet"}</p>
                  </div>
                  <span className="rounded-full bg-[#f1efe8] px-2 py-1 font-mono text-[8px] text-[#858980]">#{project.sortOrder}</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#edebe4] pt-4">
                  <p className="text-[8px] text-[#9b9e96]">Updated {formatUpdatedAt(project.updatedAt)}</p>
                  <div className="flex gap-1.5">
                    {project.published ? (
                      <Link
                        aria-label={"View " + project.name + " live"}
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#dddacf] text-[#6c7068] hover:border-[#bdbab0] hover:text-[#11130f]"
                        href={"/projects/" + project.slug}
                        target="_blank"
                      >
                        <Icon className="h-4 w-4" name="external" />
                      </Link>
                    ) : null}
                    <button
                      aria-label={"Delete " + project.name}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#ead7d2] text-[#9a6257] hover:bg-[#fae9e5] disabled:opacity-45"
                      disabled={isPending}
                      onClick={() => remove(project)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="trash" />
                    </button>
                    <Link
                      className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-[#11130f] px-3.5 text-[9px] font-semibold text-white hover:bg-[#2b2f27]"
                      href={"/dashboard/portfolio/" + project.id}
                    >
                      Edit <Icon className="h-3.5 w-3.5" name="edit" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#cbc8bd] bg-white/50 px-6 py-20 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e9e7df] text-[#72766d]">
            <Icon name={projects.length ? "search" : "projects"} />
          </span>
          <h2 className="mt-4 text-sm font-semibold">
            {projects.length ? "No matching projects" : "Add your first portfolio project"}
          </h2>
          <p className="mt-2 text-xs text-[#858980]">
            {projects.length ? "Try another filter or search term." : "Build a case study, save it as a draft, and publish when it is ready."}
          </p>
          {!projects.length ? (
            <Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-[11px] bg-[#11130f] px-4 text-[10px] font-semibold text-white" href="/dashboard/portfolio/new">
              <Icon className="h-3.5 w-3.5" name="plus" /> New project
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}
