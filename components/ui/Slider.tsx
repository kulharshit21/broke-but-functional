"use client";

import React, { memo } from "react";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable accessible slider primitive with touch manipulation support.
 */
export const Slider = memo(function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  className = "",
  ...props
}: SliderProps) {
  return (
    <div className={`slider-wrap ${className}`.trim()}>
      {label && <label className="slider-label">{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="accessible-slider"
        {...props}
      />
    </div>
  );
});
