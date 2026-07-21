import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerProductById, getServerRelatedProducts, getServerProductReviews } from "@/api/server/product";
import { MainLayout } from "@/components/templates/MainLayout";
import { ProductDetailView } from "./ProductDetailView";

import { getSiteUrl } from "@/utils/seo";

const WEB_SITE_URL = getSiteUrl().toString().replace(/\/$/, "");

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
      type: "website",
      url: `/product/${product.id}`,
      title: product.name,
      description: product.description || `Buy ${product.name} at Clothing Store.`,
      images: [
        {
          url: product.thumbnail || "",
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} at Clothing Store.`,
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

  const productUrl = `${WEB_SITE_URL}/product/${product.id}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.thumbnail].filter(Boolean),
    description: product.description || `Buy ${product.name} at Clothing Store.`,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.pricing?.current || 0,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: WEB_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailView
        product={product}
        relatedProducts={relatedProducts}
        initialReviews={initialReviews}
      />
    </MainLayout>
  );
}
