"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/templates/MainLayout";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { ROUTES } from "@/routes/paths";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ProductError]", error);
  }, [error]);

  return (
    <MainLayout>
      <div className="container u-mt-25">
        <section
          className="not-found-page"
          aria-label="Product error"
          style={{ textAlign: "center", padding: "80px 0" }}
        >
          <div className="not-found-page__content">
            <Heading as="h1" style={{ marginBottom: "16px" }}>
              Unable to load product
            </Heading>

            <Text
              as="p"
              style={{ marginBottom: "32px", color: "rgba(0,0,0,0.6)" }}
            >
              Something went wrong while loading this product. Please try again.
            </Text>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                type="button"
                variant="primary"
                onClick={reset}
              >
                Try Again
              </Button>

              <Link
                className="button button--light"
                href={ROUTES.HOME}
              >
                Go to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
