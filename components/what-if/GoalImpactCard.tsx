"use client";

import React, { memo } from "react";
import { Target } from "lucide-react";
import { formatINR } from "@/lib/engine";
import type { GoalImpact } from "@/lib/types";

export interface GoalImpactCardProps {
  goalImpact: GoalImpact[];
}

/**
 * Visualizes the ripple delay effect on active savings targets caused by discretionary spending.
 */
export const GoalImpactCard = memo(function GoalImpactCard({
  goalImpact,
}: GoalImpactCardProps) {
  if (!goalImpact || goalImpact.length === 0) return null;

  return (
    <div className="goal-ripple-card">
      <div className="ripple-head">
        <Target size={16} />
        <span>Savings Goal Ripple Effect</span>
      </div>
      <div className="ripple-list">
        {goalImpact.map((gi) => (
          <div key={gi.goalId} className="ripple-item">
            <span>{gi.goalName}</span>
            <span
              className={`ripple-badge ${gi.stillOnTrack ? "on-track" : "delayed"}`}
            >
              {gi.stillOnTrack
                ? "✓ On Track"
                : gi.delayDays > 0
                  ? `Delayed by ${gi.delayDays} days`
                  : `Needs +${formatINR(gi.dailyRequired)}/day`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
