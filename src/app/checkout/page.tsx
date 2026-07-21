import type { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";
import { WEB_SITE_URL } from "@/const";

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
