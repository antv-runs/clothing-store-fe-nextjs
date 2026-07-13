import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const useScrollToTop = () => {
  const pathname = usePathname();
  const previousPathRef = useRef<string>(pathname);

  useEffect(() => {
    // Only scroll if pathname actually changed (not query params or hash)
    if (previousPathRef.current !== pathname) {
      // Update the stored pathname
      previousPathRef.current = pathname;

      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [pathname]);
};
