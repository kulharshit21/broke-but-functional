"use client";

import { useMemo } from "react";
import { getRunwayAdvice } from "@/lib/engine";
import type { MoneyState, Metrics, RunwayAdviceItem } from "@/lib/types";

export interface UseHealthScoreReturn {
  healthScore: number;
  healthLabel: string;
  riskScore: number;
  riskLabel: string;
  tips: RunwayAdviceItem[];
}

/**
 * Custom hook isolating weighted financial health metrics,
 * risk velocity scoring, and dynamic runway advice.
 */
export function useHealthScore(
  state: MoneyState,
  metrics: Metrics,
): UseHealthScoreReturn {
  const tips = useMemo(() => getRunwayAdvice(metrics, state), [state, metrics]);

  return {
    healthScore: metrics.healthScore,
    healthLabel: metrics.healthLabel,
    riskScore: metrics.riskScore,
    riskLabel: metrics.riskLabel,
    tips,
  };
}
