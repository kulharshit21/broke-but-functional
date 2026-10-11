// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BudgetRing } from "../dashboard/BudgetRing";
import { CategoryBreakdown } from "../dashboard/CategoryBreakdown";
import { SpendingMatrix } from "../calendar/SpendingMatrix";
import { GoalImpactCard } from "../what-if/GoalImpactCard";
import { GoalLockboxSimulator } from "../goals/GoalLockboxSimulator";
import { HealthAdvice } from "../health/HealthAdvice";
import { HealthScore } from "../health/HealthScore";
import { RiskMeter } from "../health/RiskMeter";
import { BalanceCard } from "../budget/BalanceCard";
import { DailyAllowance } from "../budget/DailyAllowance";
import { ForecastLine } from "../charts/ForecastLine";
import { getForecast, getMetrics } from "@/lib/engine";
import { seedState } from "@/lib/seed";

describe("modular components", () => {
  const forecast = getForecast(seedState);
  const metrics = getMetrics(seedState, forecast);

  it("renders BudgetRing with pool metrics and legend", () => {
    render(<BudgetRing state={seedState} metrics={metrics} />);
    expect(screen.getByText(/SPENDABLE/i)).toBeInTheDocument();
    expect(screen.getByText(/Avail:/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent:/i)).toBeInTheDocument();
    expect(screen.getByText(/Bills:/i)).toBeInTheDocument();
    expect(screen.getByText(/Goals:/i)).toBeInTheDocument();
  });

  it("renders CategoryBreakdown with category bars", () => {
    render(<CategoryBreakdown state={seedState} />);
    expect(screen.getByText("Category Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Needs")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("renders SpendingMatrix with 30 day tiles", () => {
    const onSelectDay = vi.fn();
    render(
      <SpendingMatrix
        state={seedState}
        forecast={forecast}
        selectedDay={8}
        onSelectDay={onSelectDay}
      />,
    );
    expect(screen.getByText("Spending & Solvency Matrix")).toBeInTheDocument();
    expect(screen.getByText("D8")).toBeInTheDocument();
    expect(screen.getByText("D30")).toBeInTheDocument();
  });

  it("renders GoalImpactCard with delay consequences", () => {
    const goalImpact = [
      {
        goalId: "emergency-fund",
        goalName: "Emergency fund",
        stillOnTrack: false,
        delayDays: 14,
        dailyRequired: 15000,
      },
    ];
    render(<GoalImpactCard goalImpact={goalImpact} />);
    expect(screen.getByText("Savings Goal Ripple Effect")).toBeInTheDocument();
    expect(screen.getByText("Emergency fund")).toBeInTheDocument();
    expect(screen.getByText(/Delayed by 14 days/i)).toBeInTheDocument();
  });

  it("renders GoalLockboxSimulator with slider and simulated metrics", () => {
    const updateState = vi.fn();
    render(
      <GoalLockboxSimulator state={seedState} updateState={updateState} />,
    );
    expect(screen.getByText("Emergency Lockbox Simulator")).toBeInTheDocument();
    expect(screen.getByText(/Current Safe Daily/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Daily/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm Lock of/i }),
    ).toBeInTheDocument();
  });

  it("renders HealthAdvice with runway recommendations", () => {
    render(<HealthAdvice state={seedState} metrics={metrics} />);
    expect(
      screen.getByText("Personalized Runway Intelligence"),
    ).toBeInTheDocument();
  });

  it("renders BalanceCard with position vitals", () => {
    render(<BalanceCard metrics={metrics} />);
    expect(screen.getByText("Where you stand")).toBeInTheDocument();
    expect(screen.getByText("Liquid in hand")).toBeInTheDocument();
  });

  it("renders DailyAllowance with safe daily spend", () => {
    const onTest = vi.fn();
    render(<DailyAllowance metrics={metrics} onTestDecision={onTest} />);
    expect(screen.getByText("Safe to spend today")).toBeInTheDocument();
    expect(screen.getByText("YOUR SPENDABLE TRUTH")).toBeInTheDocument();
  });

  it("renders ForecastLine SVG with threshold line", () => {
    render(<ForecastLine forecast={forecast} />);
    expect(screen.getByText("₹750 BUFFER")).toBeInTheDocument();
  });

  it("renders HealthScore with orbit gauge", () => {
    render(<HealthScore metrics={metrics} />);
    expect(screen.getByText("Financial health")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
  });

  it("renders RiskMeter with 3-stage velocity indicator", () => {
    render(
      <RiskMeter riskScore={metrics.riskScore} riskLabel={metrics.riskLabel} />,
    );
    expect(screen.getByText("3-Stage Risk Velocity Meter")).toBeInTheDocument();
  });
});
