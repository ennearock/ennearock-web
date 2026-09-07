import "server-only";

import {
  defaultPortfolioProjects,
  defaultSiteContent,
  type ProjectStory,
  type SiteContent,
  type SiteContentKey,
} from "@/lib/content";
import { requireAdmin } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PortfolioDraft,
  PortfolioListItem,
} from "@/components/dashboard/admin-types";

type DatabaseError = { code?: string; message?: string } | null;

type ContentRow = {
  key: SiteContentKey;
  content: Record<string, unknown>;
  published: boolean;
  updated_at: string | null;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  theme: "light" | "dark" | "warm";
  accent: string;
  cover_image_url: string | null;
  client: string | null;
  duration: string | null;
  engagement: string | null;
  metrics: { label?: unknown; value?: unknown }[] | null;
  stack: string[] | null;
  pages: string[] | null;
  features: string[] | null;
  story: ProjectStory | null;
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string | null;
};

const projectColumns = [
  "id",
  "slug",
  "name",
  "tagline",
  "description",
  "category",
  "theme",
  "accent",
  "cover_image_url",
  "client",
  "duration",
  "engagement",
  "metrics",
  "stack",
  "pages",
  "features",
  "story",
  "featured",
  "sort_order",
  "seo_title",
  "seo_description",
  "published_at",
  "updated_at",
].join(",");

export const contentSetupMessage =
  "Apply the latest admin-content migration and give this account the admin role, then reload the workspace.";

const databaseRoleMessage =
  "This account can open the admin, but it still needs profiles.role = admin before it can read drafts or publish content.";

function setupIssue(error: DatabaseError) {
  if (!error) return null;
  if (["42P01", "42703", "PGRST204", "PGRST205"].includes(error.code ?? "")) {
    return contentSetupMessage;
  }
  if (["42501", "PGRST301"].includes(error.code ?? "")) {
    return "This account can open the admin, but it still needs the database admin role before it can read and publish content.";
  }
  return "The content service could not be reached. Your current website defaults are shown below; try reloading shortly.";
}

function mergeSection<T extends Record<string, unknown>>(
  fallback: T,
  value: unknown,
): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return { ...fallback, ...(value as Partial<T>) };
}

export async function getDashboardSiteContent(): Promise<{
  content: SiteContent;
  updatedAt: string | null;
  setupMessage: string | null;
}> {
  const admin = await requireAdmin("/dashboard/homepage");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, content, published, updated_at")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return {
      content: defaultSiteContent,
      updatedAt: null,
      setupMessage: setupIssue(error),
    };
  }

  const rows = data as ContentRow[];
  const content = { ...defaultSiteContent };
  for (const row of rows) {
    const fallback = defaultSiteContent[row.key] as unknown as Record<
      string,
      unknown
    >;
    content[row.key] = mergeSection(fallback, row.content) as never;
  }

  const updatedAt = rows.reduce<string | null>((latest, row) => {
    if (!row.updated_at) return latest;
    return !latest || row.updated_at > latest ? row.updated_at : latest;
  }, null);

  return {
    content,
    updatedAt,
    setupMessage:
      admin.authorizationSource === "allowlist" ? databaseRoleMessage : null,
  };
}

function validStory(value: unknown): value is ProjectStory {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const story = value as Partial<ProjectStory>;
  return (
    typeof story.intro === "string" &&
    !!story.challenge &&
    typeof story.challenge.title === "string" &&
    Array.isArray(story.challenge.body) &&
    !!story.solution &&
    typeof story.solution.title === "string" &&
    Array.isArray(story.solution.body) &&
    Array.isArray(story.outcomes)
  );
}

function rowToDraft(row: ProductRow): PortfolioDraft {
  const fallbackStory: ProjectStory = {
    intro: "",
    challenge: { title: "", body: [""] },
    solution: { title: "", body: [""] },
    outcomes: [""],
  };

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    theme: row.theme,
    accent: row.accent,
    coverImageUrl: row.cover_image_url ?? "",
    client: row.client ?? "",
    duration: row.duration ?? "",
    engagement: row.engagement ?? "",
    metrics: (row.metrics ?? [])
      .filter(
        (metric) =>
          typeof metric.label === "string" && typeof metric.value === "string",
      )
      .map((metric) => ({
        label: String(metric.label),
        value: String(metric.value),
      })),
    stack: row.stack ?? [],
    pages: row.pages ?? [],
    features: row.features ?? [],
    story: validStory(row.story) ? row.story : fallbackStory,
    featured: row.featured,
    published: Boolean(row.published_at),
    sortOrder: row.sort_order,
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    updatedAt: row.updated_at,
  };
}

function fallbackDrafts(): PortfolioDraft[] {
  return defaultPortfolioProjects.map((project, index) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    description: project.description,
    category: project.category,
    theme: project.theme,
    accent: project.accent,
    coverImageUrl: project.coverImageUrl ?? "",
    client: project.client,
    duration: project.duration,
    engagement: project.engagement,
    metrics: project.metrics ?? [],
    stack: project.stack,
    pages: project.pages,
    features: project.features,
    story: project.story,
    featured: project.featured,
    published: true,
    sortOrder: project.sortOrder ?? index,
    seoTitle: project.seoTitle ?? "",
    seoDescription: project.seoDescription ?? "",
    updatedAt: project.updatedAt,
  }));
}

export async function getDashboardPortfolio(): Promise<{
  projects: PortfolioListItem[];
  drafts: PortfolioDraft[];
  setupMessage: string | null;
}> {
  const admin = await requireAdmin("/dashboard/portfolio");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(projectColumns)
    .eq("kind", "project")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  const drafts = error || !data
    ? fallbackDrafts()
    : (data as unknown as ProductRow[]).map(rowToDraft);
  const projects = drafts.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    category: project.category,
    accent: project.accent,
    coverImageUrl: project.coverImageUrl,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    updatedAt: project.updatedAt,
  }));

  return {
    projects,
    drafts,
    setupMessage:
      setupIssue(error) ??
      (admin.authorizationSource === "allowlist" ? databaseRoleMessage : null),
  };
}

export async function getDashboardProject(id: string): Promise<{
  project: PortfolioDraft | null;
  setupMessage: string | null;
}> {
  const admin = await requireAdmin("/dashboard/portfolio/" + id);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(projectColumns)
    .eq("id", id)
    .eq("kind", "project")
    .maybeSingle();

  if (!error && data) {
    return {
      project: rowToDraft(data as unknown as ProductRow),
      setupMessage:
        admin.authorizationSource === "allowlist" ? databaseRoleMessage : null,
    };
  }

  const fallback = fallbackDrafts().find((project) => project.id === id) ?? null;
  return { project: fallback, setupMessage: setupIssue(error) };
}

export async function getSuggestedSortOrder() {
  const { drafts } = await getDashboardPortfolio();
  return drafts.reduce((maximum, project) => Math.max(maximum, project.sortOrder), -1) + 1;
}
