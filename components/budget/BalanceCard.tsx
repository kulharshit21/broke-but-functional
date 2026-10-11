"use client";

import React, { memo } from "react";
import { formatINR } from "@/lib/engine";
import type { Metrics } from "@/lib/types";

export interface BalanceCardProps {
  metrics: Metrics;
  onOpenLedger?: () => void;
}

/**
 * Hero Balance Card highlighting liquid cash on hand,
 * projected month-end closing, and buffer floor.
 */
export const BalanceCard = memo(function BalanceCard({
  metrics,
  onOpenLedger,
}: BalanceCardProps) {
  return (
    <div
      className="position-panel"
      role="region"
      aria-label="Current cash balance"
    >
      <div className="panel-heading">
        <span>Where you stand</span>
        <span className="live-dot">LIVE PLAN</span>
      </div>
      <div className="position-big">
        <small>Projected month-end</small>
        <strong className={metrics.monthEnd < 0 ? "negative" : ""}>
          {formatINR(metrics.monthEnd)}
        </strong>
        <em>
          {metrics.monthEnd < 0
            ? "Requires liquidity intervention"
            : "Holds above safety floor"}
        </em>
      </div>
      <div className="mini-grid">
        <div>
          <small>Liquid in hand</small>
          <strong>{formatINR(metrics.currentBalance)}</strong>
        </div>
        <div>
          <small>Committed bills</small>
          <strong>{formatINR(metrics.committed)}</strong>
        </div>
        <div>
          <small>Goal lockbox</small>
          <strong>{formatINR(metrics.protectedSavings)}</strong>
        </div>
        <div>
          <small>Days remaining</small>
          <strong>{metrics.daysLeft} days</strong>
        </div>
      </div>
      {onOpenLedger && (
        <button
          className="secondary full"
          style={{ marginTop: 14 }}
          onClick={onOpenLedger}
        >
          View Full Cash Ledger
        </button>
      )}
    </div>
  );
});
