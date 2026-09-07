import type { Product } from "@/data/catalog";

export const SITE_CONTENT_KEYS = [
  "general",
  "announcement",
  "hero",
  "metrics",
  "templates",
  "services",
  "portfolio",
  "process",
  "testimonial",
  "pricing",
  "cta",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

export interface LinkItem {
  label: string;
  href: string;
}

export interface GeneralContent {
  brandName: string;
  brandDescription: string;
  contactEmail: string;
  location: string;
  copyright: string;
  headerLoginLabel: string;
  headerLoginHref: string;
  headerCtaLabel: string;
  headerCtaHref: string;
  socials: LinkItem[];
}

export interface AnnouncementContent {
  enabled: boolean;
  badge: string;
  text: string;
  linkLabel: string;
  linkHref: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  proofValue: string;
  proofText: string;
  avatars: string[];
  previewTitle: string;
  previewAccent: string;
  statusTitle: string;
  statusText: string;
  growthLabel: string;
  growthValue: string;
  growthTrend: string;
  trustLabel: string;
  clientNames: string[];
}

export interface MetricItem {
  value: string;
  label: string;
}

export interface MetricsContent {
  items: MetricItem[];
}

export interface SectionIntroContent {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
}

export interface TemplatesContent extends SectionIntroContent {
  ctaLabel: string;
  ctaHref: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ServicesContent extends SectionIntroContent {
  note: string;
  noteEmphasis: string;
  items: ServiceItem[];
}

export interface PortfolioContent extends SectionIntroContent {
  ctaLabel: string;
  ctaHref: string;
}

export interface ProcessItem {
  title: string;
  description: string;
}

export interface ProcessContent extends SectionIntroContent {
  items: ProcessItem[];
}

export interface TestimonialContent {
  quote: string;
  personName: string;
  personRole: string;
  initials: string;
  score: string;
  source: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  suffix: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
}

export interface PricingContent extends SectionIntroContent {
  note: string;
  noteLinkLabel: string;
  noteLinkHref: string;
  plans: PricingPlan[];
}

export interface CtaContent {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export interface SiteContent {
  general: GeneralContent;
  announcement: AnnouncementContent;
  hero: HeroContent;
  metrics: MetricsContent;
  templates: TemplatesContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  process: ProcessContent;
  testimonial: TestimonialContent;
  pricing: PricingContent;
  cta: CtaContent;
}

export interface ProjectStory {
  intro: string;
  challenge: { title: string; body: string[] };
  solution: { title: string; body: string[] };
  outcomes: string[];
}

export interface PublicProduct extends Product {
  sortOrder: number;
  coverImageUrl?: string;
  client?: string;
  duration?: string;
  engagement?: string;
  story?: ProjectStory;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
}

export type PortfolioProject = PublicProduct & {
  kind: "project";
  client: string;
  duration: string;
  engagement: string;
  story: ProjectStory;
};
