import "server-only";

import { cache } from "react";
import {
  defaultPublishedProducts,
  defaultSiteContent,
} from "./defaults";
import {
  isPortfolioProject,
  normalizeProducts,
  normalizeSiteContent,
} from "./normalize";
import type {
  PortfolioProject,
  PublicProduct,
  SiteContent,
} from "./types";

export const SITE_CONTENT_CACHE_TAG = "site-content";
export const PRODUCTS_CACHE_TAG = "published-products";

const PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;
const PUBLIC_PRODUCT_COLUMNS = [
  "id",
  "slug",
  "name",
  "tagline",
  "description",
  "kind",
  "category",
  "price",
  "price_label",
  "featured",
  "badge",
  "theme",
  "accent",
  "metrics",
  "stack",
  "pages",
  "features",
  "status",
  "created_at",
  "updated_at",
  "published_at",
  "sort_order",
  "cover_image_url",
  "client",
  "duration",
  "engagement",
  "story",
  "seo_title",
  "seo_description",
].join(",");

type PublicRowsResult =
  | { status: "available"; rows: unknown[] }
  | { status: "fallback" }
  | { status: "unavailable" };

function publicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return url && key ? { url, key } : undefined;
}

async function fetchPublicRows(
  resource: string,
  cacheTag: string,
): Promise<PublicRowsResult> {
  const config = publicSupabaseConfig();
  if (!config) return { status: "fallback" };

  try {
    const response = await fetch(`${config.url}/rest/v1/${resource}`, {
      headers: {
        Accept: "application/json",
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      next: {
        revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
        tags: [cacheTag],
      },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[content] Supabase ${resource.split("?")[0]} returned ${response.status}; using local defaults.`,
        );
      }
      return {
        status: response.status === 404 ? "fallback" : "unavailable",
      };
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? { status: "available", rows: data }
      : { status: "unavailable" };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[content] Supabase read failed; using local defaults.", error);
    }
    return { status: "unavailable" };
  }
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const rows = await fetchPublicRows(
    "site_content?select=key,content,published,updated_at&published=eq.true",
    SITE_CONTENT_CACHE_TAG,
  );

  return rows.status === "available"
    ? normalizeSiteContent(rows.rows)
    : defaultSiteContent;
});

export const getPublishedProducts = cache(
  async (): Promise<PublicProduct[]> => {
    const rows = await fetchPublicRows(
      `products?select=${PUBLIC_PRODUCT_COLUMNS}&published_at=not.is.null`,
      PRODUCTS_CACHE_TAG,
    );
    if (rows.status !== "available") return defaultPublishedProducts;

    return normalizeProducts(rows.rows) ?? [];
  },
);

export const getPublishedProjects = cache(
  async (): Promise<PortfolioProject[]> => {
    const products = await getPublishedProducts();
    return products.filter(isPortfolioProject);
  },
);

export const getPublishedProductBySlug = cache(
  async (slug: string): Promise<PublicProduct | undefined> => {
    const normalizedSlug = slug.trim().toLocaleLowerCase();
    const products = await getPublishedProducts();

    return products.find(
      (product) => product.slug.toLocaleLowerCase() === normalizedSlug,
    );
  },
);

export const getPublishedProjectBySlug = cache(
  async (slug: string): Promise<PortfolioProject | undefined> => {
    const product = await getPublishedProductBySlug(slug);
    return product && isPortfolioProject(product) ? product : undefined;
  },
);
