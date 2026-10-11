"use client";

import React, { memo } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * Reusable accessible button primitive adhering to WCAG 2.1 AA touch standards.
 */
export const Button = memo(function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses = variant === "icon" ? "icon-btn" : variant;
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});
