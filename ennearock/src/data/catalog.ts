export const categories = [
  "All",
  "SaaS",
  "E-commerce",
  "Portfolio",
  "AI",
  "Healthcare",
  "Fintech",
] as const;

export const productKinds = ["template", "project"] as const;
export const productStatuses = [
  "available",
  "case-study",
  "coming-soon",
] as const;

export type ProductCategory = Exclude<(typeof categories)[number], "All">;
export type ProductKind = (typeof productKinds)[number];
export type ProductStatus = (typeof productStatuses)[number];
export type ProductTheme = "light" | "dark" | "warm";

export interface ProductMetric {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: ProductKind;
  category: ProductCategory;
  price: number;
  priceLabel: string;
  featured: boolean;
  badge?: string;
  theme: ProductTheme;
  accent: string;
  metrics?: ProductMetric[];
  stack: string[];
  pages: string[];
  features: string[];
  updatedAt: string;
  status: ProductStatus;
}

export type Project = Product & { kind: "project" };

export interface CatalogFilters {
  query?: string;
  category?: ProductCategory | "All" | string;
  kind?: ProductKind;
  featured?: boolean;
  status?: ProductStatus;
}

export const products: Product[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "nexus-workspace",
    name: "Nexus Workspace",
    tagline: "A calm operating system for ambitious teams.",
    description:
      "A conversion-focused SaaS kit with a polished marketing site, collaborative workspace, analytics, billing, and account settings.",
    kind: "template",
    category: "SaaS",
    price: 129,
    priceLabel: "€129",
    featured: true,
    badge: "Best seller",
    theme: "light",
    accent: "#7C5CFC",
    metrics: [
      { label: "Screens", value: "34" },
      { label: "Components", value: "80+" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    pages: ["Landing", "Pricing", "Dashboard", "Projects", "Billing"],
    features: [
      "Responsive application shell",
      "Team and project workflows",
      "Subscription-ready pricing",
      "Accessible UI states",
    ],
    updatedAt: "2026-08-24",
    status: "available",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "atelier-folio",
    name: "Atelier Folio",
    tagline: "Editorial storytelling for independent creatives.",
    description:
      "A refined portfolio system for studios, designers, and photographers, built around generous typography and immersive project stories.",
    kind: "template",
    category: "Portfolio",
    price: 89,
    priceLabel: "€89",
    featured: false,
    theme: "warm",
    accent: "#E16B4A",
    metrics: [
      { label: "Layouts", value: "18" },
      { label: "CMS collections", value: "4" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    pages: ["Home", "Work", "Case study", "Studio", "Journal", "Contact"],
    features: [
      "Modular case studies",
      "Journal and project collections",
      "Subtle motion system",
      "Image-first responsive layouts",
    ],
    updatedAt: "2026-08-17",
    status: "available",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "pulsecare-clinic",
    name: "PulseCare Clinic",
    tagline: "Digital care journeys patients can trust.",
    description:
      "A reassuring healthcare template for modern clinics, with practitioner discovery, appointment flows, patient resources, and service pages.",
    kind: "template",
    category: "Healthcare",
    price: 149,
    priceLabel: "€149",
    featured: true,
    badge: "New",
    theme: "light",
    accent: "#1FA58A",
    metrics: [
      { label: "Pages", value: "22" },
      { label: "Booking steps", value: "3" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    pages: ["Services", "Practitioners", "Booking", "Resources", "Patient portal"],
    features: [
      "Practitioner directory",
      "Appointment request flow",
      "Patient-friendly content blocks",
      "Privacy-conscious form patterns",
    ],
    updatedAt: "2026-08-28",
    status: "available",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    slug: "cartlane-commerce",
    name: "Cartlane Commerce",
    tagline: "A storefront tuned for discovery and repeat sales.",
    description:
      "A high-performance commerce foundation with rich collections, product storytelling, cart flows, customer accounts, and merchandising blocks.",
    kind: "template",
    category: "E-commerce",
    price: 139,
    priceLabel: "€139",
    featured: true,
    badge: "Popular",
    theme: "dark",
    accent: "#E8FF65",
    metrics: [
      { label: "Sections", value: "42" },
      { label: "Store flows", value: "9" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
    pages: ["Store", "Collection", "Product", "Cart", "Account", "Journal"],
    features: [
      "Collection filtering",
      "Variant-rich product pages",
      "Persistent cart patterns",
      "Campaign landing sections",
    ],
    updatedAt: "2026-08-12",
    status: "available",
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    slug: "orbit-ai-studio",
    name: "Orbit AI Studio",
    tagline: "Turn powerful AI workflows into an intuitive product.",
    description:
      "A complete interface kit for AI products, combining prompt workspaces, usage insights, model controls, onboarding, and plan management.",
    kind: "template",
    category: "AI",
    price: 159,
    priceLabel: "€159",
    featured: true,
    badge: "Editor's pick",
    theme: "dark",
    accent: "#8B7CFF",
    metrics: [
      { label: "Product screens", value: "28" },
      { label: "AI states", value: "16" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI"],
    pages: ["Landing", "Playground", "Library", "Usage", "Team", "Settings"],
    features: [
      "Prompt and generation workspace",
      "Streaming response states",
      "Usage and credit dashboards",
      "Model configuration patterns",
    ],
    updatedAt: "2026-08-29",
    status: "available",
  },
  {
    id: "10000000-0000-4000-8000-000000000006",
    slug: "ledgerly-finance",
    name: "Ledgerly Finance",
    tagline: "Financial clarity without the spreadsheet fatigue.",
    description:
      "A trustworthy fintech dashboard for cash flow, budgets, transactions, and reports, with a marketing site and guided onboarding.",
    kind: "template",
    category: "Fintech",
    price: 169,
    priceLabel: "€169",
    featured: false,
    badge: "Coming soon",
    theme: "light",
    accent: "#2C6BED",
    metrics: [
      { label: "Dashboards", value: "12" },
      { label: "Chart patterns", value: "14" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
    pages: ["Overview", "Transactions", "Budgets", "Reports", "Connections"],
    features: [
      "Cash-flow overview",
      "Transaction categorization",
      "Budget progress states",
      "Export-ready reporting",
    ],
    updatedAt: "2026-08-22",
    status: "coming-soon",
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    slug: "northstar-operations",
    name: "Northstar Operations",
    tagline: "One shared view for a fast-moving operations team.",
    description:
      "A custom operations platform that unified planning, client delivery, documents, and weekly reporting for a distributed consultancy.",
    kind: "project",
    category: "SaaS",
    price: 0,
    priceLabel: "Case study",
    featured: true,
    badge: "Client project",
    theme: "dark",
    accent: "#FFB547",
    metrics: [
      { label: "Admin time", value: "-42%" },
      { label: "Adoption", value: "96%" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    pages: ["Workspace", "Clients", "Delivery", "Reports", "Admin"],
    features: [
      "Role-aware workspaces",
      "Automated status reporting",
      "Document approval flows",
      "Operational analytics",
    ],
    updatedAt: "2026-07-30",
    status: "case-study",
  },
  {
    id: "10000000-0000-4000-8000-000000000008",
    slug: "maison-mizu",
    name: "Maison Mizu",
    tagline: "A tactile digital flagship for a modern homeware label.",
    description:
      "A custom commerce experience pairing editorial collections with a frictionless shop, localized content, and a flexible launch system.",
    kind: "project",
    category: "E-commerce",
    price: 0,
    priceLabel: "Case study",
    featured: false,
    badge: "Client project",
    theme: "warm",
    accent: "#C55A3D",
    metrics: [
      { label: "Conversion", value: "+31%" },
      { label: "Load time", value: "1.2s" },
    ],
    stack: ["Next.js", "TypeScript", "Shopify", "Sanity"],
    pages: ["Home", "Collections", "Product", "Stories", "Cart"],
    features: [
      "Editorial commerce system",
      "Localized product catalog",
      "Composable content sections",
      "Performance-focused media",
    ],
    updatedAt: "2026-08-05",
    status: "case-study",
  },
];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductBySlug(slug: string): Product | undefined {
  const normalizedSlug = slug.trim().toLocaleLowerCase();

  return products.find(
    (product) => product.slug.toLocaleLowerCase() === normalizedSlug,
  );
}

export function filterProducts(filters: CatalogFilters = {}): Product[] {
  const query = filters.query?.trim().toLocaleLowerCase();
  const category = filters.category?.trim().toLocaleLowerCase();

  return products.filter((product) => {
    if (filters.kind && product.kind !== filters.kind) return false;
    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false;
    }
    if (filters.status && product.status !== filters.status) return false;
    if (
      category &&
      category !== "all" &&
      product.category.toLocaleLowerCase() !== category
    ) {
      return false;
    }

    if (!query) return true;

    const searchableText = [
      product.name,
      product.tagline,
      product.description,
      product.category,
      product.kind,
      ...product.stack,
      ...product.pages,
      ...product.features,
    ]
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(query);
  });
}

export function getProductsByCategory(
  category: ProductCategory | "All" | string,
): Product[] {
  return filterProducts({ category });
}

export function searchProducts(query: string): Product[] {
  return filterProducts({ query });
}
