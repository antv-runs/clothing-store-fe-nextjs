import { buildQueryString, unwrapApiResponse, unwrapPaginatedResponse } from "@/utils/apiHelpers";
import { mapApiProductToProduct, mapApiProductsToProducts } from "@/utils/productMapper";
import { mapApiReviewsToReviews } from "@/utils/reviewMapper";
import type { PaginatedApiResponse, ApiResponse } from "@/types/pagination";
import type { ApiProduct } from "@/types/api/product";
import type { ApiReview } from "@/types/api/review";

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.vanannek.blog";

/**
 * Low-level fetch wrapper for Server Components.
 *
 * Error strategy:
 * - HTTP 404 → returns `null` so callers can decide (notFound() or empty UI).
 * - HTTP 4xx/5xx, network errors, timeouts → throws so Next.js error.tsx catches.
 */
async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    ...options,
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Server fetch failed (${res.status}): ${res.statusText}`);
  }
  return res.json();
}

export async function getServerProductById(id: string) {
  if (!id) return null;
  const res = await serverFetch<ApiResponse<ApiProduct>>(`/api/products/${encodeURIComponent(id)}`);
  if (!res) return null;
  const apiProduct = unwrapApiResponse(res, "Failed to fetch product");
  return mapApiProductToProduct(apiProduct);
}

export async function getServerRelatedProducts() {
  const queryStr = buildQueryString({ page: 1, per_page: 8 }).toString();
  const res = await serverFetch<PaginatedApiResponse<ApiProduct>>(`/api/products?${queryStr}`);
  if (!res) return [];
  const { data: apiProducts } = unwrapPaginatedResponse(res, "Failed to fetch related products");
  return mapApiProductsToProducts(apiProducts);
}

export async function getServerProductReviews(id: string) {
  if (!id) return null;
  const queryStr = buildQueryString({ page: 1, per_page: 6, sort: "latest" }).toString();
  const res = await serverFetch<PaginatedApiResponse<ApiReview>>(`/api/products/${encodeURIComponent(id)}/reviews?${queryStr}`);
  if (!res) return null;
  const { data: apiReviews, meta } = unwrapPaginatedResponse(res, "Failed to fetch reviews");
  return {
    reviews: mapApiReviewsToReviews(apiReviews, id),
    total: meta.total,
    lastPage: meta.last_page,
  };
}

export async function getServerProductsForSitemap() {
  let allProducts: ReturnType<typeof mapApiProductToProduct>[] = [];
  let currentPage = 1;
  let lastPage = 1;

  do {
    const queryStr = buildQueryString({ page: currentPage, per_page: 50 }).toString();
    const res = await serverFetch<PaginatedApiResponse<ApiProduct>>(`/api/products?${queryStr}`);
    if (!res) break;

    const { data: apiProducts, meta } = unwrapPaginatedResponse(res, "Failed to fetch products for sitemap");
    const products = mapApiProductsToProducts(apiProducts);
    allProducts = [...allProducts, ...products];

    lastPage = meta.last_page;
    currentPage++;
  } while (currentPage <= lastPage);

  return allProducts;
}
