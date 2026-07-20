import { buildQueryString, unwrapApiResponse, unwrapPaginatedResponse } from "@/utils/apiHelpers";
import { mapApiProductToProduct, mapApiProductsToProducts } from "@/utils/productMapper";
import type { PaginatedApiResponse, ApiResponse } from "@/types/pagination";
import type { ApiProduct } from "@/types/api/product";

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.vanannek.blog";

async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    ...options,
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      return null as any; // Allow handling 404 gracefully
    }
    throw new Error(`Server fetch failed: ${res.statusText}`);
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
