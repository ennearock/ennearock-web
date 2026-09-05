import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";

const baseUrl = "https://ennearock.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: "2026-08-30", changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/templates", lastModified: "2026-08-30", changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/products", lastModified: "2026-08-30", changeFrequency: "weekly", priority: 0.85 },
    { url: baseUrl + "/projects", lastModified: "2026-08-30", changeFrequency: "monthly", priority: 0.8 },
    { url: baseUrl + "/contact", lastModified: "2026-08-30", changeFrequency: "yearly", priority: 0.7 },
    { url: baseUrl + "/privacy", lastModified: "2026-08-30", changeFrequency: "yearly", priority: 0.2 },
    { url: baseUrl + "/terms", lastModified: "2026-08-30", changeFrequency: "yearly", priority: 0.2 },
  ];

  const catalogPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: baseUrl + (product.kind === "project" ? "/projects/" : "/templates/") + product.slug,
    lastModified: product.updatedAt,
    changeFrequency: "monthly",
    priority: product.featured ? 0.8 : 0.7,
  }));

  return [...publicPages, ...catalogPages];
}
