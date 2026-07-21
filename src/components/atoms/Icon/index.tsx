import React from "react";
import clsx from "clsx";
import { svgMap } from "./svgs";
import "./index.scss";

function toCssDimension(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

export type IconProps = {
  svgName: string;
  color?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
};

const IconComponent = ({
  color,
  size = "1em",
  width,
  height,
  svgName,
  className,
  onClick,
}: IconProps) => {
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  const resolvedWidth = toCssDimension(finalWidth);
  const resolvedHeight = toCssDimension(finalHeight);

  const SvgElement = svgMap[svgName];

  if (!SvgElement) {
    console.warn(`Icon "${svgName}" not found in svgMap.`);
    return null;
  }

  return (
    <span
      className={clsx("icon", className)}
      onClick={onClick}
      style={{
        width: `var(--icon-width, ${resolvedWidth})`,
        height: `var(--icon-height, ${resolvedHeight})`,
        color,
        display: "inline-flex",
      }}
    >
      <SvgElement
        aria-hidden="true"
        focusable="false"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </span>
  );
};

export const Icon = React.memo(IconComponent);
