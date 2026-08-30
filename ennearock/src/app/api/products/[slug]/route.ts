import { getProductBySlug } from "@/data/catalog";

const responseHeaders = {
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
};

export async function GET(
  _request: Request,
  context: RouteContext<"/api/products/[slug]">,
) {
  const { slug } = await context.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return Response.json(
      {
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: `No product was found for the slug "${slug}".`,
        },
      },
      { status: 404 },
    );
  }

  return Response.json({ data: product }, { headers: responseHeaders });
}
