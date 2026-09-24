import type { Metadata } from "next";
import { NewProjectForm } from "@/components/account/account-forms";
import { AccountHeading, EmptyState, LoadErrorBanner, panelClass, ProjectList, SectionTitle } from "@/components/account/account-ui";
import { Icon } from "@/components/dashboard/icon";
import { getAccountData } from "@/lib/account/data";

export const metadata: Metadata = { title: "My projects" };

export default async function ProjectsPage() {
  const { projects, loadError } = await getAccountData();
  return (
    <>
      <AccountHeading eyebrow="Your workspace" title="My projects." description="Your ideas and ongoing projects, in one place. Start a private draft and follow your project status here." />
      <LoadErrorBanner message={loadError} />
      <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className={panelClass}>
          <SectionTitle title="Project library" />
          {loadError ? (
            <p className="py-7 text-sm text-[var(--muted)]">Your projects could not be loaded. Please try again later.</p>
          ) : projects.length ? (
            <ProjectList projects={projects} />
          ) : (
            <EmptyState icon="projects" title="Your first project starts here.">Give your idea a name using the form. You can then submit a request with more details about what you need.</EmptyState>
          )}
          <p className="mt-6 border-t border-[var(--line)] pt-4 text-[11px] leading-5 text-[var(--muted)]">Showing up to 100 recently updated projects. Statuses are read-only here.</p>
        </section>
        <div className="space-y-5">
          <section className={panelClass}><SectionTitle title="Start a project" /><NewProjectForm /></section>
          <div className="flex gap-3 px-2 text-[11px] leading-5 text-[var(--muted)]"><Icon className="mt-0.5 h-4 w-4 shrink-0" name="lock" /><p>Projects here belong to your account. Creating a draft does not add it to Ennearock’s public portfolio.</p></div>
        </div>
      </div>
    </>
  );
}
