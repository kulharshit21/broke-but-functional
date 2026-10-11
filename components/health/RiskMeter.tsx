"use client";

import React, { memo } from "react";

export interface RiskMeterProps {
  riskScore: number;
  riskLabel: string;
}

/**
 * Three-Stage Velocity Risk Meter indicating Danger, Caution, or Safe runway velocity.
 */
export const RiskMeter = memo(function RiskMeter({
  riskScore,
  riskLabel,
}: RiskMeterProps) {
  const normalizedLabel = riskLabel.toLowerCase();

  return (
    <div
      className="risk-velocity-bar"
      role="region"
      aria-label={`Risk velocity: ${riskLabel}, score ${riskScore}`}
    >
      <div className="risk-velocity-head">
        <span>3-Stage Risk Velocity Meter</span>
        <span className="risk-score-tag">
          {riskLabel} · {riskScore}/100
        </span>
      </div>
      <div
        className="velocity-segments"
        role="progressbar"
        aria-valuenow={riskScore}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`segment danger ${normalizedLabel === "danger" || normalizedLabel === "risky" ? "active" : ""}`}
        >
          Danger &lt;₹100
        </div>
        <div
          className={`segment caution ${normalizedLabel === "caution" || normalizedLabel === "tight" ? "active" : ""}`}
        >
          Caution ₹100–₹200
        </div>
        <div
          className={`segment safe ${normalizedLabel === "safe" || normalizedLabel === "steady" ? "active" : ""}`}
        >
          Safe &gt;₹200
        </div>
      </div>
    </div>
  );
});
