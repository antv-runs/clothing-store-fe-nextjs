import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerProductById, getServerRelatedProducts, getServerProductReviews } from "@/api/server/product";
import { MainLayout } from "@/components/templates/MainLayout";
import { ProductDetailClient } from "./ProductDetailClient";

const WEB_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clothing-store.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getServerProductById(id).catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Clothing Store`,
    description: product.description || `Buy ${product.name} at Clothing Store.`,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: [product.thumbnail || ""],
    },
    alternates: {
      canonical: `${WEB_SITE_URL}/product/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch product — let 500/timeout propagate to product/[id]/error.tsx
  const product = await getServerProductById(id);

  if (!product) {
    notFound(); // Triggers product/[id]/not-found.tsx
  }

  // Secondary data — failures are non-critical, don't crash the page
  const [relatedProducts, initialReviews] = await Promise.all([
    getServerRelatedProducts().catch(() => []),
    getServerProductReviews(id).catch(() => null),
  ]);

  return (
    <MainLayout>
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        initialReviews={initialReviews}
      />
    </MainLayout>
  );
}
