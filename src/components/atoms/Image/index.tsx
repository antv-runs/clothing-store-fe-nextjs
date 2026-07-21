"use client";

import type { CSSProperties, ImgHTMLAttributes, ReactEventHandler } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import NextImage from "next/image";
import "./Image.scss";

type BaseImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height" | "src" | "alt" | "onLoad" | "onError" | "onClick">;

type ImageProps = BaseImageProps & {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholderClassName?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number | string;
  fit?: CSSProperties["objectFit"];
  objectPosition?: CSSProperties["objectPosition"];
  loading?: "lazy" | "eager";
  showPlaceholder?: boolean;
  isLoaded?: boolean;
  isError?: boolean;
  loadedClassName?: string;
  errorClassName?: string;
  renderWrapper?: boolean;
  priority?: boolean;
  sizes?: string;
  onLoad?: ReactEventHandler<HTMLImageElement>;
  onError?: ReactEventHandler<HTMLImageElement>;
  onClick?: ReactEventHandler<HTMLImageElement>;
};

function toCssDimension(value?: number | string) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

export const Image = ({
  src,
  fallbackSrc,
  alt,
  className,
  imgClassName,
  placeholderClassName,
  width,
  height,
  aspectRatio,
  fit = "cover",
  objectPosition,
  loading,
  showPlaceholder = false,
  isLoaded: externalIsLoaded,
  isError: externalIsError,
  loadedClassName = "is-loaded",
  errorClassName = "is-error",
  renderWrapper = true,
  priority,
  sizes,
  onLoad,
  onError,
  onClick,
  ...rest
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [internalIsLoaded, setInternalIsLoaded] = useState(false);
  const [internalIsError, setInternalIsError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setInternalIsLoaded(false);
    setInternalIsError(false);
  }, [src]);

  const handleLoad = (e: any) => {
    setInternalIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: any) => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setInternalIsError(false);
    } else {
      setInternalIsError(true);
    }
    onError?.(e);
  };

  const finalIsLoaded = externalIsLoaded ?? internalIsLoaded;
  const finalIsError = externalIsError ?? internalIsError;

  const resolvedAspectRatio = aspectRatio;
  const resolvedWidth = toCssDimension(width);
  const resolvedHeight = toCssDimension(height);
  const resolvedAspectRatioValue =
    resolvedAspectRatio !== undefined ? String(resolvedAspectRatio) : undefined;

  const wrapperStyle: CSSProperties = {
    width: resolvedWidth,
    height: resolvedHeight,
    aspectRatio: resolvedAspectRatioValue,
  };

  // Convert dimensions to numbers if possible
  const numericWidth = typeof width === "number" ? width : (width && !isNaN(Number(width)) ? Number(width) : undefined);
  const numericHeight = typeof height === "number" ? height : (height && !isNaN(Number(height)) ? Number(height) : undefined);

  // If width or height are not absolute numbers, we must use next/image's "fill" prop
  const isFill = numericWidth === undefined || numericHeight === undefined;

  const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const activeSrc = imgSrc || transparentPixel;

  const isSvgOrDataUrl = activeSrc.startsWith("data:") || activeSrc.includes(".svg") || activeSrc.includes("localhost");
  const unoptimized = isSvgOrDataUrl;

  const resolvedImgClassName = clsx(
    renderWrapper && "ui-image__img",
    imgClassName,
    finalIsLoaded && loadedClassName,
    finalIsError && errorClassName,
  );

  const resolvedPlaceholderClassName = clsx(
    "ui-image__placeholder",
    placeholderClassName,
  );

  const imageStyles: CSSProperties = {
    objectFit: fit,
    objectPosition,
  };

  const { decoding, ...cleanRest } = rest;

  const nextImageProps = {
    src: activeSrc,
    alt,
    priority,
    unoptimized,
    className: resolvedImgClassName,
    onLoad: handleLoad,
    onError: handleError,
    onClick,
    ...((loading && !priority) ? { loading } : {}),
  };

  const resolvedWrapperClassName = clsx(
    "ui-image",
    className,
    finalIsLoaded && "ui-image--loaded",
    finalIsError && "ui-image--error",
  );

  if (isSvgOrDataUrl) {
    if (!renderWrapper) {
      return (
        <img
          className={resolvedImgClassName}
          src={activeSrc}
          alt={alt}
          loading={loading}
          style={{ width: resolvedWidth, height: resolvedHeight, aspectRatio: resolvedAspectRatioValue, ...imageStyles }}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          {...(cleanRest as any)}
        />
      );
    }
    return (
      <div className={resolvedWrapperClassName} style={wrapperStyle}>
        <img
          className={resolvedImgClassName}
          src={activeSrc}
          alt={alt}
          loading={loading}
          style={{ width: "100%", height: "100%", ...imageStyles }}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          {...(cleanRest as any)}
        />
        {showPlaceholder ? (
          <span className={resolvedPlaceholderClassName} aria-hidden="true" />
        ) : null}
      </div>
    );
  }

  if (!renderWrapper) {
    if (isFill) {
      return (
        <NextImage
          fill
          sizes={sizes}
          style={imageStyles}
          {...nextImageProps}
          {...(cleanRest as any)}
        />
      );
    }
    return (
      <NextImage
        width={numericWidth}
        height={numericHeight}
        sizes={sizes}
        style={{ ...imageStyles, width: resolvedWidth, height: resolvedHeight, aspectRatio: resolvedAspectRatioValue }}
        {...nextImageProps}
        {...(cleanRest as any)}
      />
    );
  }

  return (
    <div className={resolvedWrapperClassName} style={wrapperStyle}>
      {isFill ? (
        <NextImage
          fill
          sizes={sizes}
          style={imageStyles}
          {...nextImageProps}
          {...(cleanRest as any)}
        />
      ) : (
        <NextImage
          width={numericWidth}
          height={numericHeight}
          sizes={sizes}
          style={imageStyles}
          {...nextImageProps}
          {...(cleanRest as any)}
        />
      )}
      {showPlaceholder ? (
        <span className={resolvedPlaceholderClassName} aria-hidden="true" />
      ) : null}
    </div>
  );
};
