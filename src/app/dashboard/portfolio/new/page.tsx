import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { PortfolioEditor } from "@/components/dashboard/portfolio-editor";
import { emptyPortfolioDraft } from "@/components/dashboard/admin-types";
import { getSuggestedSortOrder } from "../../data";

export const metadata: Metadata = {
  title: "New portfolio project",
};

export default async function NewPortfolioProjectPage() {
  const sortOrder = await getSuggestedSortOrder();
  const project = {
    ...emptyPortfolioDraft,
    sortOrder,
    metrics: emptyPortfolioDraft.metrics.map((metric) => ({ ...metric })),
    stack: [...emptyPortfolioDraft.stack],
    pages: [...emptyPortfolioDraft.pages],
    features: [...emptyPortfolioDraft.features],
    story: {
      ...emptyPortfolioDraft.story,
      challenge: {
        ...emptyPortfolioDraft.story.challenge,
        body: [...emptyPortfolioDraft.story.challenge.body],
      },
      solution: {
        ...emptyPortfolioDraft.story.solution,
        body: [...emptyPortfolioDraft.story.solution.body],
      },
      outcomes: [...emptyPortfolioDraft.story.outcomes],
    },
  };

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio · New draft"
        title="Create a case study"
        description="Start with the essentials, shape the story, then publish when every detail is ready."
      />
      <PortfolioEditor initialProject={project} />
    </div>
  );
}
