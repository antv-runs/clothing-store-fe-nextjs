import Link from "next/link";
import { Text } from "@/components/atoms/Text";
import { ROUTES } from "@/routes/paths";
import "./index.scss";

type ProductNotFoundProps = {
  message?: string;
};

export const ProductNotFound = ({
  message = "Product not found.",
}: ProductNotFoundProps) => {
  return (
    <div className="container u-mt-25">
      <section
        className="product-overview product-not-found"
        aria-label="Product overview"
      >
        <Text as="p" className="product-overview__description">
          {message}
        </Text>

        <Link
          className="button button--primary product-not-found__action"
          href={ROUTES.HOME}
        >
          Back to Home
        </Link>
      </section>
    </div>
  );
};
