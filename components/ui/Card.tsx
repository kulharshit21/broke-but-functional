"use client";

import React, { memo } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

/**
 * Reusable surface container primitive with responsive borders and shadows.
 */
export const Card = memo(function Card({
  children,
  className = "",
  elevated = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`card ${elevated ? "card-elevated" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});
