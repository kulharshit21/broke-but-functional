"use client";

import { useMemo, useCallback } from "react";
import type { MoneyState, Subscription } from "@/lib/types";

export interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  monthlyTotal: number;
  toggleSubscription: (subId: string) => void;
}

/**
 * Custom hook managing subscription commitments, recurring auto-debit status,
 * and monthly active burden.
 */
export function useSubscriptions(
  state: MoneyState,
  onUpdateState?: (
    updater: (s: MoneyState) => MoneyState,
    message: string,
  ) => void,
): UseSubscriptionsReturn {
  const subscriptions = state.subscriptions;

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((s) => s.status === "active"),
    [subscriptions],
  );

  const monthlyTotal = useMemo(
    () => activeSubscriptions.reduce((sum, s) => sum + s.amount, 0),
    [activeSubscriptions],
  );

  const toggleSubscription = useCallback(
    (subId: string) => {
      if (!onUpdateState) return;
      onUpdateState((s) => {
        const nextSubs = s.subscriptions.map((sub) => {
          if (sub.id !== subId) return sub;
          const nextStatus =
            sub.status === "active" ? ("paused" as const) : ("active" as const);
          return { ...sub, status: nextStatus };
        });
        return { ...s, subscriptions: nextSubs };
      }, "Subscription status updated. Runway recalculated.");
    },
    [onUpdateState],
  );

  return {
    subscriptions,
    activeSubscriptions,
    monthlyTotal,
    toggleSubscription,
  };
}
