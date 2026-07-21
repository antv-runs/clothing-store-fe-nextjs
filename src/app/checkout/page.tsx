import type { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

const WEB_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clothing-store.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Checkout – Clothing Store",
    description: "Complete your purchase securely and quickly.",
    openGraph: {
      title: "Checkout",
      description: "Complete your purchase securely and quickly.",
      images: "/assets/og-checkout.png",
    },
    alternates: {
      canonical: `${WEB_SITE_URL}/checkout`,
    },
  };
}

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
