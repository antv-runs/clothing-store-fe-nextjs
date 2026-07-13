import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import "./index.scss";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/paths";

type ProductNotFoundProps = {
  message?: string;
};

export const ProductNotFound = ({
  message = "Product not found.",
}: ProductNotFoundProps) => {
  const router = useRouter();

  const handleBackHome = () => {
    router.push(ROUTES.HOME);
  };

  return (
    <div className="container u-mt-25">
      <section
        className="product-overview product-not-found"
        aria-label="Product overview"
      >
        <Text as="p" className="product-overview__description">
          {message}
        </Text>

        <Button
          variant="primary"
          className="product-not-found__action"
          onClick={handleBackHome}
        >
          Back to Home
        </Button>
      </section>
    </div>
  );
};
