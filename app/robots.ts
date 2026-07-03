import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tedori.app/sitemap.xml",
    host: "https://tedori.app",
  };
}
