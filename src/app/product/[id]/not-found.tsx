import { MainLayout } from "@/components/templates/MainLayout";
import { ProductNotFound } from "@/components/organisms/ProductNotFound";

export default function ProductNotFoundPage() {
  return (
    <MainLayout>
      <ProductNotFound message="This product does not exist or has been removed." />
    </MainLayout>
  );
}
