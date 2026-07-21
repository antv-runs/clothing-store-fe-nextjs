import Link from "next/link";
import type { Metadata } from "next";

const WEB_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clothing-store.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Page Not Found – Clothing Store",
    description: "The requested page does not exist.",
    openGraph: {
      title: "Page Not Found",
      description: "The requested page does not exist.",
      images: "/assets/og-404.png",
    },
    alternates: {
      canonical: `${WEB_SITE_URL}/404`,
    },
  };
}

import { MainLayout } from "@/components/templates/MainLayout";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { ROUTES } from "@/routes/paths";
import "./not-found.scss";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container u-mt-25">
        <section className="not-found-page" aria-label="Page not found">
          <div className="not-found-page__content">
            <Heading as="h1" className="not-found-page__code" aria-label="404">
              <span className="not-found-page__digit">4</span>
              <span className="not-found-page__zero-wrap">
                <span className="not-found-page__zero">0</span>
                <span
                  className="not-found-page__sparkle not-found-page__sparkle--left"
                  aria-hidden="true"
                >
                  <Icon
                    svgName="icn_glitter"
                    height="100%"
                    width="100%"
                    color="#000"
                  />
                </span>
                <span
                  className="not-found-page__sparkle not-found-page__sparkle--right"
                  aria-hidden="true"
                >
                  <Icon
                    svgName="icn_glitter"
                    height="100%"
                    width="100%"
                    color="#000"
                  />
                </span>
              </span>
              <span className="not-found-page__digit">4</span>
            </Heading>

            <p className="not-found-page__message">Page not found</p>

            <Link
              className="button button--primary not-found-page__action"
              href={ROUTES.HOME}
            >
              Go back to Home
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
