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
  { id: 1, name: "Meridian Finance", client: "Meridian", status: "In review", due: "Sep 04", progress: 88, value: "€12,400", accent: "#d9f49a" },
  { id: 2, name: "Northstar Commerce", client: "Northstar", status: "Building", due: "Sep 12", progress: 64, value: "€9,800", accent: "#c9c4fb" },
  { id: 3, name: "Atelier Noma", client: "Noma Studio", status: "Discovery", due: "Sep 28", progress: 24, value: "€7,200", accent: "#f2c7a8" },
  { id: 4, name: "Helio Analytics", client: "Helio Labs", status: "Live", due: "Aug 22", progress: 100, value: "€14,600", accent: "#bce6db" },
  { id: 5, name: "Pulse Health", client: "Pulse", status: "Building", due: "Oct 08", progress: 42, value: "€11,300", accent: "#f0b8c9" },
  { id: 6, name: "Forma Objects", client: "Forma", status: "Discovery", due: "Oct 21", progress: 12, value: "€8,900", accent: "#f0d58d" },
];

const filters = ["All", "Discovery", "Building", "In review", "Live"] as const;

function projectStatusClass(status: Project["status"]) {
  if (status === "Live") return "bg-[#e5f3de] text-[#3e6b32]";
  if (status === "In review") return "bg-[#fff1c9] text-[#7c5a17]";
  if (status === "Building") return "bg-[#e8e5fb] text-[#544b86]";
  return "bg-[#ecebe6] text-[#64675f]";
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
      { id: Date.now(), name, client, status: "Discovery", due: "Oct 30", progress: 8, value: "€—", accent: "#d9f49a" },
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
          <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#11130f] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2e25]">
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
          <div key={label} className="rounded-[18px] border border-[#dedbd1] bg-white px-5 py-4">
            <div className="flex items-start justify-between"><p className="text-[10px] font-medium text-[#74786f]">{label}</p><span className={"h-2 w-2 rounded-full " + (index === 0 ? "bg-[#a5c45e]" : index === 1 ? "bg-[#7568c5]" : "bg-[#df986a]")} /></div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.045em]">{value}</p>
            <p className="mt-1 text-[9px] text-[#969990]">{note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[22px] border border-[#dedbd1] bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-[11px] bg-[#f2f0e9] p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={"whitespace-nowrap rounded-[8px] px-3 py-2 text-[10px] font-semibold transition " + (activeFilter === filter ? "bg-white text-[#11130f] shadow-sm" : "text-[#7f837a] hover:text-[#11130f]")}
              >
                {filter}
                <span className="ml-1.5 font-mono text-[8px] text-[#a0a29b]">{filter === "All" ? projects.length : projects.filter((project) => project.status === filter).length}</span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#93968f]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search projects" className="h-10 w-full rounded-[11px] border border-[#dedbd1] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#8b9e66] focus:ring-4 focus:ring-[#c9f26b]/20" />
          </div>
        </div>
      </section>

      {visible.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white transition hover:-translate-y-1 hover:border-[#c8c5ba] hover:shadow-[0_18px_50px_rgba(41,44,37,.09)]">
              <div className="relative h-36 overflow-hidden p-5" style={{ background: project.accent }}>
                <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[24px] border-white/25" />
                <div className="absolute bottom-4 right-4 h-16 w-24 rounded-[10px] border border-black/10 bg-white/35 p-2 backdrop-blur-sm">
                  <span className="block h-1.5 w-1/2 rounded-full bg-black/20" /><span className="mt-2 block h-1 w-full rounded-full bg-black/10" /><span className="mt-1.5 block h-1 w-3/4 rounded-full bg-black/10" />
                </div>
                <div className="relative grid h-11 w-11 place-items-center rounded-[13px] bg-[#11130f] text-xs font-bold text-white">{project.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div>
                <span className={"absolute bottom-4 left-5 rounded-full px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] " + projectStatusClass(project.status)}>{project.status}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-[15px] font-semibold tracking-[-0.025em]">{project.name}</h2><p className="mt-1 text-[10px] text-[#8b8f86]">{project.client}</p></div>
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-[#868a82] hover:bg-[#f2f0e9] hover:text-[#11130f]" aria-label={"Options for " + project.name}><Icon name="dots" className="h-4 w-4" /></button>
                </div>
                <div className="mt-5 flex items-center justify-between text-[9px]">
                  <span className="flex items-center gap-1.5 text-[#777b73]"><Icon name="calendar" className="h-3.5 w-3.5" /> Due {project.due}</span>
                  <span className="font-semibold">{project.value}</span>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between font-mono text-[8px] text-[#91958c]"><span>Progress</span><span>{project.progress}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#ebe9e2]"><div className="h-full rounded-full bg-[#809b49]" style={{ width: project.progress + "%" }} /></div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#edebe4] pt-4">
                  <div className="flex -space-x-2">{["ZM", "SK", "JD"].slice(0, project.id % 3 + 1).map((initials, index) => <span key={initials} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#e6e1d5] text-[7px] font-bold" style={{ zIndex: 3 - index }}>{initials}</span>)}</div>
                  <button className="flex items-center gap-1 text-[9px] font-semibold text-[#607449] hover:text-[#11130f]">Open project <Icon name="arrow-right" className="h-3 w-3" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#cbc8bd] bg-white/50 px-6 py-20 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e9e7df] text-[#72766d]"><Icon name="search" /></span>
          <h2 className="mt-4 text-sm font-semibold">No matching projects</h2>
          <p className="mt-2 text-xs text-[#858980]">Try another status or search term.</p>
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <button className="absolute inset-0" onClick={() => setModalOpen(false)} aria-label="Close new project dialog" />
          <div role="dialog" aria-modal="true" aria-labelledby="new-project-title" className="relative w-full max-w-md rounded-[24px] border border-white/20 bg-[#f8f6f0] p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#74805e]">New engagement</p><h2 id="new-project-title" className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Create a project</h2><p className="mt-2 text-xs leading-5 text-[#777b73]">Start with the essentials. You can add scope and milestones next.</p></div><button onClick={() => setModalOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dedbd1] bg-white text-[#777b73]" aria-label="Close"><Icon name="close" className="h-4 w-4" /></button></div>
            <form onSubmit={addProject} className="mt-6 space-y-4">
              <label className="block text-[10px] font-semibold text-[#454940]">Project name<input name="name" required autoFocus placeholder="e.g. Atlas rebrand" className="mt-2 h-11 w-full rounded-xl border border-[#d8d5cb] bg-white px-3.5 text-xs outline-none focus:border-[#81975a] focus:ring-4 focus:ring-[#c9f26b]/20" /></label>
              <label className="block text-[10px] font-semibold text-[#454940]">Client<input name="client" required placeholder="Client or company" className="mt-2 h-11 w-full rounded-xl border border-[#d8d5cb] bg-white px-3.5 text-xs outline-none focus:border-[#81975a] focus:ring-4 focus:ring-[#c9f26b]/20" /></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-[10px] font-semibold text-[#454940]">Budget<input name="budget" placeholder="€10,000" className="mt-2 h-11 w-full rounded-xl border border-[#d8d5cb] bg-white px-3.5 text-xs outline-none focus:border-[#81975a]" /></label><label className="block text-[10px] font-semibold text-[#454940]">Target date<input name="date" type="date" className="mt-2 h-11 w-full rounded-xl border border-[#d8d5cb] bg-white px-3.5 text-xs outline-none focus:border-[#81975a]" /></label></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="h-11 flex-1 rounded-xl border border-[#d5d2c8] bg-white text-xs font-semibold">Cancel</button><button type="submit" className="h-11 flex-1 rounded-xl bg-[#11130f] text-xs font-semibold text-white hover:bg-[#292d25]">Create project</button></div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
