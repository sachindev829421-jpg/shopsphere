import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shopsphere.in";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/account", "/account/*", "/api/*", "/checkout"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
