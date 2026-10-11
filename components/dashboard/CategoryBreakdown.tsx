"use client";

import React, { memo, useMemo } from "react";
import { formatINR, getCategoryBreakdown } from "@/lib/engine";
import type { MoneyState } from "@/lib/types";

export interface CategoryBreakdownProps {
  state: MoneyState;
}

/**
 * Category-level spending breakdown panel displaying percentages and distribution bars.
 */
export const CategoryBreakdown = memo(function CategoryBreakdown({
  state,
}: CategoryBreakdownProps) {
  const items = useMemo(() => getCategoryBreakdown(state), [state]);
  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="category-panel">
      <div className="section-title compact">
        <div>
          <p className="eyebrow">SPENDING DYNAMICS</p>
          <h2>Category Breakdown</h2>
        </div>
        <span>Total: {formatINR(totalSpent)}</span>
      </div>
      {items.length === 0 ? (
        <p className="empty-text">No recorded expenses yet.</p>
      ) : (
        <div className="category-bars">
          {items.map((cat) => (
            <div key={cat.category} className="cat-row">
              <div className="cat-head">
                <span className="cat-name">{cat.name}</span>
                <span className="cat-nums">
                  <small>{cat.percentage}%</small>
                  <strong>{formatINR(cat.amount)}</strong>
                </span>
              </div>
              <div className="cat-track">
                <div
                  className="cat-fill"
                  style={{
                    width: `${Math.min(100, Math.max(3, cat.percentage))}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
