"use client";

import React, { memo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  formatINR,
  getCurrentBalance,
  getSafeToSpendToday,
} from "@/lib/engine";
import type { MoneyState } from "@/lib/types";

export interface GoalLockboxSimulatorProps {
  state: MoneyState;
  updateState: (fn: (s: MoneyState) => MoneyState, msg: string) => void;
}

/**
 * Emergency Lockbox Simulator: Interactive sandbox to simulate locking
 * liquid cash into designated goals with instant daily allowance feedback.
 */
export const GoalLockboxSimulator = memo(function GoalLockboxSimulator({
  state,
  updateState,
}: GoalLockboxSimulatorProps) {
  const [lockAmount, setLockAmount] = useState(500);

  const primaryGoal = state.goals.find((g) => g.protected) || state.goals[0];
  const lockAmountPaise = lockAmount * 100;

  const currentDaily = getSafeToSpendToday(state);

  const simState = structuredClone(state);
  const simGoal = simState.goals.find((g) => g.id === primaryGoal?.id);
  if (simGoal) {
    simGoal.saved += lockAmountPaise;
  }
  const simDaily = getSafeToSpendToday(simState);
  const dailyDelta = simDaily - currentDaily;

  const handleApplyLock = () => {
    if (!primaryGoal) return;
    updateState(
      (s) => {
        const g = s.goals.find((x) => x.id === primaryGoal.id);
        if (g) g.saved += lockAmountPaise;
        s.ledger.unshift({
          id: `lock-${Date.now()}`,
          label: `Locked into ${primaryGoal.label}`,
          amount: lockAmountPaise,
          day: s.profile.currentDay,
          category: "savings",
          type: "savings_contribution",
          status: "completed",
          essential: false,
        });
        return s;
      },
      `Locked ${formatINR(lockAmountPaise)} into ${primaryGoal.label}. Buffer reinforced.`,
    );
  };

  return (
    <section className="goal-lockbox-card">
      <div className="section-title compact">
        <div>
          <p className="eyebrow">SAVINGS RIPPLE SIMULATOR</p>
          <h2>Emergency Lockbox Simulator</h2>
        </div>
        <span className="lockbox-badge">Test Lock Impact</span>
      </div>
      <p className="lockbox-desc">
        See how locking cash into your goal right now tightens today&apos;s
        daily allowance but solidifies your emergency safety net.
      </p>
      <div className="lockbox-slider-box">
        <div className="slider-label">
          <span>Amount to lock into {primaryGoal?.label || "savings"}</span>
          <strong>₹{lockAmount.toLocaleString("en-IN")}</strong>
        </div>
        <input
          type="range"
          min={100}
          max={Math.min(3000, Math.floor(getCurrentBalance(state) / 100))}
          step={100}
          value={lockAmount}
          onChange={(e) => setLockAmount(Number(e.target.value))}
          className="lockbox-slider"
          aria-label="Amount to lock into savings"
        />
        <div className="lockbox-presets">
          {[200, 500, 1000, 1500].map((amt) => (
            <button
              key={amt}
              type="button"
              className={`preset-btn ${lockAmount === amt ? "active" : ""}`}
              onClick={() => setLockAmount(amt)}
            >
              +₹{amt}
            </button>
          ))}
        </div>
      </div>
      <div className="lockbox-results">
        <div className="res-card">
          <small>Current Safe Daily</small>
          <strong>{formatINR(currentDaily)}</strong>
        </div>
        <div className="res-card">
          <small>Simulated Daily</small>
          <strong className={dailyDelta < 0 ? "warn-text" : ""}>
            {formatINR(simDaily)}
          </strong>
          <span className="delta-tag">{formatINR(dailyDelta, true)}/day</span>
        </div>
      </div>
      <button type="button" className="primary full" onClick={handleApplyLock}>
        <ShieldCheck size={16} /> Confirm Lock of ₹
        {lockAmount.toLocaleString("en-IN")}
      </button>
    </section>
  );
});
