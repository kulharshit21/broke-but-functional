"use client";

import React, { memo } from "react";
import type { Metrics } from "@/lib/types";

export interface HealthScoreProps {
  metrics: Metrics;
}

/**
 * Calibrated 0–100 Weighted Financial Health Gauge with orbit visual.
 */
export const HealthScore = memo(function HealthScore({
  metrics,
}: HealthScoreProps) {
  return (
    <div
      className="side-readout"
      role="region"
      aria-label={`Financial Health Score: ${metrics.healthScore}/100, ${metrics.healthLabel}`}
    >
      <div
        className="score-orbit"
        style={
          {
            "--score": `${metrics.healthScore * 3.6}deg`,
          } as React.CSSProperties
        }
      >
        <div>
          <strong>{metrics.healthScore}</strong>
          <small>/ 100</small>
        </div>
      </div>
      <p>Financial health</p>
      <strong>{metrics.healthLabel}</strong>
      <small>
        {metrics.nextDangerDay
          ? `Buffer breaks on Day ${metrics.nextDangerDay}`
          : "Buffer holds through Day 30"}
      </small>
    </div>
  );
});
