"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import "./index.scss";
import { ProductTabsNav } from "@/components/molecules/ProductTabsNav";
import { ProductReviewsTab } from "@/components/organisms/ProductReviewsTab";
import { WriteReviewModal } from "@/components/organisms/WriteReviewModal";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useReviewSubmit } from "@/hooks/useReviewSubmit";
import { useToast } from "@/hooks/useToast";

type TabKey = "tc-details" | "tc-reviews" | "tc-faqs";

interface ProductTabsSectionProps {
  productId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialReviews: any;
  detailsNode: React.ReactNode;
  faqsNode: React.ReactNode;
}

const DEFAULT_ACTIVE_TAB: TabKey = "tc-reviews";

export const ProductTabsSection: React.FC<ProductTabsSectionProps> = ({
  productId,
  initialReviews,
  detailsNode,
  faqsNode,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>(DEFAULT_ACTIVE_TAB);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState<boolean>(false);

  const panelRefs = useRef<Map<TabKey, HTMLElement>>(new Map());
  const { showToast } = useToast();

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
  } = useProductReviews(productId, initialReviews);

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
    productId,
    onSuccess: handleReviewSubmitSuccess,
  });

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
    if (!isWriteReviewModalOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsWriteReviewModalOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isWriteReviewModalOpen]);

  const handleOpenReviewModal = useCallback(() => {
    if (isSubmittingReview) return;
    clearReviewStatusMessage();
    setIsWriteReviewModalOpen(true);
  }, [clearReviewStatusMessage, isSubmittingReview]);

  const handleCloseReviewModal = useCallback(() => {
    if (isSubmittingReview) return;
    setIsWriteReviewModalOpen(false);
  }, [isSubmittingReview]);

  const handleTabSelect = (tab: TabKey) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      const target = panelRefs.current.get(tab);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const detailsPanelClassName = useMemo(
    () =>
      `products-tabs__content${activeTab === "tc-details" ? " products-tabs__content--active" : ""}`,
    [activeTab],
  );

  const faqsPanelClassName = useMemo(
    () =>
      `products-tabs__content${activeTab === "tc-faqs" ? " products-tabs__content--active" : ""}`,
    [activeTab],
  );

  return (
    <section className="products-tabs">
      <ProductTabsNav activeTab={activeTab} onTabSelect={handleTabSelect} />

      <section
        id="tc-details"
        ref={(el) => {
          if (el) panelRefs.current.set("tc-details", el);
        }}
        data-tab-content="tc-details"
        role="tabpanel"
        aria-labelledby="tab-tc-details"
        aria-hidden={activeTab !== "tc-details"}
        className={detailsPanelClassName}
      >
        <div>{detailsNode}</div>
      </section>

      <ProductReviewsTab
        panelRef={(el: HTMLElement | null) => {
          if (el) panelRefs.current.set("tc-reviews", el);
        }}
        reviews={reviews}
        reviewCount={reviewCount}
        isActive={activeTab === "tc-reviews"}
        isLoading={isLoadingReviews}
        isLoadingMore={isLoadingMoreReviews}
        isRetrying={isRetryingReviews}
        hasMore={hasMore}
        selectedRating={selectedRating}
        selectedSort={selectedSort}
        onRatingChange={setFilter}
        onSortChange={setSort}
        onLoadMore={loadMore}
        onRetry={reloadReviews}
        error={reviewError}
        errorKind={reviewErrorKind}
        onWriteReview={handleOpenReviewModal}
      />

      <section
        id="tc-faqs"
        ref={(el) => {
          if (el) panelRefs.current.set("tc-faqs", el);
        }}
        data-tab-content="tc-faqs"
        role="tabpanel"
        aria-labelledby="tab-tc-faqs"
        aria-hidden={activeTab !== "tc-faqs"}
        className={faqsPanelClassName}
      >
        {faqsNode}
      </section>

      <WriteReviewModal
        key={isWriteReviewModalOpen ? "write-review-open" : "write-review-closed"}
        isOpen={isWriteReviewModalOpen}
        isSubmitting={isSubmittingReview}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
      />

      <div aria-live="polite" className="sr-only">
        {reviewStatusMessage}
      </div>
    </section>
  );
};
