"use client";

import { useState, useMemo, useCallback } from "react";
import { simulateDecision } from "@/lib/engine";
import { scenarioPresets } from "@/lib/seed";
import type { MoneyState, Scenario, SimulationResult } from "@/lib/types";

export interface UseSimulatorReturn {
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  result: SimulationResult;
  currencyDelta: number;
  isNegativeOutcome: boolean;
  applyPreset: (presetId: string) => void;
}

/**
 * Custom hook isolating pure What-If causal simulation state,
 * scenario selection, and consequence delta analysis.
 */
export function useSimulator(state: MoneyState): UseSimulatorReturn {
  const [scenario, setScenario] = useState<Scenario>(scenarioPresets[0]);

  const result = useMemo(
    () => simulateDecision(state, scenario),
    [state, scenario],
  );

  const currencyDelta = useMemo(
    () => result.after.monthEnd - result.before.monthEnd,
    [result],
  );

  const isNegativeOutcome = useMemo(
    () =>
      currencyDelta < 0 ||
      result.after.safeDaily < result.before.safeDaily ||
      result.after.riskScore > result.before.riskScore,
    [currencyDelta, result],
  );

  const applyPreset = useCallback((presetId: string) => {
    const found = scenarioPresets.find((p) => p.id === presetId);
    if (found) {
      setScenario(found);
    }
  }, []);

  return {
    scenario,
    setScenario,
    result,
    currencyDelta,
    isNegativeOutcome,
    applyPreset,
  };
}
