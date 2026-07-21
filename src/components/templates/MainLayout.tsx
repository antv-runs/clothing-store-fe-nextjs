/**
 * Main application layout
 * Wraps all pages with shared header and footer
 */


import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

import { OfflineBanner } from "@/components/organisms/OfflineBanner";
import { ScrollToTop } from "@/components/atoms/ScrollToTop";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop />
      <OfflineBanner />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};
