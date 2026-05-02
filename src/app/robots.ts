import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: "https://sanpaolohideout.it/sitemap.xml",
    host: "https://sanpaolohideout.it",
  };
}
