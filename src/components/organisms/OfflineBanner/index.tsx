"use client";

import { useState, useEffect } from "react";
import "./index.scss";

/**
 * OfflineBanner — Shows a non-blocking fixed banner when the browser
 * loses internet connectivity. Automatically hides when back online.
 */
export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(() => typeof globalThis.window === "undefined" ? false : !globalThis.navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setShowBackOnline(false);
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
    };

    globalThis.window?.addEventListener("offline", handleOffline);
    globalThis.window?.addEventListener("online", handleOnline);

    return () => {
      globalThis.window?.removeEventListener("offline", handleOffline);
      globalThis.window?.removeEventListener("online", handleOnline);
    };
  }, []);

  // Auto-dismiss "Back online" after a short delay
  useEffect(() => {
    if (!showBackOnline) return;

    const timer = setTimeout(() => {
      setShowBackOnline(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showBackOnline]);

  if (!isOffline && !showBackOnline) return null;

  return (
    <div
      className={`offline-banner ${showBackOnline ? "offline-banner--online" : ""}`}
      role="status"
      aria-live="assertive"
    >
      <span className="offline-banner__icon" aria-hidden="true">
        {showBackOnline ? "✓" : "⚠"}
      </span>
      <span className="offline-banner__text">
        {showBackOnline
          ? "Back online"
          : "No internet connection"}
      </span>
    </div>
  );
};
