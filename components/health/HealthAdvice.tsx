"use client";

import React, { memo, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { getRunwayAdvice } from "@/lib/engine";
import type { Metrics, MoneyState, RunwayAdviceItem } from "@/lib/types";

export interface HealthAdviceProps {
  state: MoneyState;
  metrics: Metrics;
}

/**
 * Personalized Runway Intelligence: High-signal coaching cues, risk velocity meter,
 * and actionable guidance dynamically generated from the current 30-day solvency forecast.
 */
export const HealthAdvice = memo(function HealthAdvice({
  state,
  metrics,
}: HealthAdviceProps) {
  const tips = useMemo(() => getRunwayAdvice(metrics, state), [metrics, state]);

  const renderIcon = (type: RunwayAdviceItem["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={15} className="advice-icon-warn" />;
      case "opportunity":
        return <Sparkles size={15} className="advice-icon-opp" />;
      case "success":
        return <CheckCircle2 size={15} className="advice-icon-succ" />;
      case "tip":
      default:
        return <Lightbulb size={15} className="advice-icon-tip" />;
    }
  };

  const isDanger = metrics.safeDaily < 10000;
  const isCaution = metrics.safeDaily >= 10000 && metrics.safeDaily < 20000;
  const isSafe = metrics.safeDaily >= 20000;

  return (
    <section className="runway-advice-card">
      <div className="advice-head">
        <Sparkles size={17} />
        <span>Personalized Runway Intelligence</span>
      </div>

      <div className="risk-velocity-bar">
        <div className="risk-velocity-head">
          <span>
            Pacing Velocity:{" "}
            <strong>
              {isDanger
                ? "Danger (< ₹100/day)"
                : isCaution
                  ? "Caution (₹100–₹200/day)"
                  : "Safe (> ₹200/day)"}
            </strong>
          </span>
          <span className="risk-score-tag">
            Risk Score: {metrics.riskScore}/100
          </span>
        </div>
        <div
          className="velocity-segments"
          role="status"
          aria-label={`Pacing velocity: ${isDanger ? "Danger" : isCaution ? "Caution" : "Safe"}`}
        >
          <div className={`segment danger ${isDanger ? "active" : ""}`}>
            <span>&lt; ₹100 / day</span>
          </div>
          <div className={`segment caution ${isCaution ? "active" : ""}`}>
            <span>₹100–₹200 / day</span>
          </div>
          <div className={`segment safe ${isSafe ? "active" : ""}`}>
            <span>&gt; ₹200 / day</span>
          </div>
        </div>
      </div>

      <div className="advice-list">
        {tips.map((item) => (
          <div key={item.id} className={`advice-item ${item.type}`}>
            <div className="advice-item-title">
              {renderIcon(item.type)}
              <strong>{item.title}</strong>
            </div>
            <p className="advice-item-msg">{item.message}</p>
            {item.actionable && (
              <span className="advice-item-act">
                ⚡ Recommendation: {item.actionable}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});
