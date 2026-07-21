"use client";

import React, { useState, useEffect } from "react";
import { ProductVariants } from "@/components/organisms/ProductVariants";
import { ProductActions } from "@/components/molecules/ProductActions";
import { useCartRows } from "@/hooks/useCartRows";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/types/product";

const DEFAULT_QUANTITY = 1;

const normalizeQuantity = (value: number | string): number => {
  const parsed = Number(value);
  return Math.max(
    DEFAULT_QUANTITY,
    Number.isFinite(parsed) ? parsed : DEFAULT_QUANTITY,
  );
};

interface ProductPurchaseControllerProps {
  product: Pick<Product, "id" | "variants">;
}

export const ProductPurchaseController: React.FC<ProductPurchaseControllerProps> = ({
  product,
}) => {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const { addItem } = useCartRows();
  const { showToast } = useToast();

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

  const getSafeSelectedColorId = () => {
    if (selectedColorId) return selectedColorId;
    return product?.variants?.colors?.[0]?.id ?? null;
  };

  const getSafeSelectedSizeId = () => {
    if (selectedSizeId) return selectedSizeId;
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
    if (isAddingToCart) return;

    if (!product?.id) {
      showToast({ message: "Unable to add item to cart", variant: "error" });
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

      showToast({ message: "Item added to cart", variant: "success" });
    } catch {
      showToast({ message: "Unable to add item to cart", variant: "error" });
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 300);
    }
  };

  return (
    <>
      <ProductVariants
        key={product.id}
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
    </>
  );
};
