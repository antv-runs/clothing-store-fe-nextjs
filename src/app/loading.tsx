import { MainLayout } from "@/components/templates/MainLayout";
import { Spinner } from "@/components/atoms/Spinner";

export default function GlobalLoading() {
  return (
    <MainLayout>
      <div 
        className="container" 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh" 
        }}
        aria-label="Loading..."
      >
        <Spinner />
      </div>
    </MainLayout>
  );
}
