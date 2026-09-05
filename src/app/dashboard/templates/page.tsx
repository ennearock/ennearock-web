"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";

type Template = {
  id: number;
  name: string;
  category: "SaaS" | "Commerce" | "Portfolio" | "Landing";
  description: string;
  pages: number;
  uses: string;
  updated: string;
  accent: string;
  ink: string;
  badge?: string;
};

const catalog: Template[] = [
  { id: 1, name: "Horizon", category: "SaaS", description: "Conversion-led launch system for modern B2B products.", pages: 12, uses: "1.8k", updated: "2 days", accent: "#d8f387", ink: "#172015", badge: "Popular" },
  { id: 2, name: "Monument", category: "Portfolio", description: "Editorial portfolio for studios that let the work speak.", pages: 9, uses: "846", updated: "1 week", accent: "#e4d9ce", ink: "#251d18", badge: "New" },
  { id: 3, name: "Relay", category: "Commerce", description: "A sharp storefront system for ambitious product brands.", pages: 15, uses: "1.2k", updated: "5 days", accent: "#c6d9f7", ink: "#152238" },
  { id: 4, name: "Signal", category: "Landing", description: "Focused launch page for apps, waitlists, and new ideas.", pages: 6, uses: "2.4k", updated: "3 weeks", accent: "#f4c4aa", ink: "#351b12" },
  { id: 5, name: "Vector", category: "SaaS", description: "Data-rich marketing site for analytics and AI platforms.", pages: 11, uses: "735", updated: "4 days", accent: "#c7c1f2", ink: "#201b40" },
  { id: 6, name: "Fieldnote", category: "Portfolio", description: "Warm, minimal showcase for independent creative work.", pages: 8, uses: "592", updated: "2 weeks", accent: "#e6d69f", ink: "#302811" },
];

const categories = ["All", "SaaS", "Commerce", "Portfolio", "Landing"] as const;

function TemplatePreview({ template }: { template: Template }) {
  return (
    <div className="relative h-full w-full overflow-hidden p-4" style={{ background: template.accent, color: template.ink }}>
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[28px] opacity-10" style={{ borderColor: template.ink }} />
      <div className="relative flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[-0.05em]">{template.name.toUpperCase()}</span>
        <div className="flex gap-1"><span className="h-1 w-5 rounded-full bg-current opacity-20" /><span className="h-1 w-3 rounded-full bg-current opacity-20" /></div>
      </div>
      <div className="relative mt-8 max-w-[75%]">
        <p className="text-[8px] font-medium uppercase tracking-[0.14em] opacity-55">{template.category} framework</p>
        <p className="mt-2 text-[20px] font-semibold leading-[.95] tracking-[-0.06em]">Built to make a strong first move.</p>
        <span className="mt-4 inline-flex h-6 items-center rounded-full px-3 text-[6px] font-bold uppercase tracking-[0.12em]" style={{ background: template.ink, color: template.accent }}>Explore product</span>
      </div>
      <div className="absolute bottom-4 right-4 h-[82px] w-[42%] rounded-[9px] border border-white/40 bg-white/35 p-2 shadow-sm backdrop-blur-sm">
        <span className="block h-2 w-2 rounded-full bg-current opacity-50" />
        <span className="mt-4 block h-1 w-full rounded-full bg-current opacity-15" />
        <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-current opacity-15" />
        <div className="mt-3 flex gap-1"><span className="h-3 flex-1 rounded-sm bg-white/50" /><span className="h-3 flex-1 rounded-sm bg-white/50" /></div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [installed, setInstalled] = useState<number[]>([2]);

  const visible = useMemo(() => catalog.filter((template) => {
    const categoryMatch = activeCategory === "All" || template.category === activeCategory;
    const queryMatch = (template.name + " " + template.description).toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [activeCategory, query]);

  function toggleTemplate(id: number) {
    setInstalled((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Launch library"
        title="Templates"
        description="Production-ready starting points crafted by the Ennearock team and tuned for real client work."
        action={
          <button className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#d4d1c7] bg-white px-4 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[#bdbab0]">
            <Icon name="plus" className="h-4 w-4" /> Submit template
          </button>
        }
      />

      <section className="relative overflow-hidden rounded-[22px] bg-[#151813] p-6 text-white sm:p-8">
        <div className="absolute -right-16 -top-32 h-72 w-72 rounded-full bg-[#c9f26b]/20 blur-[80px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c9f26b]"><Icon name="sparkles" className="h-3.5 w-3.5" /> Team collection</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">Start at seventy percent, not zero.</h2>
            <p className="mt-3 text-xs leading-6 text-white/48">Every system includes responsive sections, sensible tokens, core pages, and a clear handoff structure.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
            {[["24", "Systems"], ["142", "Sections"], ["Weekly", "Updates"]].map(([value, label]) => (
              <div key={label} className="rounded-[15px] border border-white/[0.08] bg-white/[0.055] p-4"><p className="text-lg font-semibold tracking-[-0.04em]">{value}</p><p className="mt-1 text-[9px] text-white/35">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[#dedbd1] bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-[11px] bg-[#f2f0e9] p-1">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={"whitespace-nowrap rounded-[8px] px-3 py-2 text-[10px] font-semibold transition " + (activeCategory === category ? "bg-white text-[#11130f] shadow-sm" : "text-[#7f837a] hover:text-[#11130f]")}>{category}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="relative flex-1 xl:w-64">
              <span className="sr-only">Search templates</span>
              <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#93968f]" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates" className="h-10 w-full rounded-[11px] border border-[#dedbd1] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#8b9e66] focus:ring-4 focus:ring-[#c9f26b]/20" />
            </label>
            <div className="flex rounded-[11px] border border-[#dedbd1] bg-white p-1">
              <button onClick={() => setView("grid")} className={"grid h-8 w-8 place-items-center rounded-[7px] " + (view === "grid" ? "bg-[#11130f] text-white" : "text-[#858980] hover:bg-[#f2f0e9]")} aria-label="Grid view"><Icon name="overview" className="h-3.5 w-3.5" /></button>
              <button onClick={() => setView("list")} className={"grid h-8 w-8 place-items-center rounded-[7px] " + (view === "list" ? "bg-[#11130f] text-white" : "text-[#858980] hover:bg-[#f2f0e9]")} aria-label="List view"><Icon name="templates" className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#858980]"><strong className="text-[#30332d]">{visible.length}</strong> curated systems</p>
        <button className="flex items-center gap-1.5 text-[10px] font-medium text-[#676b63]">Most popular <Icon name="chevron-down" className="h-3 w-3" /></button>
      </div>

      {visible.length ? (
        <section className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
          {visible.map((template) => {
            const isInstalled = installed.includes(template.id);
            return (
              <article key={template.id} className={"group overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white transition hover:border-[#c7c4b9] hover:shadow-[0_18px_50px_rgba(41,44,37,.09)] " + (view === "list" ? "sm:grid sm:grid-cols-[260px_1fr]" : "hover:-translate-y-1")}>
                <div className={view === "list" ? "h-44 sm:h-full sm:min-h-[190px]" : "h-[210px]"}><TemplatePreview template={template} /></div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold tracking-[-0.035em]">{template.name}</h2>
                      {template.badge ? <span className="rounded-full bg-[#edf6dc] px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#506a34]">{template.badge}</span> : null}
                    </div>
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-[#858980] hover:bg-[#f2f0e9]" aria-label={"Options for " + template.name}><Icon name="dots" className="h-4 w-4" /></button>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-[#777b73]">{template.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-[#7f837a]">
                    <span className="rounded-full bg-[#f1efe8] px-2 py-1">{template.category}</span>
                    <span className="rounded-full bg-[#f1efe8] px-2 py-1">{template.pages} pages</span>
                    <span className="rounded-full bg-[#f1efe8] px-2 py-1">{template.uses} uses</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[#eceae3] pt-4">
                    <p className="text-[8px] text-[#9b9e96]">Updated {template.updated} ago</p>
                    <div className="flex gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#dddacf] bg-white text-[#6c7068] hover:border-[#bdbab0] hover:text-[#11130f]" aria-label={"Preview " + template.name}><Icon name="eye" className="h-4 w-4" /></button>
                      <button onClick={() => toggleTemplate(template.id)} className={"h-9 rounded-[10px] px-3.5 text-[10px] font-semibold transition " + (isInstalled ? "bg-[#e8f3d4] text-[#4d672f]" : "bg-[#11130f] text-white hover:bg-[#2b2f27]")}>{isInstalled ? "Added ✓" : "Use template"}</button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#cbc8bd] bg-white/50 px-6 py-20 text-center"><Icon name="search" className="mx-auto h-7 w-7 text-[#8d9088]" /><h2 className="mt-4 text-sm font-semibold">No templates found</h2><p className="mt-2 text-xs text-[#858980]">Try a different category or search.</p></div>
      )}
    </div>
  );
}
