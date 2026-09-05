import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Overview",
};

const stats: { label: string; value: string; change: string; note: string; icon: IconName }[] = [
  { label: "Active projects", value: "04", change: "+1", note: "this month", icon: "projects" },
  { label: "Monthly revenue", value: "€38.4k", change: "+18.4%", note: "vs. last month", icon: "billing" },
  { label: "Template sales", value: "284", change: "+24", note: "this week", icon: "templates" },
  { label: "Client satisfaction", value: "4.9", change: "+0.2", note: "across 18 reviews", icon: "sparkles" },
];

const projects = [
  { name: "Meridian Finance", client: "Meridian", status: "In review", due: "Sep 04", progress: 88, value: "€12,400", color: "#d9f49a" },
  { name: "Northstar Commerce", client: "Northstar", status: "Building", due: "Sep 12", progress: 64, value: "€9,800", color: "#c9c4fb" },
  { name: "Atelier Noma", client: "Noma Studio", status: "Discovery", due: "Sep 28", progress: 24, value: "€7,200", color: "#f2c7a8" },
  { name: "Helio Analytics", client: "Helio Labs", status: "Live", due: "Aug 22", progress: 100, value: "€14,600", color: "#bce6db" },
];

const activity = [
  { title: "Feedback received", detail: "Sofia left 3 comments on Meridian", time: "8 min", icon: "mail" as IconName, color: "#d9f49a" },
  { title: "Milestone approved", detail: "Northstar approved Design system", time: "2 hr", icon: "check" as IconName, color: "#c9c4fb" },
  { title: "Invoice paid", detail: "Helio Labs paid invoice #1048", time: "1 day", icon: "billing" as IconName, color: "#bce6db" },
  { title: "Template published", detail: "Horizon SaaS is now live", time: "2 days", icon: "templates" as IconName, color: "#f2c7a8" },
];

function Status({ value }: { value: string }) {
  const styles =
    value === "Live"
      ? "bg-[#e5f3de] text-[#3e6b32]"
      : value === "In review"
        ? "bg-[#fff1c9] text-[#7c5a17]"
        : value === "Building"
          ? "bg-[#e8e5fb] text-[#544b86]"
          : "bg-[#ecebe6] text-[#64675f]";
  return <span className={"inline-flex rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] " + styles}>{value}</span>;
}

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sunday · 30 August"
        title="Good morning, Zakaria."
        description="Your studio is moving well. Two client decisions need your attention today."
        action={
          <Link href="/dashboard/projects" className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#11130f] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2e25]">
            <Icon name="plus" className="h-4 w-4" /> New project
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace summary">
        {stats.map((stat) => (
          <article key={stat.label} className="group rounded-[20px] border border-[#dedbd1] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cbc8bd] hover:shadow-[0_14px_40px_rgba(41,44,37,.07)]">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#f1efe8] text-[#62665c] transition group-hover:bg-[#c9f26b] group-hover:text-[#11130f]">
                <Icon name={stat.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef7dc] px-2 py-1 font-mono text-[9px] font-semibold text-[#4d692d]">
                <Icon name="arrow-up" className="h-3 w-3" /> {stat.change}
              </span>
            </div>
            <p className="mt-6 text-[28px] font-semibold tracking-[-0.05em] text-[#11130f]">{stat.value}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#454940]">{stat.label}</p>
              <p className="text-[9px] text-[#969990]">{stat.note}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="rounded-[22px] border border-[#dedbd1] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.19em] text-[#858980]">Revenue pulse</p>
              <div className="mt-2 flex items-end gap-3">
                <h2 className="text-[28px] font-semibold tracking-[-0.045em]">€38,420</h2>
                <span className="mb-1 rounded-full bg-[#eef7dc] px-2 py-1 font-mono text-[9px] font-semibold text-[#4d692d]">+18.4%</span>
              </div>
              <p className="mt-1 text-[11px] text-[#8b8f86]">Collected in the last 30 days</p>
            </div>
            <div className="flex rounded-[10px] bg-[#f1efe8] p-1 text-[10px] font-medium text-[#858980]">
              <button className="rounded-[7px] px-2.5 py-1.5 hover:text-[#11130f]">7D</button>
              <button className="rounded-[7px] bg-white px-2.5 py-1.5 text-[#11130f] shadow-sm">30D</button>
              <button className="rounded-[7px] px-2.5 py-1.5 hover:text-[#11130f]">90D</button>
            </div>
          </div>

          <div className="mt-6 h-[220px] w-full">
            <svg viewBox="0 0 720 220" className="h-full w-full overflow-visible" role="img" aria-label="Revenue increased from 19 thousand euros to 38 thousand euros over six months">
              <defs>
                <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#badd6d" stopOpacity=".35" />
                  <stop offset="100%" stopColor="#badd6d" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 80, 130, 180].map((y) => <line key={y} x1="0" x2="720" y1={y} y2={y} stroke="#e8e5dc" strokeDasharray="4 7" />)}
              <path d="M0 177 C55 170 78 145 120 151 S201 170 245 129 S333 106 370 118 S453 99 493 78 S563 97 606 58 S677 52 720 28 L720 220 L0 220 Z" fill="url(#area-fill)" />
              <path d="M0 177 C55 170 78 145 120 151 S201 170 245 129 S333 106 370 118 S453 99 493 78 S563 97 606 58 S677 52 720 28" fill="none" stroke="#7f9c43" strokeWidth="3" strokeLinecap="round" />
              <circle cx="720" cy="28" r="5" fill="#c9f26b" stroke="#11130f" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-[#a0a29c]">
            <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#dedbd1] bg-[#151813] p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.19em] text-white/35">Capacity</p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em]">This week</h2>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#c9f26b] text-[#11130f]"><Icon name="bolt" className="h-4 w-4" /></span>
          </div>
          <div className="relative mx-auto mt-7 grid h-36 w-36 place-items-center rounded-full" style={{ background: "conic-gradient(#c9f26b 0 78%, rgba(255,255,255,.08) 78% 100%)" }}>
            <div className="grid h-[116px] w-[116px] place-items-center rounded-full bg-[#151813] text-center">
              <div><p className="text-3xl font-semibold tracking-[-0.05em]">78%</p><p className="mt-1 text-[9px] text-white/35">31 of 40 hours</p></div>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            {[["Design", "14h", "w-[72%]"], ["Development", "11h", "w-[58%]"], ["Strategy", "6h", "w-[32%]"]].map(([name, time, width]) => (
              <div key={name}>
                <div className="mb-1.5 flex justify-between text-[10px]"><span className="text-white/55">{name}</span><span className="font-mono text-white/35">{time}</span></div>
                <div className="h-1 rounded-full bg-white/10"><div className={"h-full rounded-full bg-[#c9f26b] " + width} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
          <div className="flex items-center justify-between border-b border-[#e6e3da] p-5 sm:px-6">
            <div><h2 className="text-sm font-semibold">Active projects</h2><p className="mt-1 text-[10px] text-[#8d9088]">Four engagements currently moving</p></div>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-[10px] font-semibold text-[#5c6e45] hover:text-[#11130f]">View all <Icon name="arrow-right" className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead><tr className="border-b border-[#eeece6] font-mono text-[8px] uppercase tracking-[0.14em] text-[#9a9d95]"><th className="px-6 py-3 font-medium">Project</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Progress</th><th className="px-4 py-3 font-medium">Due</th><th className="px-6 py-3 text-right font-medium">Value</th></tr></thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.name} className="border-b border-[#f0eee8] last:border-0 hover:bg-[#faf9f5]">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[10px] text-[10px] font-bold" style={{ background: project.color }}>{project.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span><div><p className="text-xs font-semibold">{project.name}</p><p className="mt-1 text-[9px] text-[#969990]">{project.client}</p></div></div></td>
                    <td className="px-4 py-4"><Status value={project.status} /></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><span className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8e6df]"><span className="block h-full rounded-full bg-[#90ad53]" style={{ width: project.progress + "%" }} /></span><span className="font-mono text-[9px] text-[#767a71]">{project.progress}%</span></div></td>
                    <td className="px-4 py-4 text-[10px] text-[#676b63]">{project.due}</td>
                    <td className="px-6 py-4 text-right text-xs font-semibold">{project.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#dedbd1] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Recent activity</h2><p className="mt-1 text-[10px] text-[#8d9088]">Across your workspace</p></div><button className="grid h-8 w-8 place-items-center rounded-lg text-[#858980] hover:bg-[#f1efe8]" aria-label="Activity options"><Icon name="dots" className="h-4 w-4" /></button></div>
          <div className="mt-6 space-y-5">
            {activity.map((item, index) => (
              <div key={item.title} className="relative flex gap-3.5">
                {index < activity.length - 1 ? <span className="absolute left-[17px] top-9 h-8 w-px bg-[#e2dfd6]" /> : null}
                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-[11px] text-[#31352d]" style={{ background: item.color }}><Icon name={item.icon} className="h-4 w-4" /></span>
                <div className="min-w-0 pt-0.5"><p className="text-[11px] font-semibold">{item.title}</p><p className="mt-1 truncate text-[9px] text-[#858980]">{item.detail}</p><p className="mt-1 font-mono text-[8px] text-[#afb0aa]">{item.time} ago</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
