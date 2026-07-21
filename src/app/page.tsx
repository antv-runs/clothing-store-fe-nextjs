import type { Metadata } from "next";
import { MainLayout } from "@/components/templates/MainLayout";

import { getSiteUrl } from "@/utils/seo";

const WEB_SITE_URL = getSiteUrl().toString().replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Clothing Store – Home",
    description: "Shop the latest fashion items and discover new collections.",
    openGraph: {
      title: "Clothing Store – Home",
      description:
        "Shop the latest fashion items and discover new collections.",
      images: "/assets/og-home.png",
      url: "/",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Clothing Store – Home",
      description:
        "Shop the latest fashion items and discover new collections.",
      images: ["/assets/og-home.png"],
    },
    alternates: {
      canonical: `${WEB_SITE_URL}/`,
    },
  };
}
import { HomeHero } from "@/components/organisms/HomeHero";
import { HomeBrands } from "@/components/organisms/HomeBrands";
import { HomeProductSection } from "@/components/organisms/HomeProductSection";
import { HomeStyleGrid } from "@/components/organisms/HomeStyleGrid";
import { HomeReviews } from "@/components/organisms/HomeReviews";
import {
  getHomeNewArrivals,
  getHomeTopSelling,
  getHomeReviews,
} from "@/api/server/home";
import "./home.scss";

export default async function Home() {
  const [newArrivals, topSelling, reviews] = await Promise.all([
    getHomeNewArrivals(),
    getHomeTopSelling(),
    getHomeReviews().catch(() => []),
  ]);

  return (
    <MainLayout>
      <div className="container">
        <section className="home-page" aria-label="Homepage">
          <HomeHero />
          <HomeBrands />

          <HomeProductSection
            title="NEW ARRIVALS"
            productsList={newArrivals}
            className="home-page__product-section home-page__product-section--new-arrivals"
            isLoading={false}
            isEmpty={newArrivals.length === 0}
            emptyMessage="No new arrivals available right now."
            skeletonCount={4}
          />

          <HomeProductSection
            title="TOP SELLING"
            productsList={topSelling}
            className="home-page__product-section home-page__product-section--top-selling"
            withTopBorder
            isLoading={false}
            isEmpty={topSelling.length === 0}
            emptyMessage="No top selling products available right now."
            skeletonCount={4}
          />

          <HomeStyleGrid />
          <HomeReviews reviews={reviews} isLoading={false} />
        </section>
      </div>
    </MainLayout>
  );
}
