"use client";

import React, { memo, useMemo } from "react";
import { formatINR } from "@/lib/engine";
import type { ForecastDay, MoneyState } from "@/lib/types";

export interface SpendingMatrixProps {
  state: MoneyState;
  forecast: ForecastDay[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

/**
 * 30-Day Spending & Solvency Matrix: Heatmap-style 30-tile grid revealing
 * historical spending intensity alongside forward-looking solvency status.
 */
export const SpendingMatrix = memo(function SpendingMatrix({
  state,
  forecast,
  selectedDay,
  onSelectDay,
}: SpendingMatrixProps) {
  const daySpendMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const t of state.ledger) {
      if (
        t.status === "completed" &&
        t.type !== "income" &&
        t.type !== "goal_withdrawal" &&
        t.type !== "loan_received"
      ) {
        map.set(t.day, (map.get(t.day) || 0) + t.amount);
      }
    }
    return map;
  }, [state.ledger]);

  const forecastMap = useMemo(() => {
    return new Map(forecast.map((f) => [f.day, f]));
  }, [forecast]);

  return (
    <section className="spending-matrix-panel">
      <div className="matrix-head">
        <div>
          <p className="eyebrow">30-DAY BEAT</p>
          <h3>Spending & Solvency Matrix</h3>
        </div>
        <span className="matrix-badge">
          Day {state.profile.currentDay} Active
        </span>
      </div>
      <div className="matrix-grid">
        {Array.from({ length: state.profile.monthLength }, (_, i) => i + 1).map(
          (day) => {
            const isToday = day === state.profile.currentDay;
            const isPast = day < state.profile.currentDay;
            const isSelected = day === selectedDay;
            const pastSpend = daySpendMap.get(day) || 0;
            const f = forecastMap.get(day);

            let statusClass = "matrix-safe";
            if (isPast) {
              if (pastSpend === 0) statusClass = "matrix-zero";
              else if (pastSpend < 30000) statusClass = "matrix-low";
              else if (pastSpend < 60000) statusClass = "matrix-mid";
              else statusClass = "matrix-high";
            } else if (f) {
              if (f.isDanger) statusClass = "matrix-danger";
              else if (f.isLow) statusClass = "matrix-tight";
              else statusClass = "matrix-safe";
            }

            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(day)}
                className={`matrix-tile ${statusClass} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                title={`Day ${day}: ${isPast ? `Spent ${formatINR(pastSpend)}` : f ? `Projected ${formatINR(f.balance)}` : ""}`}
              >
                <span className="tile-day">D{day}</span>
                <span className="tile-val">
                  {isPast
                    ? pastSpend > 0
                      ? formatINR(pastSpend)
                      : "₹0"
                    : f
                      ? formatINR(f.balance)
                      : "—"}
                </span>
              </button>
            );
          },
        )}
      </div>
      <div className="matrix-legend">
        <span>Darker = heavier spend / danger</span>
        <div className="legend-pills">
          <span className="pill pill-zero">₹0</span>
          <span className="pill pill-low">&lt;₹300</span>
          <span className="pill pill-mid">₹300–₹600</span>
          <span className="pill pill-high">&gt;₹600</span>
          <span className="pill pill-danger">Danger</span>
        </div>
      </div>
    </section>
  );
});
