"use server";

import { revalidatePath, updateTag } from "next/cache";
import {
  defaultSiteContent,
  SITE_CONTENT_KEYS,
  type GeneralContent,
  type SiteContent,
  type SiteContentKey,
} from "@/lib/content";
import {
  PRODUCTS_CACHE_TAG,
  SITE_CONTENT_CACHE_TAG,
} from "@/lib/content/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ActionState,
  PortfolioDraft,
  PortfolioMetric,
  PortfolioStory,
} from "@/components/dashboard/admin-types";

type UnknownRecord = Record<string, unknown>;
type DatabaseError = { code?: string; message?: string } | null;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const colorPattern = /^#[0-9a-f]{6}$/i;
const portfolioCategories = [
  "SaaS",
  "E-commerce",
  "Portfolio",
  "AI",
  "Healthcare",
  "Fintech",
] as const;
const homepageKeys = SITE_CONTENT_KEYS.filter((key) => key !== "general");
const sectionOrder = new Map(
  SITE_CONTENT_KEYS.map((key, index) => [key, (index + 1) * 10]),
);

function errorState(message: string): ActionState {
  return { status: "error", message };
}

function databaseMessage(error: DatabaseError, action: string) {
  if (!error) return "The content service returned no result.";
  if (["42P01", "42703", "PGRST204", "PGRST205"].includes(error.code ?? "")) {
    return "Content storage is not ready yet. Apply the latest Supabase migration, then try again.";
  }
  if (["42501", "PGRST301"].includes(error.code ?? "")) {
    return "This account needs profiles.role = admin before it can publish changes.";
  }
  if (error.code === "23505") {
    return "That URL slug is already in use. Choose another one.";
  }
  return "We could not " + action + " right now. Please try again.";
}

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The submitted content has an invalid shape.");
  }
  return value as UnknownRecord;
}

function parsePayload(formData: FormData): UnknownRecord {
  const raw = formData.get("payload");
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 250_000) {
    throw new Error("The submitted content is empty or too large.");
  }
  try {
    return asRecord(JSON.parse(raw));
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("The submitted content could not be read.");
  }
}

function cleanText(value: unknown, label: string, maximum = 2_000) {
  if (typeof value !== "string") throw new Error(label + " is required.");
  const cleaned = value.trim();
  if (cleaned.length > maximum) {
    throw new Error(label + " must be " + maximum + " characters or fewer.");
  }
  return cleaned;
}

function requiredText(
  value: unknown,
  label: string,
  maximum: number,
  minimum = 1,
) {
  const cleaned = cleanText(value, label, maximum);
  if (cleaned.length < minimum) {
    throw new Error(label + " must be at least " + minimum + " characters.");
  }
  return cleaned;
}

function cleanLink(value: unknown, label: string) {
  const link = cleanText(value, label, 500);
  if (!link) return "";
  if (
    (link.startsWith("/") && !link.startsWith("//")) ||
    link.startsWith("#") ||
    link.startsWith("mailto:")
  ) {
    return link;
  }
  try {
    const url = new URL(link);
    if (url.protocol === "http:" || url.protocol === "https:") return link;
  } catch {
    // The shared validation message below is more useful than the URL error.
  }
  throw new Error(label + " must be a site path or an http(s) URL.");
}

function cleanImageLink(value: unknown, label: string) {
  const link = cleanText(value, label, 1_000);
  if (!link) return "";
  if (link.startsWith("/") && !link.startsWith("//")) return link;

  try {
    const url = new URL(link);
    if (url.protocol === "http:" || url.protocol === "https:") return link;
  } catch {
    // Use the shared field-specific validation message below.
  }

  throw new Error(label + " must be a site image path or an http(s) URL.");
}

function cleanStringArray(
  value: unknown,
  label: string,
  maximumItems = 12,
  maximumLength = 180,
) {
  if (!Array.isArray(value)) throw new Error(label + " must be a list.");
  if (value.length > maximumItems) {
    throw new Error(label + " can contain at most " + maximumItems + " items.");
  }
  return value
    .map((item, index) =>
      cleanText(item, label + " item " + (index + 1), maximumLength),
    )
    .filter(Boolean);
}

function cleanAgainstTemplate(template: unknown, value: unknown, path: string): unknown {
  if (typeof template === "string") {
    return path.toLowerCase().endsWith("href")
      ? cleanLink(value, path)
      : cleanText(value, path);
  }
  if (typeof template === "boolean") {
    if (typeof value !== "boolean") throw new Error(path + " must be true or false.");
    return value;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) throw new Error(path + " must be a list.");
    if (value.length > 12) throw new Error(path + " can contain at most 12 items.");
    const itemTemplate = template[0];
    if (itemTemplate === undefined) return [];
    return value.map((item, index) =>
      cleanAgainstTemplate(itemTemplate, item, path + " " + (index + 1)),
    );
  }
  if (template && typeof template === "object" && !Array.isArray(template)) {
    const source = asRecord(value);
    return Object.fromEntries(
      Object.entries(template as UnknownRecord).map(([key, childTemplate]) => [
        key,
        cleanAgainstTemplate(childTemplate, source[key], path + "." + key),
      ]),
    );
  }
  throw new Error(path + " has an unsupported value.");
}

function cleanSiteSection<K extends SiteContentKey>(
  key: K,
  value: unknown,
): SiteContent[K] {
  return cleanAgainstTemplate(defaultSiteContent[key], value, key) as SiteContent[K];
}

function cleanMetrics(value: unknown): PortfolioMetric[] {
  if (!Array.isArray(value) || value.length > 4) {
    throw new Error("Metrics must contain between one and four items.");
  }
  return value
    .map((item, index) => {
      const metric = asRecord(item);
      return {
        label: cleanText(metric.label, "Metric " + (index + 1) + " label", 60),
        value: cleanText(metric.value, "Metric " + (index + 1) + " value", 24),
      };
    })
    .filter((metric) => metric.label || metric.value);
}

function cleanStory(value: unknown): PortfolioStory {
  const story = asRecord(value);
  const challenge = asRecord(story.challenge);
  const solution = asRecord(story.solution);
  return {
    intro: cleanText(story.intro, "Story introduction", 2_000),
    challenge: {
      title: cleanText(challenge.title, "Challenge title", 180),
      body: cleanStringArray(challenge.body, "Challenge paragraphs", 6, 2_000),
    },
    solution: {
      title: cleanText(solution.title, "Solution title", 180),
      body: cleanStringArray(solution.body, "Solution paragraphs", 6, 2_000),
    },
    outcomes: cleanStringArray(story.outcomes, "Outcomes", 8, 240),
  };
}

function cleanPortfolio(value: UnknownRecord): PortfolioDraft {
  const theme = cleanText(value.theme, "Theme", 12);
  if (!(["light", "dark", "warm"] as string[]).includes(theme)) {
    throw new Error("Choose a valid visual theme.");
  }
  const accent = cleanText(value.accent, "Accent color", 7);
  if (!colorPattern.test(accent)) throw new Error("Use a six-digit hex accent color.");
  const id = value.id === null || value.id === "" ? null : cleanText(value.id, "Project ID", 36);
  if (id && !uuidPattern.test(id)) throw new Error("The project ID is invalid.");
  const slug = requiredText(value.slug, "URL slug", 80);
  if (!slugPattern.test(slug)) {
    throw new Error("The URL slug can use lowercase letters, numbers, and single hyphens only.");
  }
  const category = requiredText(value.category, "Category", 60);
  if (!(portfolioCategories as readonly string[]).includes(category)) {
    throw new Error("Choose a supported portfolio category.");
  }
  const coverImageUrl = cleanImageLink(value.coverImageUrl, "Cover image URL");
  const sortOrder = Number(value.sortOrder);
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10_000) {
    throw new Error("Sort order must be a whole number between 0 and 10,000.");
  }

  return {
    id,
    slug,
    name: requiredText(value.name, "Project name", 120, 2),
    tagline: cleanText(value.tagline, "Tagline", 180),
    description: cleanText(value.description, "Summary", 1_200),
    category,
    theme: theme as PortfolioDraft["theme"],
    accent,
    coverImageUrl,
    client: cleanText(value.client, "Client", 120),
    duration: cleanText(value.duration, "Timeline", 80),
    engagement: cleanText(value.engagement, "Engagement", 180),
    metrics: cleanMetrics(value.metrics),
    stack: cleanStringArray(value.stack, "Technology stack", 16, 80),
    pages: cleanStringArray(value.pages, "Delivered pages", 16, 120),
    features: cleanStringArray(value.features, "Features", 16, 180),
    story: cleanStory(value.story),
    featured: Boolean(value.featured),
    published: Boolean(value.published),
    sortOrder,
    seoTitle: cleanText(value.seoTitle, "SEO title", 70),
    seoDescription: cleanText(value.seoDescription, "SEO description", 180),
  };
}

function assertPublishReady(project: PortfolioDraft) {
  const checks: [string, string][] = [
    [project.tagline, "Add a tagline before publishing."],
    [project.description, "Add a project summary before publishing."],
    [project.client, "Add the client before publishing."],
    [project.duration, "Add the project timeline before publishing."],
    [project.engagement, "Add the engagement scope before publishing."],
    [project.story.intro, "Add the story introduction before publishing."],
    [project.story.challenge.title, "Add the challenge title before publishing."],
    [project.story.solution.title, "Add the solution title before publishing."],
  ];
  const missing = checks.find(([value]) => !value.trim());
  if (missing) throw new Error(missing[1]);
  if (!project.story.challenge.body.length || !project.story.solution.body.length) {
    throw new Error("Add challenge and solution copy before publishing.");
  }
}

function portfolioStoragePath(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) return null;

  try {
    const assetUrl = new URL(value);
    const projectUrl = new URL(supabaseUrl);
    const prefix = "/storage/v1/object/public/portfolio/";

    if (
      assetUrl.origin !== projectUrl.origin ||
      !assetUrl.pathname.startsWith(prefix)
    ) {
      return null;
    }

    const path = decodeURIComponent(assetUrl.pathname.slice(prefix.length));
    return path && !path.includes("\0") ? path : null;
  } catch {
    return null;
  }
}

function revalidatePortfolio(...slugs: (string | null | undefined)[]) {
  updateTag(PRODUCTS_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath("/projects/" + slug);
  }
}

export async function savePortfolioAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin("/dashboard/portfolio");
  let project: PortfolioDraft;
  try {
    project = cleanPortfolio(parsePayload(formData));
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Check the project fields and try again.");
  }

  const intent = String(formData.get("intent") ?? "save");
  if (!["save", "publish", "unpublish"].includes(intent)) {
    return errorState("Choose a valid publishing action.");
  }
  const published =
    intent === "publish"
      ? true
      : intent === "unpublish"
        ? false
        : project.published;
  if (published) {
    try {
      assertPublishReady(project);
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Complete the project before publishing.");
    }
  }

  const supabase = await createServerSupabaseClient();
  let previousSlug: string | null = null;
  let previousCoverImageUrl: string | null = null;
  let previousPublishedAt: string | null = null;
  if (project.id) {
    const { data } = await supabase
      .from("products")
      .select("slug, cover_image_url, published_at")
      .eq("id", project.id)
      .eq("kind", "project")
      .maybeSingle();
    previousSlug = typeof data?.slug === "string" ? data.slug : null;
    previousCoverImageUrl =
      typeof data?.cover_image_url === "string" ? data.cover_image_url : null;
    previousPublishedAt =
      typeof data?.published_at === "string" ? data.published_at : null;
  }

  const record = {
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    description: project.description,
    kind: "project",
    category: project.category,
    price: 0,
    price_label: "Case study",
    featured: project.featured,
    badge: "Client project",
    theme: project.theme,
    accent: project.accent.toUpperCase(),
    metrics: project.metrics,
    stack: project.stack,
    pages: project.pages,
    features: project.features,
    status: "case-study",
    sort_order: project.sortOrder,
    cover_image_url: project.coverImageUrl || null,
    client: project.client || null,
    duration: project.duration || null,
    engagement: project.engagement || null,
    story: project.story,
    seo_title: project.seoTitle || null,
    seo_description: project.seoDescription || null,
    updated_by: admin.id,
    published_at: published
      ? previousPublishedAt ?? new Date().toISOString()
      : null,
  };

  const mutation = project.id
    ? supabase
        .from("products")
        .update(record)
        .eq("id", project.id)
        .eq("kind", "project")
        .select("id, slug")
        .maybeSingle()
    : supabase.from("products").insert(record).select("id, slug").single();
  const { data, error } = await mutation;

  if (error) return errorState(databaseMessage(error, "save this project"));
  if (!data) {
    return errorState(
      "No project was saved. Confirm that it still exists and this account has the database admin role.",
    );
  }

  let mediaCleanupFailed = false;
  if (
    previousCoverImageUrl &&
    previousCoverImageUrl !== project.coverImageUrl
  ) {
    const oldCoverPath = portfolioStoragePath(previousCoverImageUrl);
    if (oldCoverPath) {
      const { error: cleanupError } = await supabase.storage
        .from("portfolio")
        .remove([oldCoverPath]);
      mediaCleanupFailed = Boolean(cleanupError);
    }
  }

  revalidatePortfolio(previousSlug, data.slug);
  return {
    status: "success",
    message:
      (intent === "publish"
        ? "Project published."
        : intent === "unpublish"
          ? "Project moved back to draft."
          : published
            ? "Published project updated."
            : "Draft saved.") +
      (mediaCleanupFailed
        ? " The previous cover could not be removed from storage."
        : ""),
    id: data.id,
    slug: data.slug,
    published,
  };
}

export async function deletePortfolioAction(id: string): Promise<ActionState> {
  await requireAdmin("/dashboard/portfolio");
  if (!uuidPattern.test(id)) return errorState("The project ID is invalid.");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("kind", "project")
    .select("id, slug, cover_image_url")
    .maybeSingle();
  if (error) return errorState(databaseMessage(error, "delete this project"));
  if (!data) {
    return errorState(
      "No project was deleted. Confirm that it still exists and this account has the database admin role.",
    );
  }

  let mediaCleanupFailed = false;
  const coverPath = portfolioStoragePath(data.cover_image_url);
  if (coverPath) {
    const { error: cleanupError } = await supabase.storage
      .from("portfolio")
      .remove([coverPath]);
    mediaCleanupFailed = Boolean(cleanupError);
  }

  revalidatePortfolio(data.slug);
  return {
    status: "success",
    message: mediaCleanupFailed
      ? "Project deleted. Its cover still needs to be removed from storage."
      : "Project deleted.",
  };
}

export async function saveHomepageAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin("/dashboard/homepage");
  let payload: UnknownRecord;
  try {
    payload = parsePayload(formData);
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "The homepage content could not be read.");
  }

  let rows;
  try {
    rows = homepageKeys.map((key) => ({
      key,
      content: cleanSiteSection(key, payload[key]),
      published: true,
      sort_order: sectionOrder.get(key) ?? 0,
      updated_by: admin.id,
    }));
    const hero = rows.find((row) => row.key === "hero")?.content as SiteContent["hero"] | undefined;
    if (hero && !colorPattern.test(hero.previewAccent)) {
      return errorState("Hero preview accent must be a six-digit hex color.");
    }
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Check the homepage fields and try again.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(rows, { onConflict: "key" });
  if (error) return errorState(databaseMessage(error, "publish the homepage"));

  updateTag(SITE_CONTENT_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/homepage");
  return { status: "success", message: "Homepage changes published." };
}

export async function saveGeneralAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin("/dashboard/settings");
  let general: GeneralContent;
  try {
    general = cleanSiteSection("general", parsePayload(formData));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.contactEmail)) {
      return errorState("Enter a valid contact email address.");
    }
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Check the site settings and try again.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key: "general",
      content: general,
      published: true,
      sort_order: sectionOrder.get("general") ?? 0,
      updated_by: admin.id,
    },
    { onConflict: "key" },
  );
  if (error) return errorState(databaseMessage(error, "save the site settings"));

  updateTag(SITE_CONTENT_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/dashboard/settings");
  return { status: "success", message: "Site settings published." };
}
