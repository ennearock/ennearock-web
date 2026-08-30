import type { NextRequest } from "next/server";

import {
  categories,
  filterProducts,
  productKinds,
  productStatuses,
  type ProductCategory,
  type ProductKind,
  type ProductStatus,
} from "@/data/catalog";

const responseHeaders = {
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
};

function isProductKind(value: string): value is ProductKind {
  return productKinds.some((kind) => kind === value);
}

function isProductStatus(value: string): value is ProductStatus {
  return productStatuses.some((status) => status === value);
}

function findCategory(value: string): ProductCategory | "All" | undefined {
  return categories.find(
    (category) => category.toLocaleLowerCase() === value.toLocaleLowerCase(),
  );
}

function badRequest(message: string) {
  return Response.json(
    { error: { code: "INVALID_QUERY", message } },
    { status: 400 },
  );
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() || undefined;
  const rawCategory = searchParams.get("category")?.trim();
  const rawKind = searchParams.get("kind")?.trim().toLocaleLowerCase();
  const rawStatus = searchParams.get("status")?.trim().toLocaleLowerCase();
  const rawFeatured = searchParams.get("featured")?.trim().toLocaleLowerCase();

  if (query && query.length > 120) {
    return badRequest("The q parameter must be 120 characters or fewer.");
  }

  const category = rawCategory ? findCategory(rawCategory) : undefined;
  if (rawCategory && !category) {
    return badRequest(
      `Unknown category. Try one of: ${categories.slice(1).join(", ")}.`,
    );
  }

  if (rawKind && !isProductKind(rawKind)) {
    return badRequest(`kind must be one of: ${productKinds.join(", ")}.`);
  }

  if (rawStatus && !isProductStatus(rawStatus)) {
    return badRequest(`status must be one of: ${productStatuses.join(", ")}.`);
  }

  if (rawFeatured && rawFeatured !== "true" && rawFeatured !== "false") {
    return badRequest("featured must be either true or false.");
  }

  const kind = rawKind && isProductKind(rawKind) ? rawKind : undefined;
  const status =
    rawStatus && isProductStatus(rawStatus) ? rawStatus : undefined;
  const featured =
    rawFeatured === undefined ? undefined : rawFeatured === "true";
  const matches = filterProducts({
    query,
    category,
    kind,
    featured,
    status,
  });

  return Response.json(
    {
      data: matches,
      meta: {
        total: matches.length,
        filters: {
          query: query ?? null,
          category: category ?? null,
          kind: kind ?? null,
          featured: featured ?? null,
          status: status ?? null,
        },
      },
    },
    { headers: responseHeaders },
  );
}
