import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerProductById, getServerRelatedProducts } from "@/api/server/product";
import { ProductDetailClient } from "./ProductDetailClient";

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
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, relatedProducts] = await Promise.all([
    getServerProductById(id).catch(() => null),
    getServerRelatedProducts().catch(() => []),
  ]);

  if (!product) {
    notFound(); // Triggers Next.js 404 page
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
