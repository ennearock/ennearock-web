import {
  categories,
  productKinds,
  productStatuses,
  type ProductCategory,
  type ProductKind,
  type ProductStatus,
  type ProductTheme,
} from "@/data/catalog";
import {
  defaultProjectStories,
  defaultSiteContent,
  fallbackProjectStory,
} from "./defaults";
import {
  SITE_CONTENT_KEYS,
  type PortfolioProject,
  type ProjectStory,
  type PublicProduct,
  type SiteContent,
  type SiteContentKey,
} from "./types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeKnownValue(fallback: unknown, candidate: unknown): unknown {
  if (typeof fallback === "string") {
    return typeof candidate === "string" ? candidate : fallback;
  }

  if (typeof fallback === "boolean") {
    return typeof candidate === "boolean" ? candidate : fallback;
  }

  if (typeof fallback === "number") {
    return typeof candidate === "number" && Number.isFinite(candidate)
      ? candidate
      : fallback;
  }

  if (Array.isArray(fallback)) {
    if (!Array.isArray(candidate)) return fallback;
    if (fallback.length === 0) return candidate;

    const template = fallback[0];
    if (typeof template === "string") {
      return candidate.filter((item): item is string => typeof item === "string");
    }

    if (isRecord(template)) {
      return candidate
        .filter(isRecord)
        .map((item) => mergeKnownValue(template, item));
    }

    return fallback;
  }

  if (isRecord(fallback)) {
    if (!isRecord(candidate)) return fallback;

    return Object.fromEntries(
      Object.entries(fallback).map(([key, value]) => [
        key,
        mergeKnownValue(value, candidate[key]),
      ]),
    );
  }

  return fallback;
}

function isSiteContentKey(value: unknown): value is SiteContentKey {
  return (
    typeof value === "string" &&
    SITE_CONTENT_KEYS.some((key) => key === value)
  );
}

function safeHref(value: string, fallback: string): string {
  const href = value.trim();
  if (
    (href.startsWith("/") && !href.startsWith("//")) ||
    href.startsWith("#") ||
    href.startsWith("mailto:")
  ) {
    return href || fallback;
  }

  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : fallback;
  } catch {
    return fallback;
  }
}

function safeImageUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const url = value.trim();
  if (!url) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeSiteLinks(content: SiteContent): SiteContent {
  return {
    ...content,
    general: {
      ...content.general,
      headerLoginHref: safeHref(
        content.general.headerLoginHref,
        defaultSiteContent.general.headerLoginHref,
      ),
      headerCtaHref: safeHref(
        content.general.headerCtaHref,
        defaultSiteContent.general.headerCtaHref,
      ),
      socials: content.general.socials.map((social, index) => ({
        ...social,
        href: safeHref(
          social.href,
          defaultSiteContent.general.socials[index]?.href ?? "/",
        ),
      })),
    },
    announcement: {
      ...content.announcement,
      linkHref: safeHref(
        content.announcement.linkHref,
        defaultSiteContent.announcement.linkHref,
      ),
    },
    hero: {
      ...content.hero,
      primaryCtaHref: safeHref(
        content.hero.primaryCtaHref,
        defaultSiteContent.hero.primaryCtaHref,
      ),
      secondaryCtaHref: safeHref(
        content.hero.secondaryCtaHref,
        defaultSiteContent.hero.secondaryCtaHref,
      ),
      previewAccent: /^#[\da-f]{6}$/i.test(content.hero.previewAccent)
        ? content.hero.previewAccent
        : defaultSiteContent.hero.previewAccent,
    },
    templates: {
      ...content.templates,
      ctaHref: safeHref(
        content.templates.ctaHref,
        defaultSiteContent.templates.ctaHref,
      ),
    },
    portfolio: {
      ...content.portfolio,
      ctaHref: safeHref(
        content.portfolio.ctaHref,
        defaultSiteContent.portfolio.ctaHref,
      ),
    },
    pricing: {
      ...content.pricing,
      noteLinkHref: safeHref(
        content.pricing.noteLinkHref,
        defaultSiteContent.pricing.noteLinkHref,
      ),
      plans: content.pricing.plans.map((plan, index) => ({
        ...plan,
        ctaHref: safeHref(
          plan.ctaHref,
          defaultSiteContent.pricing.plans[index]?.ctaHref ?? "/contact",
        ),
      })),
    },
    cta: {
      ...content.cta,
      linkHref: safeHref(
        content.cta.linkHref,
        defaultSiteContent.cta.linkHref,
      ),
    },
  };
}

export function normalizeSiteContent(rows: unknown): SiteContent {
  const content = { ...defaultSiteContent };

  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (!isRecord(row) || !isSiteContentKey(row.key)) continue;
      if (row.published === false) continue;

      content[row.key] = mergeKnownValue(
        defaultSiteContent[row.key],
        row.content,
      ) as never;
    }
  }

  return normalizeSiteLinks(content);
}

function firstValue(row: UnknownRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined) return row[key];
  }
  return undefined;
}

function requiredString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized || undefined;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function isProductKind(value: unknown): value is ProductKind {
  return (
    typeof value === "string" && productKinds.some((kind) => kind === value)
  );
}

function isProductStatus(value: unknown): value is ProductStatus {
  return (
    typeof value === "string" &&
    productStatuses.some((status) => status === value)
  );
}

function isProductCategory(value: unknown): value is ProductCategory {
  return (
    typeof value === "string" &&
    categories.slice(1).some((category) => category === value)
  );
}

function productTheme(value: unknown): ProductTheme {
  return value === "dark" || value === "warm" ? value : "light";
}

function finiteNumber(value: unknown, fallback = 0): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function projectStory(value: unknown, fallback: ProjectStory): ProjectStory {
  return mergeKnownValue(fallback, value) as ProjectStory;
}

export function normalizeProductRow(
  value: unknown,
  fallbackOrder = 0,
): PublicProduct | undefined {
  if (!isRecord(value)) return undefined;

  const id = requiredString(value.id);
  const slug = requiredString(value.slug)?.toLocaleLowerCase();
  const name = requiredString(value.name);
  const tagline = requiredString(value.tagline);
  const description = requiredString(value.description);
  const kind = value.kind;
  const category = value.category;

  if (
    !id ||
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !name ||
    !tagline ||
    !description ||
    !isProductKind(kind) ||
    !isProductCategory(category)
  ) {
    return undefined;
  }

  const price = Math.max(0, finiteNumber(value.price));
  const rawMetrics = Array.isArray(value.metrics) ? value.metrics : [];
  const metrics = rawMetrics.flatMap((metric) => {
    if (!isRecord(metric)) return [];
    const label = requiredString(metric.label);
    const metricValue = requiredString(metric.value);
    return label && metricValue ? [{ label, value: metricValue }] : [];
  });
  const status = isProductStatus(value.status)
    ? value.status
    : kind === "project"
      ? "case-study"
      : "available";
  const sortOrder = Math.trunc(
    finiteNumber(firstValue(value, "sort_order", "sortOrder"), fallbackOrder),
  );
  const accent = optionalString(value.accent);
  const defaultDetails = defaultProjectStories[slug];
  const fallbackStory = defaultDetails ?? fallbackProjectStory;

  return {
    id,
    slug,
    name,
    tagline,
    description,
    kind,
    category,
    price,
    priceLabel:
      optionalString(firstValue(value, "price_label", "priceLabel")) ??
      (kind === "project" ? "Case study" : `€${price}`),
    featured: value.featured === true,
    badge: optionalString(value.badge),
    theme: productTheme(value.theme),
    accent: accent && /^#[\da-f]{6}$/i.test(accent) ? accent : "#7568F8",
    metrics,
    stack: stringArray(value.stack),
    pages: stringArray(value.pages),
    features: stringArray(value.features),
    updatedAt:
      optionalString(firstValue(value, "updated_at", "updatedAt")) ??
      "2026-01-01",
    status,
    sortOrder,
    coverImageUrl: safeImageUrl(
      firstValue(value, "cover_image_url", "coverImageUrl"),
    ),
    client:
      optionalString(value.client) ??
      (kind === "project"
        ? defaultDetails?.client ?? "Product team"
        : undefined),
    duration:
      optionalString(value.duration) ??
      (kind === "project"
        ? defaultDetails?.duration ?? "Built in focused sprints"
        : undefined),
    engagement:
      optionalString(value.engagement) ??
      (kind === "project"
        ? defaultDetails?.engagement ?? "Strategy, design & engineering"
        : undefined),
    story:
      kind === "project" ? projectStory(value.story, fallbackStory) : undefined,
    seoTitle: optionalString(
      firstValue(value, "seo_title", "seoTitle"),
    ),
    seoDescription: optionalString(
      firstValue(value, "seo_description", "seoDescription"),
    ),
    publishedAt: optionalString(
      firstValue(value, "published_at", "publishedAt"),
    ),
  };
}

export function normalizeProducts(rows: unknown): PublicProduct[] | undefined {
  if (!Array.isArray(rows)) return undefined;

  const normalized = rows.flatMap((row, index) => {
    const product = normalizeProductRow(row, index);
    return product ? [product] : [];
  });

  if (rows.length > 0 && normalized.length === 0) return undefined;

  return normalized.sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function isPortfolioProject(
  product: PublicProduct,
): product is PortfolioProject {
  return (
    product.kind === "project" &&
    Boolean(
      product.client &&
        product.duration &&
        product.engagement &&
        product.story,
    )
  );
}
