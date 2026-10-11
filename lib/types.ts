export type Category =
  | "needs"
  | "groceries"
  | "food"
  | "transport"
  | "subscriptions"
  | "utilities"
  | "fun"
  | "social"
  | "health"
  | "education"
  | "emergency"
  | "income"
  | "savings"
  | "debt";
export type TransactionType =
  | "income"
  | "expense"
  | "savings_contribution"
  | "goal_withdrawal"
  | "subscription_charge"
  | "commitment_payment"
  | "emergency"
  | "loan_received"
  | "loan_repayment";

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  day: number;
  category: Category;
  type: TransactionType;
  status: "completed" | "upcoming";
  essential: boolean;
  note?: string;
}
export interface Commitment {
  id: string;
  label: string;
  amount: number;
  day: number;
  category: Category;
  essential: boolean;
  status: "upcoming" | "paid";
  optional?: boolean;
}
export interface Subscription {
  id: string;
  label: string;
  amount: number;
  day: number;
  category: Category;
  status: "active" | "paused" | "cancelled";
}
export interface Goal {
  id: string;
  label: string;
  target: number;
  saved: number;
  protected: boolean;
  targetDay: number;
  plannedContribution: number;
  note: string;
}
export interface Risk {
  id: string;
  label: string;
  amount: number;
  probability: number;
  day: number;
  active: boolean;
}
export interface DecisionLog {
  id: string;
  label: string;
  day: number;
  consequence: string;
}
export interface Profile {
  monthLength: number;
  currentDay: number;
  startingBalance: number;
  minimumBuffer: number;
  plannedDailySpend: number;
  riskTolerance: "cautious" | "balanced" | "bold";
}
export interface MoneyState {
  version: 1;
  profile: Profile;
  ledger: Transaction[];
  commitments: Commitment[];
  subscriptions: Subscription[];
  goals: Goal[];
  risks: Risk[];
  decisionsLog: DecisionLog[];
}

export type ScenarioKind =
  | "expense"
  | "income"
  | "pause_subscription"
  | "cancel_subscription"
  | "savings"
  | "withdraw_savings"
  | "delay_bill"
  | "bnpl"
  | "side_gig"
  | "emergency";
export interface Scenario {
  id: string;
  label: string;
  kind: ScenarioKind;
  amount: number;
  day: number;
  category: Category;
  targetId?: string;
  secondaryAmount?: number;
  includeShocks?: boolean;
}
export interface ForecastDay {
  day: number;
  balance: number;
  committedOutflow: number;
  income: number;
  discretionary: number;
  scenarioImpact: number;
  isDanger: boolean;
  isLow: boolean;
  events: string[];
}
export interface Metrics {
  currentBalance: number;
  daysLeft: number;
  committed: number;
  protectedSavings: number;
  expectedShock: number;
  shockReserve: number;
  safeDaily: number;
  monthEnd: number;
  minimumProjected: number;
  runway: number;
  dangerDays: number;
  nextDangerDay: number | null;
  riskScore: number;
  riskLabel: string;
  healthScore: number;
  healthLabel: string;
}
export interface SimulationResult {
  before: Metrics;
  after: Metrics;
  baseline: ForecastDay[];
  scenarioForecast: ForecastDay[];
  warnings: string[];
  recommendation: string;
  story: string;
}
