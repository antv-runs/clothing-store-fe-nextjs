import { MainLayout } from "@/components/templates/MainLayout";
import { HomeHero } from "@/components/organisms/HomeHero";
import { HomeBrands } from "@/components/organisms/HomeBrands";
import { HomeProductSection } from "@/components/organisms/HomeProductSection";
import { HomeStyleGrid } from "@/components/organisms/HomeStyleGrid";
import { HomeReviews } from "@/components/organisms/HomeReviews";
import "./home.scss";

export default function HomeLoading() {
  return (
    <MainLayout>
      <div className="container">
        <section className="home-page" aria-label="Homepage Loading">
          <HomeHero />
          <HomeBrands />

          <HomeProductSection
            title="NEW ARRIVALS"
            productsList={[]}
            className="home-page__product-section home-page__product-section--new-arrivals"
            isLoading={true}
          />

          <HomeProductSection
            title="TOP SELLING"
            productsList={[]}
            className="home-page__product-section home-page__product-section--top-selling"
            withTopBorder
            isLoading={true}
          />

          <HomeStyleGrid />
          <HomeReviews
            reviews={[]}
            isLoading={true}
          />
        </section>
      </div>
    </MainLayout>
  );
}
