import { products } from "@/data/catalog";
import type {
  PortfolioProject,
  ProjectStory,
  PublicProduct,
  SiteContent,
} from "./types";

export const defaultSiteContent: SiteContent = {
  general: {
    brandName: "ennearock",
    brandDescription:
      "Digital products engineered for clarity, momentum, and measurable growth.",
    contactEmail: "hello@ennearock.com",
    location: "Paris · Working worldwide",
    copyright: "Ennearock Studio. Built with intention.",
    headerLoginLabel: "Log in",
    headerLoginHref: "/login",
    headerCtaLabel: "Start a project",
    headerCtaHref: "/signup",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "Instagram", href: "https://www.instagram.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Behance", href: "https://www.behance.net" },
    ],
  },
  announcement: {
    enabled: true,
    badge: "New",
    text: "Six launch-ready templates just landed.",
    linkLabel: "Explore the collection",
    linkHref: "/templates",
  },
  hero: {
    eyebrow: "Independent digital product studio",
    title: "We build digital\nproducts that",
    accentTitle: "pull\ntheir weight.",
    description:
      "Strategy, design, and engineering for ambitious teams who want to move quickly without blending in.",
    primaryCtaLabel: "Start a project",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Browse templates",
    secondaryCtaHref: "/templates",
    proofValue: "4.9/5",
    proofText: "from founders worldwide",
    avatars: ["MA", "JL", "SK", "+8"],
    previewTitle: "Nexa",
    previewAccent: "#c8f36a",
    statusTitle: "Launch ready",
    statusText: "All systems operational",
    growthLabel: "Conversion rate",
    growthValue: "+38.4%",
    growthTrend: "↗ 12.6%",
    trustLabel: "Trusted by ambitious teams at",
    clientNames: ["northstar", "Morrow", "VERTEX", "Arc & Co.", "formly"],
  },
  metrics: {
    items: [
      { value: "32", label: "Products shipped" },
      { value: "14", label: "Design awards" },
      { value: "97%", label: "On-time launches" },
      { value: "6 yrs", label: "Building together" },
    ],
  },
  templates: {
    eyebrow: "Ready to launch",
    title: "A head start that doesn't",
    accentTitle: "look like one.",
    description:
      "Production-ready templates with the polish of a custom build. Pick a direction, make it yours, and launch in days.",
    ctaLabel: "View all templates",
    ctaHref: "/templates",
  },
  services: {
    eyebrow: "What we do",
    title: "One senior team,",
    accentTitle: "every layer covered.",
    description:
      "No handoffs, no black boxes. The people in the room are the people doing the work—from first idea to final deploy.",
    note: "Small by design.",
    noteEmphasis: "Senior by default.",
    items: [
      {
        title: "Strategy & positioning",
        description:
          "Sharp thinking before pixels. We find the clearest story, audience, and path to growth.",
      },
      {
        title: "Product design",
        description:
          "Interfaces that feel obvious, distinct, and built around what your customers actually need.",
      },
      {
        title: "Web development",
        description:
          "Fast, accessible, scalable builds made with modern technology and clean foundations.",
      },
      {
        title: "Growth systems",
        description:
          "Analytics, experiments, and conversion improvements that compound after launch.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Selected work",
    title: "Built to move the",
    accentTitle: "business forward.",
    description:
      "Pretty is part of it. The real goal is a digital product that changes what is possible for the business behind it.",
    ctaLabel: "See all projects",
    ctaHref: "/projects",
  },
  process: {
    eyebrow: "How we work",
    title: "Clear process.",
    accentTitle: "No theatre.",
    description:
      "A focused four-part rhythm that protects momentum, makes decisions visible, and leaves room for the good surprises.",
    items: [
      {
        title: "Discover",
        description:
          "We turn business context, customer insight, and constraints into a focused brief.",
      },
      {
        title: "Design",
        description:
          "Weekly working sessions keep ideas moving from rough direction to refined system.",
      },
      {
        title: "Build",
        description:
          "Design and engineering overlap, so the real product stays true to the idea.",
      },
      {
        title: "Grow",
        description:
          "We launch, measure, and keep improving the moments that matter.",
      },
    ],
  },
  testimonial: {
    quote:
      "Ennearock didn't just make the product look better. They helped us explain it, simplify it, and finally turn interest into action.",
    personName: "Amelia Klein",
    personRole: "Co-founder, Northstar",
    initials: "AK",
    score: "5.0",
    source: "Clutch review",
  },
  pricing: {
    eyebrow: "Simple ways to start",
    title: "Choose your level",
    accentTitle: "of momentum.",
    description:
      "Start with a proven foundation or bring us in for the full journey. Either way, you work with the same senior team.",
    note: "Not sure where to start?",
    noteLinkLabel: "Tell us what you're working on",
    noteLinkHref: "/contact",
    plans: [
      {
        name: "Templates",
        description: "For founders ready to build it themselves.",
        price: "From €89",
        suffix: "one time",
        features: [
          "Complete page library",
          "Figma source included",
          "Lifetime updates",
          "Setup documentation",
        ],
        ctaLabel: "Browse templates",
        ctaHref: "/templates",
        featured: false,
      },
      {
        name: "Launch sprint",
        description: "For teams that need a sharp new site, fast.",
        price: "From €4.8k",
        suffix: "2–4 weeks",
        features: [
          "Strategy & direction",
          "Custom visual system",
          "Up to 8 key pages",
          "Development & launch",
        ],
        ctaLabel: "Book a discovery call",
        ctaHref: "/contact",
        featured: true,
      },
      {
        name: "Product partnership",
        description: "For ambitious products that need a full team.",
        price: "Let's talk",
        suffix: "custom scope",
        features: [
          "Product strategy",
          "UX & interface design",
          "Full-stack engineering",
          "Ongoing growth support",
        ],
        ctaLabel: "Tell us your idea",
        ctaHref: "/contact",
        featured: false,
      },
    ],
  },
  cta: {
    eyebrow: "Have a project in mind?",
    title: "Let's make something",
    accentTitle: "worth remembering.",
    description:
      "Tell us where you want to go. We'll bring a senior product team and a clear way to get there.",
    linkLabel: "Start a project",
    linkHref: "/contact",
  },
};

export const fallbackProjectStory: ProjectStory = {
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

export const defaultProjectStories: Record<
  string,
  ProjectStory & { client: string; duration: string; engagement: string }
> = {
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

export const defaultPublishedProducts: PublicProduct[] = products.map(
  (product, index) => {
    const details = defaultProjectStories[product.slug];

    return {
      ...product,
      sortOrder: index,
      ...(product.kind === "project"
        ? {
            client: details?.client ?? "Product team",
            duration: details?.duration ?? "Built in focused sprints",
            engagement:
              details?.engagement ?? "Strategy, design & engineering",
            story: details ?? fallbackProjectStory,
          }
        : {}),
    };
  },
);

export const defaultPortfolioProjects = defaultPublishedProducts.filter(
  (product): product is PortfolioProject => product.kind === "project",
);
