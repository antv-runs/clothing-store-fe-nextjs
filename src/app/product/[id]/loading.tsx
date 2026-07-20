import { MainLayout } from "@/components/templates/MainLayout";
import { ProductDetailSkeleton } from "@/components/organisms/ProductDetailSkeleton";

export default function ProductDetailLoading() {
  return (
    <MainLayout>
      <ProductDetailSkeleton />
    </MainLayout>
  );
}
