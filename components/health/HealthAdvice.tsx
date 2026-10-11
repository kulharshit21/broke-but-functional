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
 * Personalized Runway Intelligence: High-signal coaching cues and actionable
 * guidance dynamically generated from the current 30-day solvency forecast.
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

  return (
    <section className="runway-advice-card">
      <div className="advice-head">
        <Sparkles size={17} />
        <span>Personalized Runway Intelligence</span>
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
