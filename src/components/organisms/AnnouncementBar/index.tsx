"use client";

import { useState } from "react";
import { IconButton } from "@/components/atoms/IconButton";
import { Text } from "@/components/atoms/Text";
import { TextLink } from "@/components/atoms/TextLink";
import "./index.scss";

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-bar__container">
        <Text as="p" className="announcement-bar__text">
          Sign up and get 20% off to your first order.{" "}
          <TextLink href="#" className="announcement-bar__link">
            Sign Up Now
          </TextLink>
        </Text>

        <IconButton
          svgName="icn_close"
          className="announcement-bar__close"
          ariaLabel="Close announcement"
          iconWidth={14}
          iconHeight={14}
          onClick={() => setIsVisible(false)}
        />
      </div>
    </div>
  );
};
