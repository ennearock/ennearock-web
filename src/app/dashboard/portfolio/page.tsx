import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";
import { PortfolioList } from "@/components/dashboard/portfolio-list";
import { SetupNotice } from "@/components/dashboard/editor-fields";
import { getDashboardPortfolio } from "../data";

export const metadata: Metadata = {
  title: "Portfolio",
};

type PortfolioAdminPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function PortfolioAdminPage({
  searchParams,
}: PortfolioAdminPageProps) {
  const rawStatus = (await searchParams).status;
  const requestedStatus = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const initialFilter =
    requestedStatus === "published" ||
    requestedStatus === "draft" ||
    requestedStatus === "featured"
      ? requestedStatus
      : "all";
  const { projects, setupMessage } = await getDashboardPortfolio();
  const published = projects.filter((project) => project.published).length;
  const featured = projects.filter((project) => project.featured).length;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Selected work"
        title="Portfolio"
        description="Create case studies, control their order, and choose which projects appear on the homepage."
        action={
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#11130f] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2e25]"
            href="/dashboard/portfolio/new"
          >
            <Icon className="h-4 w-4" name="plus" /> New project
          </Link>
        }
      />

      <SetupNotice message={setupMessage} />

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["All projects", String(projects.length).padStart(2, "0"), "Portfolio entries"],
          ["Published", String(published).padStart(2, "0"), "Visible on ennearock.com"],
          ["Homepage features", String(featured).padStart(2, "0"), "Marked as selected work"],
        ].map(([label, value, note], index) => (
          <div className="rounded-[18px] border border-[#dedbd1] bg-white px-5 py-4" key={label}>
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-medium text-[#74786f]">{label}</p>
              <span className={"h-2 w-2 rounded-full " + (index === 0 ? "bg-[#a5c45e]" : index === 1 ? "bg-[#7568c5]" : "bg-[#df986a]")} />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.045em]">{value}</p>
            <p className="mt-1 text-[9px] text-[#969990]">{note}</p>
          </div>
        ))}
      </section>

      <PortfolioList initialFilter={initialFilter} projects={projects} />
    </div>
  );
}
