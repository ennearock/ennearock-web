export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  id?: string;
  slug?: string;
  published?: boolean;
};

export type PortfolioMetric = {
  label: string;
  value: string;
};

export type PortfolioStory = {
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
};

export type PortfolioDraft = {
  id: string | null;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  theme: "light" | "dark" | "warm";
  accent: string;
  coverImageUrl: string;
  client: string;
  duration: string;
  engagement: string;
  metrics: PortfolioMetric[];
  stack: string[];
  pages: string[];
  features: string[];
  story: PortfolioStory;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  updatedAt?: string | null;
};

export type PortfolioListItem = Pick<
  PortfolioDraft,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "category"
  | "accent"
  | "coverImageUrl"
  | "featured"
  | "published"
  | "sortOrder"
  | "updatedAt"
>;

export const emptyPortfolioDraft: PortfolioDraft = {
  id: null,
  slug: "",
  name: "",
  tagline: "",
  description: "",
  category: "SaaS",
  theme: "dark",
  accent: "#7568F8",
  coverImageUrl: "",
  client: "",
  duration: "",
  engagement: "Strategy, design & engineering",
  metrics: [
    { label: "Primary outcome", value: "+0%" },
    { label: "Secondary outcome", value: "0×" },
  ],
  stack: ["Next.js", "TypeScript"],
  pages: ["Homepage", "Product"],
  features: ["Focused customer journey", "Responsive design system"],
  story: {
    intro: "",
    challenge: { title: "", body: [""] },
    solution: { title: "", body: [""] },
    outcomes: [""],
  },
  featured: false,
  published: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
};
