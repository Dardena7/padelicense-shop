import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/*/admin/", "/*/account/"],
  },
  sitemap: `${BASE_URL}/sitemap.xml`,
});

export default robots;
