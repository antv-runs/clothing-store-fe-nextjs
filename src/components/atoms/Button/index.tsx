"use client";

import "./index.scss";
import clsx from "clsx";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  unstyled?: boolean;
  isLoading?: boolean;
  loadingText?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "primary",
  unstyled = false,
  isLoading = false,
  loadingText,
  className,
  type = "button",
  disabled,
  ...buttonProps
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={clsx(
        !unstyled && "button",
        !unstyled && `button--${variant}`,
        className,
      )}
      {...buttonProps}
    >
      <span
        className={clsx(
          !unstyled && "button__content",
          isLoading && !unstyled && "button__content--hidden",
        )}
        aria-hidden={isLoading || undefined}
      >
        {children}
      </span>

      {isLoading && !unstyled && (
        <span className="button__loading" role="status" aria-live="polite">
          <span className="button__spinner" aria-hidden="true" />
          {loadingText && (
            <span className="button__loading-text">{loadingText}</span>
          )}
          {!loadingText && <span className="button__sr-only">Loading</span>}
        </span>
      )}

      {isLoading && unstyled && (loadingText ?? children)}
    </button>
  );
};
