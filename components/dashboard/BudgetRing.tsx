"use client";

import React, { memo } from "react";
import { formatINR } from "@/lib/engine";
import type { Metrics, MoneyState } from "@/lib/types";

export interface BudgetRingProps {
  state: MoneyState;
  metrics: Metrics;
}

/**
 * Interactive SVG Donut Ring visualizing ₹10,000 Pool Allocation.
 * Shows Available, Spent, Committed, and Goals distribution.
 */
export const BudgetRing = memo(function BudgetRing({
  state,
  metrics,
}: BudgetRingProps) {
  const totalBudget = state.profile.startingBalance;
  const spent = state.ledger
    .filter((t) => t.status === "completed" && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const committed = metrics.committed;
  const protectedSavings = metrics.protectedSavings;
  const availableBalance = Math.max(
    0,
    metrics.currentBalance - metrics.committed - metrics.protectedSavings,
  );

  const size = 176;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeTotal = Math.max(1, totalBudget);
  const spentPct = Math.min(100, (spent / safeTotal) * 100);
  const committedPct = Math.min(100, (committed / safeTotal) * 100);
  const savingsPct = Math.min(100, (protectedSavings / safeTotal) * 100);
  const availablePct = Math.max(
    0,
    100 - (spentPct + committedPct + savingsPct),
  );

  const availableStroke = (availablePct / 100) * circumference;
  const spentStroke = (spentPct / 100) * circumference;
  const committedStroke = (committedPct / 100) * circumference;
  const savingsStroke = (savingsPct / 100) * circumference;

  let offset = 0;
  const availableOffset = offset;
  offset += availableStroke;
  const spentOffset = offset;
  offset += spentStroke;
  const committedOffset = offset;
  offset += committedStroke;
  const savingsOffset = offset;

  return (
    <div className="budget-ring-wrap">
      <div className="ring-container" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="ring-svg"
          role="img"
          aria-label={`Budget allocation ring: ${formatINR(availableBalance)} available (${Math.round(availablePct)}%), ${formatINR(spent)} spent (${Math.round(spentPct)}%), ${formatINR(committed)} committed (${Math.round(committedPct)}%), ${formatINR(protectedSavings)} saved (${Math.round(savingsPct)}%)`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--surface2)"
            strokeWidth={strokeWidth}
          />
          {availableStroke > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#124f37"
              strokeWidth={strokeWidth}
              strokeDasharray={`${availableStroke} ${circumference}`}
              strokeDashoffset={-availableOffset}
              strokeLinecap="round"
            />
          )}
          {spentStroke > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#b86b1d"
              strokeWidth={strokeWidth}
              strokeDasharray={`${spentStroke} ${circumference}`}
              strokeDashoffset={-spentOffset}
              strokeLinecap="round"
            />
          )}
          {committedStroke > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#2459a9"
              strokeWidth={strokeWidth}
              strokeDasharray={`${committedStroke} ${circumference}`}
              strokeDashoffset={-committedOffset}
              strokeLinecap="round"
            />
          )}
          {savingsStroke > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#059669"
              strokeWidth={strokeWidth}
              strokeDasharray={`${savingsStroke} ${circumference}`}
              strokeDashoffset={-savingsOffset}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="ring-center">
          <small>SPENDABLE</small>
          <strong>{formatINR(availableBalance)}</strong>
          <span>{Math.round(availablePct)}% left</span>
        </div>
      </div>
      <div className="ring-legend">
        <div className="legend-item">
          <span className="dot dot-avail" />
          <small>Avail: {formatINR(availableBalance)}</small>
        </div>
        <div className="legend-item">
          <span className="dot dot-spent" />
          <small>Spent: {formatINR(spent)}</small>
        </div>
        <div className="legend-item">
          <span className="dot dot-com" />
          <small>Bills: {formatINR(committed)}</small>
        </div>
        <div className="legend-item">
          <span className="dot dot-sav" />
          <small>Goals: {formatINR(protectedSavings)}</small>
        </div>
      </div>
    </div>
  );
});
