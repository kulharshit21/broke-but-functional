"use client";

import React, { memo } from "react";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/engine";
import type { Metrics } from "@/lib/types";

export interface DailyAllowanceProps {
  metrics: Metrics;
  onTestDecision: () => void;
}

/**
 * Hero Safe Daily Spend card displaying calibrated daily headroom
 * and instant launchpad for What-If scenario simulations.
 */
export const DailyAllowance = memo(function DailyAllowance({
  metrics,
  onTestDecision,
}: DailyAllowanceProps) {
  return (
    <div className="safe-hero" role="region" aria-label="Daily allowance">
      <div className="hero-kicker">
        <ShieldCheck size={17} /> YOUR SPENDABLE TRUTH
      </div>
      <p>Safe to spend today</p>
      <h2>{formatINR(metrics.safeDaily)}</h2>
      <div className="hero-caption">
        <span>{formatINR(metrics.currentBalance)} in hand</span>
        <ArrowRight size={16} />
        <span>{metrics.daysLeft} days to go</span>
      </div>
      <button className="primary" onClick={onTestDecision}>
        Test a decision <ArrowUpRight size={17} />
      </button>
      <div className="scribble">without hurting the month</div>
    </div>
  );
});
