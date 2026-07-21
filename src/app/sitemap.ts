import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/seo";
import { getServerProductsForSitemap } from "@/api/server/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const products = await getServerProductsForSitemap();

    const productRoutes = products.map((product) => ({
      url: new URL(`/product/${product.id}`, siteUrl).toString(),
      // Since API might not return updatedAt, we omit lastModified to avoid faking it.
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("[Sitemap] Failed to fetch products for sitemap:", error);
    // Return at least static routes if products fail
    return staticRoutes;
  }
}
