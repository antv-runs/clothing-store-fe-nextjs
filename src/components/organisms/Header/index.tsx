"use client";

import {
  HeaderActions,
  HeaderMenuToggle,
} from "@/components/molecules/HeaderActions";
import { NavMenu } from "@/components/molecules/NavMenu";
import { SearchBox } from "@/components/molecules/SearchBox";
import { AnnouncementBar } from "@/components/organisms/AnnouncementBar";
import "./index.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/paths";
import { useCart } from "@/hooks/useCart";

export const Header: React.FC = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const router = useRouter();
  const { totalCount: totalQuantity } = useCart();

  const handleCartClick = () => router.push(ROUTES.CART);

  return (
    <>
      {isAnnouncementVisible && (
        <AnnouncementBar onClose={() => setIsAnnouncementVisible(false)} />
      )}

      <header className="site-header">
        <HeaderMenuToggle
          className="header-menu-toggle"
          ariaLabel="Open menu"
          svgName="icn_menu"
          iconWidth={19}
          iconHeight={15}
        />
        <Link href={ROUTES.HOME} className="logo">
          SHOP.CO
        </Link>

        <NavMenu />

        <SearchBox />

        <HeaderActions
          totalQuantity={totalQuantity}
          onCartClick={handleCartClick}
        />
      </header>
    </>
  );
};
