import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/index.scss";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { getSiteUrl } from "@/utils/seo";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

const integralCF = localFont({
  src: [
    {
      path: "../../public/fonts/Fontspring-DEMO-integralcf-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-integral-cf",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Clothing Store",
    template: "%s | Clothing Store",
  },
  description: "Discover the latest trends in fashion at Clothing Store.",
  twitter: {
    card: "summary_large_image",
    title: "Clothing Store",
    description: "Discover the latest trends in fashion at Clothing Store.",
    images: ["/assets/og-home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${integralCF.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
