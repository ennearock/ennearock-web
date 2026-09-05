import { products, type Project } from "@/data/catalog";

export interface ProjectStory {
  client: string;
  duration: string;
  engagement: string;
  intro: string;
  challenge: {
    title: string;
    body: string[];
  };
  solution: {
    title: string;
    body: string[];
  };
  outcomes: string[];
}

export const projects = products.filter(
  (product): product is Project => product.kind === "project",
);

const stories: Record<string, ProjectStory> = {
  "northstar-operations": {
    client: "Distributed consultancy",
    duration: "14 weeks",
    engagement: "Product strategy, UX & engineering",
    intro:
      "Northstar had outgrown the patchwork of tools behind its client work. Together, we shaped one focused product around the way the team actually plans, delivers, and reports.",
    challenge: {
      title: "The work moved quickly. The system around it did not.",
      body: [
        "Project context was split between documents, chat threads, and disconnected trackers. Every weekly update started with someone rebuilding the story of what had happened.",
        "The new platform needed to bring order without slowing a senior team down. It also had to give clients a useful view of progress without exposing the operational noise behind it.",
      ],
    },
    solution: {
      title: "One shared rhythm, designed into the product.",
      body: [
        "We mapped Northstar's delivery model before designing screens, then built the workspace around a small set of repeatable actions: plan, assign, approve, and report.",
        "Role-aware views keep each person close to the decisions that matter. Automated status summaries turn live project activity into a clear weekly client update.",
      ],
    },
    outcomes: [
      "A single source of truth across every active engagement",
      "Faster weekly reporting with less manual coordination",
      "A client experience that feels as considered as the consulting work",
    ],
  },
  "maison-mizu": {
    client: "Independent homeware label",
    duration: "12 weeks",
    engagement: "Commerce strategy, design & build",
    intro:
      "Maison Mizu needed an online flagship with the atmosphere of its physical spaces and the clarity of its best retail conversations. We made editorial discovery and effortless shopping part of the same journey.",
    challenge: {
      title: "A rich brand story trapped inside a standard storefront.",
      body: [
        "The existing shop treated every object as a row in a catalog. Customers could purchase, but they could not feel the material, provenance, or point of view that made the collection distinctive.",
        "The team also needed a publishing system flexible enough for launches, seasonal edits, and multiple markets without rebuilding pages each time.",
      ],
    },
    solution: {
      title: "Editorial pace with commerce discipline underneath.",
      body: [
        "We created a modular visual system that moves naturally from a story into a collection and from a collection into a product. Quiet typography and tactile compositions give each piece room to speak.",
        "Behind the scenes, Shopify and Sanity keep inventory, localized content, and campaign storytelling independent while the front end makes the experience feel seamless.",
      ],
    },
    outcomes: [
      "A distinctive flagship that carries the brand beyond the product grid",
      "A faster path from collection discovery to checkout",
      "A flexible launch system the internal team can shape without code",
    ],
  },
};

const fallbackStory: ProjectStory = {
  client: "Product team",
  duration: "Built in focused sprints",
  engagement: "Strategy, design & engineering",
  intro:
    "A close collaboration that turned a complex brief into a clear, useful digital product.",
  challenge: {
    title: "A complex problem needed a focused product.",
    body: [
      "We worked with the team to clarify the highest-value customer journey and remove friction from the moments that mattered most.",
    ],
  },
  solution: {
    title: "A cohesive system, built to keep evolving.",
    body: [
      "Strategy, design, and engineering moved together from the first working session through launch.",
    ],
  },
  outcomes: [
    "A clearer experience for customers and the team behind it",
    "A maintainable foundation for the next stage of growth",
  ],
};

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectStory(slug: string): ProjectStory {
  return stories[slug] ?? fallbackStory;
}

