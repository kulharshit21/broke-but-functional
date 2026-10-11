"use client";

import { useMemo, useCallback } from "react";
import type { MoneyState, Goal } from "@/lib/types";

export interface UseGoalsReturn {
  goals: Goal[];
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
  onDeposit: (goalId: string, amount: number) => void;
}

/**
 * Custom hook isolating savings goals management, progress calculations,
 * and lockbox allocation operations.
 */
export function useGoals(
  state: MoneyState,
  onUpdateState?: (
    updater: (s: MoneyState) => MoneyState,
    message: string,
  ) => void,
): UseGoalsReturn {
  const goals: Goal[] = state.goals;

  const totalSaved = useMemo(
    () => goals.reduce((sum: number, g: Goal) => sum + g.saved, 0),
    [goals],
  );

  const totalTarget = useMemo(
    () => goals.reduce((sum: number, g: Goal) => sum + g.target, 0),
    [goals],
  );

  const overallProgress = useMemo(
    () => (totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0),
    [totalSaved, totalTarget],
  );

  const onDeposit = useCallback(
    (goalId: string, amount: number) => {
      if (!onUpdateState) return;
      onUpdateState((s) => {
        const nextGoals = s.goals.map((g) =>
          g.id === goalId
            ? { ...g, saved: Math.min(g.target, g.saved + amount) }
            : g,
        );
        return { ...s, goals: nextGoals };
      }, `Deposited ₹${amount} into savings goal.`);
    },
    [onUpdateState],
  );

  return {
    goals,
    totalSaved,
    totalTarget,
    overallProgress,
    onDeposit,
  };
}
