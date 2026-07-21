import { Breadcrumb } from "@/components/organisms/Breadcrumb";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { ProductInfo } from "@/components/organisms/ProductInfo";
import { ProductPurchaseController } from "@/components/organisms/ProductPurchaseController";
import { ProductTabsSection } from "@/components/organisms/ProductTabsSection";
import { RelatedProductsSection } from "@/components/organisms/RelatedProductsSection";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";
import type { Product } from "@/types/product";
import "./index.scss";

export function ProductDetailView({ 
  product, 
  relatedProducts,
  initialReviews,
}: { 
  product: Product; 
  relatedProducts: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialReviews: any;
}) {
  return (
      <div className="container u-mt-25 product-detail-page">
        {/* Product Overview Section */}
        <section className="product-overview">
          <Breadcrumb
            items={product.breadcrumb || ["Home", "Shop", product.name]}
            className="u-mb-40"
          />

          <div className="product-overview__details">
            <ErrorBoundary
              resetKeys={[product.id, product.images, product.thumbnail]}
              fallback={
                <div
                  className="product-gallery product-gallery--fallback"
                  aria-label="Product gallery unavailable"
                >
                  <div className="product-gallery__thumbnails product-gallery__thumbnails--empty" />
                  <div className="product-gallery__main">
                    <div className="product-gallery__main-wrapper">
                      <output
                        className="product-detail-page__local-fallback"
                        style={{ display: "flex" }}
                      >
                        Product gallery is temporarily unavailable.
                      </output>
                    </div>
                  </div>
                </div>
              }
            >
              <ProductGallery
                key={product.id}
                images={product.images || []}
                productName={product.name}
                thumbnail={product.thumbnail}
              />
            </ErrorBoundary>

            <div className="product-info">
              <ProductInfo product={product} />
              
              <ProductPurchaseController product={product} />
            </div>
          </div>
        </section>

        <ErrorBoundary
          resetKeys={[product.id]}
          fallback={
            <output
              className="product-detail-page__tabs-fallback"
              style={{ display: "block" }}
            >
              Product details and reviews are temporarily unavailable.
            </output>
          }
        >
          <ProductTabsSection
            productId={String(product.id)}
            initialReviews={initialReviews}
            detailsNode={product.details}
            faqsNode={
              <ul className="faqs">
                {product.faqs?.length ? (
                  product.faqs.map((faq, index) => (
                    <li key={`${faq.question}-${index}`}>
                      <strong>{faq.question}</strong>
                      <p>{faq.answer}</p>
                    </li>
                  ))
                ) : (
                  <li>No FAQs available.</li>
                )}
              </ul>
            }
          />
        </ErrorBoundary>

        <RelatedProductsSection
          products={relatedProducts}
          isLoading={false}
          error={null}
          errorKind={null}
          isRetrying={false}
          title="You Might Also Like"
        />
      </div>
  );
}
