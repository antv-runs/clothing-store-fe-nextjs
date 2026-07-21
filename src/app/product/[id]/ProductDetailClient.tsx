"use client";

import { useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "@/components/organisms/Breadcrumb";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { ProductInfo } from "@/components/organisms/ProductInfo";
import { ProductVariants } from "@/components/organisms/ProductVariants";
import { ProductActions } from "@/components/molecules/ProductActions";
import { ProductTabsSection } from "@/components/organisms/ProductTabsSection";
import { RelatedProductsSection } from "@/components/organisms/RelatedProductsSection";
import { WriteReviewModal } from "@/components/organisms/WriteReviewModal";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";

import { formatPrice } from "@/utils/formatters";

import { useCartRows } from "@/hooks/useCartRows";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useReviewSubmit } from "@/hooks/useReviewSubmit";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import type { Product } from "@/types/product";
import "./index.scss";

const DEFAULT_QUANTITY = 1;
const NETWORK_ERROR_MESSAGE =
  "Failed to load product. Please check your connection and try again.";
const SYSTEM_ERROR_MESSAGE = "Something went wrong while loading this product.";

const normalizeQuantity = (value: number | string): number => {
  const parsed = Number(value);
  return Math.max(
    DEFAULT_QUANTITY,
    Number.isFinite(parsed) ? parsed : DEFAULT_QUANTITY,
  );
};

export function ProductDetailClient({ 
  product, 
  relatedProducts,
  initialReviews,
}: { 
  product: Product; 
  relatedProducts: Product[];
  initialReviews: any;
}) {

  // Track selected color and size for add-to-cart functionality
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] =
    useState<boolean>(false);

  const {
    reviews,
    reviewCount,
    selectedRating,
    selectedSort,
    hasMore,
    isLoading: isLoadingReviews,
    isLoadingMore: isLoadingMoreReviews,
    isRetrying: isRetryingReviews,
    error: reviewError,
    errorKind: reviewErrorKind,
    setFilter,
    setSort,
    loadMore,
    reloadReviews,
  } = useProductReviews(product?.id, initialReviews);
  const { addItem } = useCartRows();
  const { showToast } = useToast();

  const handleReviewSubmitSuccess = useCallback(async () => {
    setIsWriteReviewModalOpen(false);
    showToast({
      message: "Review submitted successfully. Thank you for your feedback!",
      variant: "success",
      duration: 5000,
    });
    await reloadReviews();
  }, [reloadReviews, showToast]);

  const {
    isSubmittingReview,
    reviewStatusMessage,
    clearReviewStatusMessage,
    handleReviewSubmit,
  } = useReviewSubmit({
    productId: product?.id,
    onSuccess: handleReviewSubmitSuccess,
  });

  useEffect(() => {
    const resetSelectionTimeout = window.setTimeout(() => {
      setSelectedColorId(null);
      setSelectedSizeId(null);
      setQuantity(DEFAULT_QUANTITY);
    }, 0);

    return () => {
      window.clearTimeout(resetSelectionTimeout);
    };
  }, [product.id]);

  useEffect(() => {
    if (isWriteReviewModalOpen) {
      document.body.classList.add("review-modal-open");
    } else {
      document.body.classList.remove("review-modal-open");
    }

    return () => {
      document.body.classList.remove("review-modal-open");
    };
  }, [isWriteReviewModalOpen]);

  useEffect(() => {
    if (!isWriteReviewModalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWriteReviewModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isWriteReviewModalOpen]);

  const handleOpenReviewModal = useCallback(() => {
    if (isSubmittingReview) {
      return;
    }

    clearReviewStatusMessage();
    setIsWriteReviewModalOpen(true);
  }, [clearReviewStatusMessage, isSubmittingReview]);

  const handleCloseReviewModal = useCallback(() => {
    if (isSubmittingReview) {
      return;
    }

    setIsWriteReviewModalOpen(false);
  }, [isSubmittingReview]);

  const getSafeSelectedColorId = () => {
    if (selectedColorId) {
      return selectedColorId;
    }

    return product?.variants?.colors?.[0]?.id ?? null;
  };

  const getSafeSelectedSizeId = () => {
    if (selectedSizeId) {
      return selectedSizeId;
    }

    return product?.variants?.sizes?.[0]?.id ?? null;
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev: number) => Math.max(DEFAULT_QUANTITY, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev: number) => prev + 1);
  };

  const handleQuantityChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "");
    setQuantity(normalizeQuantity(sanitized || DEFAULT_QUANTITY));
  };

  const handleAddToCart = () => {
    if (isAddingToCart) {
      return;
    }

    if (!product?.id) {
      showToast({
        message: "Unable to add item to cart",
        variant: "error",
      });
      return;
    }

    const safeColorId = getSafeSelectedColorId();
    const safeSizeId = getSafeSelectedSizeId();
    const safeQuantity = normalizeQuantity(quantity);

    setIsAddingToCart(true);

    try {
      addItem({
        productId: String(product.id),
        quantity: safeQuantity,
        color: safeColorId,
        size: safeSizeId,
      });

      showToast({
        message: "Item added to cart",
        variant: "success",
      });
    } catch {
      showToast({
        message: "Unable to add item to cart",
        variant: "error",
      });
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 300);
    }
  };

  // Removed isLoading and error checks since they are handled by Next.js Server Components.

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
                images={product.images || []}
                productName={product.name}
                thumbnail={product.thumbnail}
              />
            </ErrorBoundary>

            <div className="product-info">
              <ProductInfo product={product} />

              <ProductVariants
                variants={product.variants}
                onColorSelect={setSelectedColorId}
                onSizeSelect={setSelectedSizeId}
              />

              <ProductActions
                selectedColorId={getSafeSelectedColorId()}
                selectedSizeId={getSafeSelectedSizeId()}
                quantity={quantity}
                isAddingToCart={isAddingToCart}
                onDecreaseQuantity={handleDecreaseQuantity}
                onIncreaseQuantity={handleIncreaseQuantity}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
              />
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
            details={product.details}
            reviews={reviews}
            reviewCount={reviewCount}
            faqs={product.faqs || []}
            isLoadingReviews={isLoadingReviews}
            isLoadingMoreReviews={isLoadingMoreReviews}
            isRetrying={isRetryingReviews}
            hasMoreReviews={hasMore}
            selectedRating={selectedRating}
            selectedSort={selectedSort}
            onRatingChange={setFilter}
            onSortChange={setSort}
            onLoadMore={loadMore}
            onRetry={reloadReviews}
            reviewError={reviewError}
            reviewErrorKind={reviewErrorKind}
            onWriteReview={handleOpenReviewModal}
          />
        </ErrorBoundary>

        <RelatedProductsSection
          products={relatedProducts}
          isLoading={false}
          error={null}
          errorKind={null}
          isRetrying={false}
          onRetry={() => {}}
          formatPrice={formatPrice}
          title="You Might Also Like"
        />

        <ErrorBoundary
          resetKeys={[isWriteReviewModalOpen, product.id]}
          fallback={
            <output
              className="product-detail-page__modal-fallback"
              style={{ display: "block" }}
            >
              Review form is temporarily unavailable.
            </output>
          }
        >
          <WriteReviewModal
            key={
              isWriteReviewModalOpen ? "write-review-open" : "write-review-closed"
            }
            isOpen={isWriteReviewModalOpen}
            isSubmitting={isSubmittingReview}
            onClose={handleCloseReviewModal}
            onSubmit={handleReviewSubmit}
          />
        </ErrorBoundary>

        {/* Screen reader announcer */}
        <div aria-live="polite" className="sr-only">
          {reviewStatusMessage}
        </div>
      </div>
  );
}
