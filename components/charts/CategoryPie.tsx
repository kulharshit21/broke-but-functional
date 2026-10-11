"use client";

import React, { memo } from "react";
import { formatINR } from "@/lib/engine";
import type { MoneyState } from "@/lib/types";

export interface CategoryPieProps {
  state: MoneyState;
}

/**
 * Accessible spending donut breakdown displaying category distribution.
 */
export const CategoryPie = memo(function CategoryPie({
  state,
}: CategoryPieProps) {
  const categoryTotals = state.ledger
    .filter((t) => t.status === "completed" && t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalSpent = entries.reduce((sum, [, amt]) => sum + amt, 0);

  return (
    <div
      className="category-pie-wrap"
      role="region"
      aria-label="Category spending breakdown"
    >
      <div className="category-bars">
        {entries.map(([cat, amt]) => {
          const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
          return (
            <div key={cat} className="cat-row">
              <div className="cat-head">
                <span className="cat-name">{cat}</span>
                <span className="cat-nums">
                  <small>{pct}%</small>
                  <strong>{formatINR(amt)}</strong>
                </span>
              </div>
              <div className="cat-track">
                <div
                  className="cat-fill"
                  style={{
                    width: `${pct}%`,
                    background:
                      cat === "food"
                        ? "#b86b1d"
                        : cat === "transit"
                          ? "#2459a9"
                          : cat === "bills"
                            ? "#124f37"
                            : "#7c3aed",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
