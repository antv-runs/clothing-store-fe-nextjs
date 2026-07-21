import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

const WEB_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clothing-store.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Shopping Cart – Clothing Store",
    description: "Review items in your cart, adjust quantities, and proceed to checkout.",
    openGraph: {
      title: "Your Shopping Cart",
      description: "Review items in your cart, adjust quantities, and proceed to checkout.",
      images: "/assets/og-cart.png",
    },
    alternates: {
      canonical: `${WEB_SITE_URL}/cart`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CartPage() {
  return <CartPageClient />;
}
