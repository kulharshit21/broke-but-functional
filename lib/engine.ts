import type {
  Category,
  CategoryBreakdownItem,
  ForecastDay,
  GoalImpact,
  Metrics,
  MoneyState,
  Scenario,
  SimulationResult,
  TransactionType,
} from "./types";

const inflows = new Set<TransactionType>([
  "income",
  "goal_withdrawal",
  "loan_received",
]);

const CATEGORY_COLORS: Record<Category, string> = {
  needs: "#124f37",
  groceries: "#2e7d32",
  food: "#d97706",
  transport: "#2563eb",
  subscriptions: "#7c3aed",
  utilities: "#0891b2",
  fun: "#ea580c",
  social: "#db2777",
  health: "#dc2626",
  education: "#4f46e5",
  emergency: "#b91c1c",
  income: "#15803d",
  savings: "#059669",
  debt: "#64748b",
};

const CATEGORY_NAMES: Record<Category, string> = {
  needs: "Needs",
  groceries: "Groceries",
  food: "Food & Dining",
  transport: "Transport",
  subscriptions: "Subscriptions",
  utilities: "Utilities",
  fun: "Fun & Leisure",
  social: "Social",
  health: "Health",
  education: "Education",
  emergency: "Emergency",
  income: "Income",
  savings: "Savings",
  debt: "Debt",
};

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));
export function formatINR(paise: number, sign = false) {
  const absolute = Math.abs(Math.round(paise));
  const rupees = Math.floor(absolute / 100).toString();
  const lastThree = rupees.slice(-3);
  const leading = rupees.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = leading ? `${leading},${lastThree}` : lastThree;
  const remainder = absolute % 100;
  const decimals = remainder ? `.${remainder.toString().padStart(2, "0")}` : "";
  return `${sign && paise > 0 ? "+" : paise < 0 ? "−" : ""}₹${grouped}${decimals}`;
}

export function getCurrentBalance(state: MoneyState) {
  return state.ledger
    .filter((t) => t.status === "completed")
    .reduce(
      (sum, t) => sum + (inflows.has(t.type) ? t.amount : -t.amount),
      state.profile.startingBalance,
    );
}
export const getDaysLeft = (state: MoneyState) =>
  Math.max(1, state.profile.monthLength - state.profile.currentDay + 1);
export const getExpectedShockExposure = (state: MoneyState) =>
  Math.round(
    state.risks
      .filter((r) => r.active)
      .reduce((s, risk) => s + risk.amount * risk.probability, 0),
  );
export const getShockReserve = (state: MoneyState) =>
  Math.min(150000, Math.round(getExpectedShockExposure(state) * 0.4));
export const getProtectedGoalReserve = (state: MoneyState) =>
  state.goals
    .filter((g) => g.protected)
    .reduce((s, g) => s + g.plannedContribution, 0);
export function getUpcomingCommittedTotal(state: MoneyState) {
  const { currentDay, monthLength } = state.profile;
  const bills = state.commitments
    .filter(
      (c) =>
        c.status === "upcoming" &&
        c.day >= currentDay &&
        c.day <= monthLength &&
        !c.optional,
    )
    .reduce((s, c) => s + c.amount, 0);
  const subs = state.subscriptions
    .filter(
      (s) =>
        s.status === "active" && s.day >= currentDay && s.day <= monthLength,
    )
    .reduce((n, s) => n + s.amount, 0);
  return bills + subs + getProtectedGoalReserve(state);
}
export function getSafeToSpendToday(state: MoneyState) {
  const available =
    getCurrentBalance(state) -
    getUpcomingCommittedTotal(state) -
    getShockReserve(state) -
    state.profile.minimumBuffer;
  return Math.max(0, Math.floor(available / getDaysLeft(state)));
}

function scenarioForDay(s: Scenario | undefined, day: number) {
  if (!s || s.day !== day) return { impact: 0, events: [] as string[] };
  if (s.kind === "income") return { impact: s.amount, events: [s.label] };
  if (s.kind === "side_gig")
    return { impact: s.amount - (s.secondaryAmount || 0), events: [s.label] };
  if (["expense", "emergency", "savings", "bnpl"].includes(s.kind))
    return { impact: -s.amount, events: [s.label] };
  if (s.kind === "withdraw_savings")
    return { impact: s.amount, events: [s.label] };
  return { impact: 0, events: [s.label] };
}

export function getForecast(
  state: MoneyState,
  scenario?: Scenario,
): ForecastDay[] {
  const rows: ForecastDay[] = [];
  let balance = getCurrentBalance(state);
  for (
    let day = state.profile.currentDay;
    day <= state.profile.monthLength;
    day++
  ) {
    let committedOutflow = 0,
      income = 0;
    const events: string[] = [];
    state.commitments
      .filter((c) => c.status === "upcoming" && c.day === day)
      .forEach((c) => {
        committedOutflow += c.amount;
        events.push(c.label);
      });
    state.subscriptions
      .filter(
        (sub) =>
          sub.status === "active" &&
          sub.day === day &&
          !(
            scenario &&
            ["pause_subscription", "cancel_subscription"].includes(
              scenario.kind,
            ) &&
            scenario.targetId === sub.id
          ),
      )
      .forEach((sub) => {
        committedOutflow += sub.amount;
        events.push(sub.label);
      });
    state.ledger
      .filter((t) => t.status === "upcoming" && t.day === day)
      .forEach((t) => {
        if (inflows.has(t.type)) income += t.amount;
        else committedOutflow += t.amount;
        events.push(t.label);
      });
    const adjustment = scenarioForDay(scenario, day);
    const shock = scenario?.includeShocks
      ? state.risks
          .filter((r) => r.active && r.day === day)
          .reduce((n, r) => n + Math.round(r.amount * r.probability), 0)
      : 0;
    const discretionary = state.profile.plannedDailySpend;
    balance +=
      income - committedOutflow - discretionary + adjustment.impact - shock;
    rows.push({
      day,
      balance,
      committedOutflow,
      income,
      discretionary,
      scenarioImpact: adjustment.impact - shock,
      isDanger: balance < state.profile.minimumBuffer,
      isLow: balance < state.profile.minimumBuffer + 50000,
      events: [...events, ...adjustment.events],
    });
  }
  return rows;
}

export function getRiskScore(state: MoneyState, forecast = getForecast(state)) {
  const dangerDays = forecast.filter((d) => d.isDanger).length;
  const end = forecast.at(-1)?.balance ?? getCurrentBalance(state);
  const balance = Math.max(1, getCurrentBalance(state));
  const next7 = state.commitments
    .filter(
      (c) => c.status === "upcoming" && c.day <= state.profile.currentDay + 7,
    )
    .reduce((s, c) => s + c.amount, 0);
  const subs = state.subscriptions
    .filter((s) => s.status === "active")
    .reduce((n, s) => n + s.amount, 0);
  return Math.round(
    clamp(
      Math.min(30, dangerDays * 3) +
        Math.min(25, Math.max(0, -end / 5000)) +
        Math.min(20, (next7 / balance) * 20) +
        Math.min(15, (getExpectedShockExposure(state) / balance) * 30) +
        Math.min(
          10,
          (subs /
            Math.max(10000, getSafeToSpendToday(state) * getDaysLeft(state))) *
            10,
        ),
    ),
  );
}

export function getHealthScore(
  state: MoneyState,
  forecast = getForecast(state),
) {
  const balance = getCurrentBalance(state),
    end = forecast.at(-1)?.balance ?? balance;
  const runway = forecast.findIndex((d) => d.isDanger);
  const survival = runway === -1 ? 1 : runway / Math.max(1, forecast.length);
  const cushion = clamp(
    end / Math.max(1, state.profile.minimumBuffer * 2),
    0,
    1,
  );
  const goalTarget = state.goals.reduce((s, g) => s + g.target, 0),
    goalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const goal = clamp(goalSaved / Math.max(1, goalTarget), 0, 1);
  const coverage = clamp(
    balance /
      Math.max(
        1,
        getUpcomingCommittedTotal(state) + state.profile.minimumBuffer,
      ),
    0,
    1,
  );
  const discipline = clamp(
    1 -
      state.ledger
        .filter((t) => !t.essential && !inflows.has(t.type))
        .reduce((s, t) => s + t.amount, 0) /
        Math.max(
          1,
          state.profile.plannedDailySpend * state.profile.currentDay * 1.5,
        ),
    0,
    1,
  );
  const shock = clamp(
    (balance - getUpcomingCommittedTotal(state)) /
      Math.max(1, getExpectedShockExposure(state) * 3),
    0,
    1,
  );
  return Math.round(
    (survival * 0.3 +
      cushion * 0.2 +
      goal * 0.15 +
      coverage * 0.15 +
      discipline * 0.1 +
      shock * 0.1) *
      100,
  );
}

export function getMetrics(
  state: MoneyState,
  forecast = getForecast(state),
): Metrics {
  const riskScore = getRiskScore(state, forecast),
    healthScore = getHealthScore(state, forecast);
  const danger = forecast.filter((d) => d.isDanger);
  return {
    currentBalance: getCurrentBalance(state),
    daysLeft: getDaysLeft(state),
    committed: getUpcomingCommittedTotal(state),
    protectedSavings: state.goals
      .filter((g) => g.protected)
      .reduce((s, g) => s + g.saved, 0),
    expectedShock: getExpectedShockExposure(state),
    shockReserve: getShockReserve(state),
    safeDaily: getSafeToSpendToday(state),
    monthEnd: forecast.at(-1)?.balance ?? getCurrentBalance(state),
    minimumProjected: Math.min(...forecast.map((f) => f.balance)),
    runway: danger.length
      ? Math.max(0, danger[0].day - state.profile.currentDay)
      : forecast.length,
    dangerDays: danger.length,
    nextDangerDay: danger[0]?.day ?? null,
    riskScore,
    riskLabel:
      riskScore < 25
        ? "Steady"
        : riskScore < 50
          ? "Tight"
          : riskScore < 75
            ? "Risky"
            : "Danger",
    healthScore,
    healthLabel:
      healthScore < 40 ? "Fragile" : healthScore < 70 ? "Managing" : "Stable",
  };
}

function projectScenarioState(state: MoneyState, scenario: Scenario) {
  const projected = structuredClone(state);
  if (["pause_subscription", "cancel_subscription"].includes(scenario.kind)) {
    const sub = projected.subscriptions.find((s) => s.id === scenario.targetId);
    if (sub)
      sub.status =
        scenario.kind === "pause_subscription" ? "paused" : "cancelled";
  } else if (scenario.kind === "delay_bill") {
    const bill = projected.commitments.find((c) => c.id === scenario.targetId);
    if (bill) bill.day = Math.min(projected.profile.monthLength, bill.day + 3);
  } else {
    const type: TransactionType =
      scenario.kind === "income" || scenario.kind === "side_gig"
        ? "income"
        : scenario.kind === "withdraw_savings"
          ? "goal_withdrawal"
          : scenario.kind === "savings"
            ? "savings_contribution"
            : scenario.kind === "emergency"
              ? "emergency"
              : "expense";
    projected.ledger.push({
      id: "simulated-decision",
      label: scenario.label,
      amount:
        scenario.kind === "side_gig"
          ? scenario.amount - (scenario.secondaryAmount || 0)
          : scenario.amount,
      day: scenario.day,
      category: scenario.category,
      type,
      status:
        scenario.day <= projected.profile.currentDay ? "completed" : "upcoming",
      essential: scenario.kind === "emergency",
    });
    if (scenario.kind === "savings" && scenario.targetId) {
      const goal = projected.goals.find((g) => g.id === scenario.targetId);
      if (goal) goal.saved += scenario.amount;
    }
  }
  if (scenario.includeShocks) {
    projected.risks
      .filter((r) => r.active && r.day >= projected.profile.currentDay)
      .forEach((risk) => {
        projected.ledger.push({
          id: `expected-${risk.id}`,
          label: `Expected exposure: ${risk.label}`,
          amount: Math.round(risk.amount * risk.probability),
          day: risk.day,
          category: "emergency",
          type: "emergency",
          status:
            risk.day <= projected.profile.currentDay ? "completed" : "upcoming",
          essential: true,
        });
      });
  }
  return projected;
}

export function getCategoryBreakdown(
  state: MoneyState,
): CategoryBreakdownItem[] {
  const totals = new Map<Category, number>();
  for (const t of state.ledger) {
    if (t.status === "completed" && !inflows.has(t.type)) {
      totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
    }
  }
  const totalSpent = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  if (totalSpent === 0) return [];

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      name: CATEGORY_NAMES[category] || category,
      amount,
      percentage: Math.round((amount / totalSpent) * 100),
      color: CATEGORY_COLORS[category] || "#64748b",
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getGoalImpact(
  state: MoneyState,
  before: Metrics,
  after: Metrics,
  scenario: Scenario,
): GoalImpact[] {
  return state.goals.map((g) => {
    const remaining = Math.max(0, g.target - g.saved);
    const daysUntilTarget = Math.max(1, g.targetDay - state.profile.currentDay);
    const currentDailyReq = Math.round(remaining / daysUntilTarget);

    if (scenario.kind === "savings" && scenario.targetId === g.id) {
      const newRemaining = Math.max(0, remaining - scenario.amount);
      const newDailyReq = Math.round(newRemaining / daysUntilTarget);
      return {
        goalId: g.id,
        goalName: g.label,
        stillOnTrack: true,
        delayDays: 0,
        dailyRequired: newDailyReq,
      };
    }

    const safeDelta = before.safeDaily - after.safeDaily;
    const isOutflow =
      ["expense", "emergency", "bnpl"].includes(scenario.kind) &&
      scenario.amount > 0;

    let delayDays = 0;
    if (isOutflow && safeDelta > 0) {
      const dailyContribution =
        g.plannedContribution > 0
          ? Math.round(g.plannedContribution / daysUntilTarget)
          : Math.max(100, Math.round(before.safeDaily * 0.2));
      delayDays = Math.min(
        daysUntilTarget,
        Math.ceil(scenario.amount / Math.max(100, dailyContribution)),
      );
    }

    const stillOnTrack =
      after.monthEnd >= 0 &&
      (after.nextDangerDay === null || after.nextDangerDay > g.targetDay);

    return {
      goalId: g.id,
      goalName: g.label,
      stillOnTrack,
      delayDays,
      dailyRequired: currentDailyReq,
    };
  });
}

export function simulateDecision(
  state: MoneyState,
  scenario: Scenario,
): SimulationResult {
  const projectedState = projectScenarioState(state, scenario);
  const baseline = getForecast(state),
    scenarioForecast = getForecast(projectedState);
  const before = getMetrics(state, baseline),
    after = getMetrics(projectedState, scenarioForecast);
  const delta = after.monthEnd - before.monthEnd;
  const warnings: string[] = [];
  if (after.monthEnd < 0)
    warnings.push(
      `This leaves the month short by ${formatINR(-after.monthEnd)}.`,
    );
  if (
    after.nextDangerDay &&
    (!before.nextDangerDay || after.nextDangerDay < before.nextDangerDay)
  )
    warnings.push(`Your buffer breaks on Day ${after.nextDangerDay}.`);
  if (after.riskScore > before.riskScore)
    warnings.push(`Risk rises ${after.riskScore - before.riskScore} points.`);
  if (!warnings.length)
    warnings.push(
      delta >= 0
        ? "This gives the month more breathing room."
        : "Your essential bills still fit after this choice.",
    );
  const dailyGap = Math.max(
    0,
    Math.ceil(
      (before.monthEnd - after.monthEnd) / Math.max(1, before.daysLeft),
    ),
  );
  const goalImpact = getGoalImpact(state, before, after, scenario);
  return {
    before,
    after,
    baseline,
    scenarioForecast,
    warnings,
    recommendation:
      delta < 0
        ? `Recover by trimming ${formatINR(dailyGap)} a day, or test a smaller amount.`
        : `Keep the gain as buffer until the next essential bill clears.`,
    story:
      delta < 0
        ? `${scenario.label} costs the future month ${formatINR(-delta)}. Today may look fine, but the runway gets tighter.`
        : `${scenario.label} adds ${formatINR(delta)} of breathing room to the month.`,
    goalImpact,
  };
}

export function applyScenario(
  state: MoneyState,
  scenario: Scenario,
): MoneyState {
  const next = structuredClone(state),
    stamp = Date.now().toString(36);
  if (["pause_subscription", "cancel_subscription"].includes(scenario.kind)) {
    const sub = next.subscriptions.find((s) => s.id === scenario.targetId);
    if (sub)
      sub.status =
        scenario.kind === "pause_subscription" ? "paused" : "cancelled";
  } else if (scenario.kind === "delay_bill") {
    const bill = next.commitments.find((c) => c.id === scenario.targetId);
    if (bill) bill.day = Math.min(next.profile.monthLength, bill.day + 3);
  } else {
    const type: TransactionType =
      scenario.kind === "income" || scenario.kind === "side_gig"
        ? "income"
        : scenario.kind === "withdraw_savings"
          ? "goal_withdrawal"
          : scenario.kind === "savings"
            ? "savings_contribution"
            : scenario.kind === "emergency"
              ? "emergency"
              : "expense";
    next.ledger.push({
      id: `applied-${stamp}`,
      label: scenario.label,
      amount:
        scenario.kind === "side_gig"
          ? scenario.amount - (scenario.secondaryAmount || 0)
          : scenario.amount,
      day: scenario.day,
      category: scenario.category,
      type,
      status:
        scenario.day <= next.profile.currentDay ? "completed" : "upcoming",
      essential: scenario.kind === "emergency",
    });
    if (scenario.kind === "savings" && scenario.targetId) {
      const goal = next.goals.find((g) => g.id === scenario.targetId);
      if (goal) goal.saved += scenario.amount;
    }
  }
  next.decisionsLog.unshift({
    id: `decision-${stamp}`,
    label: scenario.label,
    day: next.profile.currentDay,
    consequence: simulateDecision(state, scenario).story,
  });
  return next;
}
