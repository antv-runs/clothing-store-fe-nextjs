"use client";

import React from "react";
import Link from "next/link";
import { IconButton } from "@/components/atoms/IconButton";
import { Icon } from "@/components/atoms/Icon";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/routes/paths";
import "./index.scss";

type HeaderMenuToggleProps = Omit<React.ComponentProps<typeof IconButton>, "type">;

export const HeaderMenuToggle: React.FC<HeaderMenuToggleProps> = (props) => {
  return <IconButton type="button" {...props} />;
};

export const HeaderActions: React.FC = () => {
  const { totalCount: totalQuantity } = useCart();

  return (
    <div className="header-icon">
      <div className="header-icon__cart-wrapper">
        <Link
          href={ROUTES.CART}
          className="icon-button icon-button--default header-icon__cart"
          aria-label="Cart"
        >
          <Icon
            svgName="icn_cart"
            width={23}
            height={21}
          />
        </Link>
        {totalQuantity > 0 && (
          <span className="header-icon__cart-badge">{totalQuantity}</span>
        )}
      </div>
      <Link
        href="#"
        className="icon-button icon-button--default header-icon__profile"
        aria-label="Profile"
      >
        <Icon
          svgName="icn_profile"
          width={21}
          height={21}
        />
      </Link>
    </div>
  );
};
