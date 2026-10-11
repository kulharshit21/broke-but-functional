"use client";

import React, { memo } from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "safe" | "caution" | "danger" | "neutral" | "live";
  children: React.ReactNode;
}

/**
 * Reusable accessible status badge and risk pill primitive.
 */
export const Badge = memo(function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantClass = variant === "live" ? "live-dot" : `risk-pill ${variant}`;

  return (
    <span className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
});
