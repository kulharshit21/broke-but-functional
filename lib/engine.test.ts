import { describe, expect, it } from "vitest";
import { applyScenario, getCurrentBalance, getForecast, getHealthScore, getRiskScore, getSafeToSpendToday, simulateDecision } from "./engine";
import { scenarioPresets, seedState } from "./seed";

describe("money engine", () => {
  it("reconciles the seeded Day 8 balance", () => {
    expect(getCurrentBalance(seedState)).toBe(564000);
    expect(getSafeToSpendToday(seedState)).toBeGreaterThanOrEqual(0);
  });
  it("builds one forecast point per usable day", () => {
    const forecast = getForecast(seedState);
    expect(forecast).toHaveLength(23);
    expect(forecast[0].day).toBe(8);
    expect(forecast.at(-1)?.day).toBe(30);
  });
  it("allows negative projections without corrupting scores", () => {
    const costly = { ...scenarioPresets[0], amount: 2000000 };
    const result = simulateDecision(seedState, costly);
    expect(result.after.monthEnd).toBeLessThan(0);
    expect(result.after.riskScore).toBeGreaterThanOrEqual(result.before.riskScore);
    expect(result.after.healthScore).toBeGreaterThanOrEqual(0);
  });
  it("pausing a subscription removes its outflow", () => {
    const pause = scenarioPresets.find(s => s.id === "pause-ott")!;
    const result = simulateDecision(seedState, pause);
    expect(result.after.monthEnd - result.before.monthEnd).toBe(19900);
    const applied = applyScenario(seedState, pause);
    expect(applied.subscriptions.find(s => s.id === "s-ott")?.status).toBe("paused");
  });
  it("an emergency expense increases or preserves risk", () => {
    const emergency = scenarioPresets.find(s => s.id === "repair")!;
    const result = simulateDecision(seedState, emergency);
    expect(result.after.riskScore).toBeGreaterThanOrEqual(result.before.riskScore);
    expect(result.after.monthEnd).toBeLessThan(result.before.monthEnd);
  });
  it("income improves runway or ending balance", () => {
    const gig = scenarioPresets.find(s => s.id === "gig")!;
    const result = simulateDecision(seedState, gig);
    expect(result.after.monthEnd).toBeGreaterThan(result.before.monthEnd);
    expect(result.after.runway).toBeGreaterThanOrEqual(result.before.runway);
  });
  it("clamps risk and health scores", () => {
    expect(getRiskScore(seedState)).toBeGreaterThanOrEqual(0);
    expect(getRiskScore(seedState)).toBeLessThanOrEqual(100);
    expect(getHealthScore(seedState)).toBeGreaterThanOrEqual(0);
    expect(getHealthScore(seedState)).toBeLessThanOrEqual(100);
  });
});
