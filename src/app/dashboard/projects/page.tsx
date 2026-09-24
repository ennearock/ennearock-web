"use client";

import { FormEvent, useMemo, useState } from "react";
import { Icon } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";

type Project = {
  id: number;
  name: string;
  client: string;
  status: "Discovery" | "Building" | "In review" | "Live";
  due: string;
  progress: number;
  value: string;
  accent: string;
};

const starterProjects: Project[] = [
  { id: 1, name: "Meridian Finance", client: "Meridian", status: "In review", due: "Sep 04", progress: 88, value: "€12,400", accent: "#e2e5eb" },
  { id: 2, name: "Northstar Commerce", client: "Northstar", status: "Building", due: "Sep 12", progress: 64, value: "€9,800", accent: "#c8ced8" },
  { id: 3, name: "Atelier Noma", client: "Noma Studio", status: "Discovery", due: "Sep 28", progress: 24, value: "€7,200", accent: "#e0e3e8" },
  { id: 4, name: "Helio Analytics", client: "Helio Labs", status: "Live", due: "Aug 22", progress: 100, value: "€14,600", accent: "#bec6d1" },
  { id: 5, name: "Pulse Health", client: "Pulse", status: "Building", due: "Oct 08", progress: 42, value: "€11,300", accent: "#d1d6df" },
  { id: 6, name: "Forma Objects", client: "Forma", status: "Discovery", due: "Oct 21", progress: 12, value: "€8,900", accent: "#e6e8ed" },
];

const filters = ["All", "Discovery", "Building", "In review", "Live"] as const;

function projectStatusClass(status: Project["status"]) {
  if (status === "Live") return "bg-[#e5f3de] text-[#3e6b32]";
  if (status === "In review") return "bg-[#fff1c9] text-[#7c5a17]";
  if (status === "Building") return "bg-[#e8e5fb] text-[#544b86]";
  return "bg-surface-muted text-[var(--muted)]";
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(starterProjects);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [created, setCreated] = useState("");

  const visible = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = activeFilter === "All" || project.status === activeFilter;
      const matchesQuery = (project.name + " " + project.client).toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [projects, activeFilter, query]);

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "Untitled project");
    const client = String(form.get("client") || "New client");
    setProjects((current) => [
      { id: Date.now(), name, client, status: "Discovery", due: "Oct 30", progress: 8, value: "€—", accent: "#e2e5eb" },
      ...current,
    ]);
    setCreated(name);
    setModalOpen(false);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Client delivery"
        title="Projects"
        description="Keep every engagement moving—from the first conversation to launch day."
        action={
          <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-ink px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-panel">
            <Icon name="plus" className="h-4 w-4" /> New project
          </button>
        }
      />

      {created ? (
        <div className="flex items-center justify-between rounded-[14px] border border-[#bfd890] bg-[#eff7df] px-4 py-3 text-xs text-[#405529]" role="status">
          <span><strong>{created}</strong> was added to discovery.</span>
          <button onClick={() => setCreated("")} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-black/5" aria-label="Dismiss"><Icon name="close" className="h-3.5 w-3.5" /></button>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Pipeline value", "€64.2k", "Across 6 projects"],
          ["Delivery health", "92%", "4 projects on track"],
          ["Average cycle", "6.4w", "1.2 weeks faster"],
        ].map(([label, value, note], index) => (
          <div key={label} className="rounded-[18px] border border-[var(--line)] bg-white px-5 py-4">
            <div className="flex items-start justify-between"><p className="text-[10px] font-medium text-[var(--muted)]">{label}</p><span className={"h-2 w-2 rounded-full " + (index === 0 ? "bg-ink" : index === 1 ? "bg-[var(--muted)]" : "bg-[#a6acb7]")} /></div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.045em]">{value}</p>
            <p className="mt-1 text-[9px] text-[var(--muted)]">{note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[22px] border border-[var(--line)] bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-[11px] bg-surface-muted p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={"whitespace-nowrap rounded-[8px] px-3 py-2 text-[10px] font-semibold transition " + (activeFilter === filter ? "bg-white text-ink shadow-sm" : "text-[var(--muted)] hover:text-ink")}
              >
                {filter}
                <span className="ml-1.5 font-mono text-[8px] text-[var(--muted)]">{filter === "All" ? projects.length : projects.filter((project) => project.status === filter).length}</span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search projects" className="h-10 w-full rounded-[11px] border border-[var(--line)] bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20" />
          </div>
        </div>
      </section>

      {visible.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-[22px] border border-[var(--line)] bg-white transition hover:-translate-y-1 hover:border-[var(--line)] hover:shadow-[0_18px_50px_rgba(19,20,24,.09)]">
              <div className="relative h-36 overflow-hidden p-5" style={{ background: project.accent }}>
                <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[24px] border-white/25" />
                <div className="absolute bottom-4 right-4 h-16 w-24 rounded-[10px] border border-black/10 bg-white/35 p-2 backdrop-blur-sm">
                  <span className="block h-1.5 w-1/2 rounded-full bg-black/20" /><span className="mt-2 block h-1 w-full rounded-full bg-black/10" /><span className="mt-1.5 block h-1 w-3/4 rounded-full bg-black/10" />
                </div>
                <div className="relative grid h-11 w-11 place-items-center rounded-[13px] bg-ink text-xs font-bold text-white">{project.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div>
                <span className={"absolute bottom-4 left-5 rounded-full px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] " + projectStatusClass(project.status)}>{project.status}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-[15px] font-semibold tracking-[-0.025em]">{project.name}</h2><p className="mt-1 text-[10px] text-[var(--muted)]">{project.client}</p></div>
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-surface-muted hover:text-ink" aria-label={"Options for " + project.name}><Icon name="dots" className="h-4 w-4" /></button>
                </div>
                <div className="mt-5 flex items-center justify-between text-[9px]">
                  <span className="flex items-center gap-1.5 text-[var(--muted)]"><Icon name="calendar" className="h-3.5 w-3.5" /> Due {project.due}</span>
                  <span className="font-semibold">{project.value}</span>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between font-mono text-[8px] text-[var(--muted)]"><span>Progress</span><span>{project.progress}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]"><div className="h-full rounded-full bg-ink" style={{ width: project.progress + "%" }} /></div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <div className="flex -space-x-2">{["ZM", "SK", "JD"].slice(0, project.id % 3 + 1).map((initials, index) => <span key={initials} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-surface-muted text-[7px] font-bold" style={{ zIndex: 3 - index }}>{initials}</span>)}</div>
                  <button className="flex items-center gap-1 text-[9px] font-semibold text-ink hover:text-ink">Open project <Icon name="arrow-right" className="h-3 w-3" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[var(--line)] bg-white/50 px-6 py-20 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-muted text-[var(--muted)]"><Icon name="search" /></span>
          <h2 className="mt-4 text-sm font-semibold">No matching projects</h2>
          <p className="mt-2 text-xs text-[var(--muted)]">Try another status or search term.</p>
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <button className="absolute inset-0" onClick={() => setModalOpen(false)} aria-label="Close new project dialog" />
          <div role="dialog" aria-modal="true" aria-labelledby="new-project-title" className="relative w-full max-w-md rounded-[24px] border border-white/20 bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">New engagement</p><h2 id="new-project-title" className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Create a project</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Start with the essentials. You can add scope and milestones next.</p></div><button onClick={() => setModalOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-white text-[var(--muted)]" aria-label="Close"><Icon name="close" className="h-4 w-4" /></button></div>
            <form onSubmit={addProject} className="mt-6 space-y-4">
              <label className="block text-[10px] font-semibold text-ink">Project name<input name="name" required autoFocus placeholder="e.g. Atlas rebrand" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-xs outline-none focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20" /></label>
              <label className="block text-[10px] font-semibold text-ink">Client<input name="client" required placeholder="Client or company" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-xs outline-none focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20" /></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-[10px] font-semibold text-ink">Budget<input name="budget" placeholder="€10,000" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-xs outline-none focus:border-[var(--focus)]" /></label><label className="block text-[10px] font-semibold text-ink">Target date<input name="date" type="date" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-xs outline-none focus:border-[var(--focus)]" /></label></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="h-11 flex-1 rounded-xl border border-[var(--line)] bg-white text-xs font-semibold">Cancel</button><button type="submit" className="h-11 flex-1 rounded-xl bg-ink text-xs font-semibold text-white hover:bg-panel">Create project</button></div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
