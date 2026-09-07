import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { PortfolioEditor } from "@/components/dashboard/portfolio-editor";
import { getDashboardProject } from "../../data";

type ProjectEditorPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit portfolio project",
};

export default async function ProjectEditorPage({ params }: ProjectEditorPageProps) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { project, setupMessage } = await getDashboardProject(id);
  if (!project) notFound();

  return (
    <div>
      <PageHeader
        eyebrow={project.published ? "Portfolio · Published" : "Portfolio · Draft"}
        title={project.name}
        description="Refine the case study, review its publishing checklist, and keep the public project page current."
      />
      <PortfolioEditor initialProject={project} setupMessage={setupMessage} />
    </div>
  );
}
