import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/media`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/media/${a.slug}`,
      lastModified: new Date(a.updated),
      changeFrequency: "monthly" as const,
      priority: a.searchIntent === "Commercial" ? 0.75 : 0.85,
    })),
  ];
}
