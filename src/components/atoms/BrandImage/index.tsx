import React from "react";
import Image from "next/image";

type BrandImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  width?: number | string;
  height?: number | string;
};

export const BrandImage: React.FC<BrandImageProps> = ({
  src,
  alt,
  className,
  imageClassName,
  width,
  height,
}) => {
  const numericWidth = typeof width === "number" ? width : (width && !isNaN(Number(width)) ? Number(width) : 46);
  const numericHeight = typeof height === "number" ? height : (height && !isNaN(Number(height)) ? Number(height) : 30);

  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        className={imageClassName}
        width={numericWidth}
        height={numericHeight}
        unoptimized
      />
    </figure>
  );
};
