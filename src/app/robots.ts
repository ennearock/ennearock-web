import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/dashboard", "/login", "/signup"],
    },
    sitemap: "https://ennearock.com/sitemap.xml",
    host: "https://ennearock.com",
  };
}
