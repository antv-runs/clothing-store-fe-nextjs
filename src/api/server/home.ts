import { buildQueryString, unwrapPaginatedResponse } from "@/utils/apiHelpers";
import { mapApiProductsToProducts } from "@/utils/productMapper";
import { mapApiReviewsToReviews } from "@/utils/reviewMapper";
import type { PaginatedApiResponse } from "@/types/pagination";
import type { ApiProduct } from "@/types/api/product";
import type { ApiReview } from "@/types/api/review";

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.vanannek.blog";

async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    // Revalidate data every 1 hour (3600 seconds)
    next: { revalidate: 3600 },
    ...options,
  });
  
  if (!res.ok) {
    throw new Error(`Server fetch failed: ${res.statusText}`);
  }
  return res.json();
}

export async function getHomeNewArrivals() {
  const queryStr = buildQueryString({ page: 1, per_page: 4 }).toString();
  const res = await serverFetch<PaginatedApiResponse<ApiProduct>>(`/api/products?${queryStr}`);
  const { data: apiProducts } = unwrapPaginatedResponse(res, "Failed to fetch new arrivals");
  return mapApiProductsToProducts(apiProducts);
}

export async function getHomeTopSelling() {
  const queryStr = buildQueryString({ page: 2, per_page: 4 }).toString();
  const res = await serverFetch<PaginatedApiResponse<ApiProduct>>(`/api/products?${queryStr}`);
  const { data: apiProducts } = unwrapPaginatedResponse(res, "Failed to fetch top selling");
  return mapApiProductsToProducts(apiProducts);
}

export async function getHomeReviews() {
  // from useHomeData: productId = 180, page = 1, perPage = 10, sort = "latest"
  const queryStr = buildQueryString({ page: 1, per_page: 10, sort: "latest" }).toString();
  const res = await serverFetch<PaginatedApiResponse<ApiReview>>(`/api/products/180/reviews?${queryStr}`);
  const { data: apiReviews } = unwrapPaginatedResponse(res, "Failed to fetch reviews");
  return mapApiReviewsToReviews(apiReviews, "180");
}
