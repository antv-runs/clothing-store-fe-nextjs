import React from "react";
import "./index.scss";
import { ProductCardList } from "@/components/organisms/ProductCardList";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";
import { Heading } from "@/components/atoms/Heading";
import { ListStateWrapper } from "@/components/molecules/ListStateWrapper";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { ListErrorKind } from "@/types/listState";
import type { Product } from "@/types/product";

interface RelatedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  errorKind?: ListErrorKind | null;
  isRetrying: boolean;
  onRetry?: () => void;
  title?: string;
}

/**
 * RelatedProductsSection - Product recommendations carousel section.
 *
 * Handles:
 * - Section wrapper and heading
 * - ProductCardList with navigation enabled
 */
export const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  products,
  isLoading,
  error,
  errorKind,
  isRetrying,
  onRetry,
  title = "You Might Also Like",
}) => {
  return (
    <section className="other-products u-mb-85">
      <Heading as="h2" className="other-products__title">
        {title}
      </Heading>

      <ErrorBoundary
        resetKeys={[products, isLoading]}
        fallback={
          <output className="other-products__fallback" style={{ display: "block" }}>
            This product list is temporarily unavailable.
          </output>
        }
      >
        <ListStateWrapper
          isLoading={isLoading}
          isRetrying={isRetrying}
          isEmpty={!isLoading && !error && products.length === 0}
          error={error}
          errorKind={errorKind || null}
          onRetry={onRetry}
          loadingContent={
            <ProductCardList
              products={products}
              showNavigation={true}
              loading={true}
              skeletonCount={8}
              linkMode="overlay"
            />
          }
          emptyContent={<EmptyState message="No related products available." />}
        >
          <ProductCardList
            products={products}
            showNavigation={true}
            loading={false}
            skeletonCount={8}
            linkMode="overlay"
          />
        </ListStateWrapper>
      </ErrorBoundary>
    </section>
  );
};
