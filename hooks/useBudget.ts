"use client";

import { useMemo, useCallback } from "react";
import { getMetrics, getForecast, formatINR } from "@/lib/engine";
import type { MoneyState, Metrics, ForecastDay } from "@/lib/types";

export interface UseBudgetReturn {
  forecast: ForecastDay[];
  metrics: Metrics;
  spent: number;
  availableBalance: number;
  formatAmount: (amount: number) => string;
}

/**
 * Custom hook encapsulating deterministic budget metrics,
 * 30-day forecast generation, and cashflow distribution.
 */
export function useBudget(state: MoneyState): UseBudgetReturn {
  const forecast = useMemo(() => getForecast(state), [state]);
  const metrics = useMemo(() => getMetrics(state, forecast), [state, forecast]);

  const spent = useMemo(() => {
    return state.ledger
      .filter((t) => t.status === "completed" && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.ledger]);

  const availableBalance = useMemo(() => {
    return Math.max(
      0,
      metrics.currentBalance - metrics.committed - metrics.protectedSavings,
    );
  }, [metrics.currentBalance, metrics.committed, metrics.protectedSavings]);

  const formatAmount = useCallback((amount: number) => formatINR(amount), []);

  return {
    forecast,
    metrics,
    spent,
    availableBalance,
    formatAmount,
  };
}
