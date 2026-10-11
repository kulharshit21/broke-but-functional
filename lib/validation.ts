import type {
  Category,
  Commitment,
  DecisionLog,
  Goal,
  MoneyState,
  Risk,
  Subscription,
  Transaction,
  TransactionType,
} from "./types";

const categories = new Set<Category>([
  "needs",
  "groceries",
  "food",
  "transport",
  "subscriptions",
  "utilities",
  "fun",
  "social",
  "health",
  "education",
  "emergency",
  "income",
  "savings",
  "debt",
]);
const transactionTypes = new Set<TransactionType>([
  "income",
  "expense",
  "savings_contribution",
  "goal_withdrawal",
  "subscription_charge",
  "commitment_payment",
  "emergency",
  "loan_received",
  "loan_repayment",
]);
const transactionStatuses = new Set(["completed", "upcoming"]);
const commitmentStatuses = new Set(["upcoming", "paid"]);
const subscriptionStatuses = new Set(["active", "paused", "cancelled"]);
const riskTolerances = new Set(["cautious", "balanced", "bold"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value: unknown, max = 120): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;
const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
const isFiniteInt = (
  value: unknown,
  min = 0,
  max = 1_000_000_000,
): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= min &&
  value <= max;
const isDay = (value: unknown, monthLength = 30): value is number =>
  isFiniteInt(value, 1, monthLength);
const hasSafeId = (value: unknown): value is string =>
  isText(value, 80) && /^[a-zA-Z0-9._:-]+$/.test(value);

function validTransaction(
  value: unknown,
  monthLength: number,
): value is Transaction {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.amount, 1) &&
    isDay(value.day, monthLength) &&
    categories.has(value.category as Category) &&
    transactionTypes.has(value.type as TransactionType) &&
    transactionStatuses.has(value.status as string) &&
    isBoolean(value.essential) &&
    (value.note === undefined ||
      (typeof value.note === "string" && value.note.length <= 240))
  );
}

function validCommitment(
  value: unknown,
  monthLength: number,
): value is Commitment {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.amount, 1) &&
    isDay(value.day, monthLength) &&
    categories.has(value.category as Category) &&
    commitmentStatuses.has(value.status as string) &&
    isBoolean(value.essential) &&
    (value.optional === undefined || isBoolean(value.optional))
  );
}

function validSubscription(
  value: unknown,
  monthLength: number,
): value is Subscription {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.amount, 1) &&
    isDay(value.day, monthLength) &&
    categories.has(value.category as Category) &&
    subscriptionStatuses.has(value.status as string)
  );
}

function validGoal(value: unknown, monthLength: number): value is Goal {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.target, 1) &&
    isFiniteInt(value.saved) &&
    value.saved <= value.target &&
    isBoolean(value.protected) &&
    isDay(value.targetDay, monthLength) &&
    isFiniteInt(value.plannedContribution) &&
    typeof value.note === "string" &&
    value.note.length <= 240
  );
}

function validRisk(value: unknown, monthLength: number): value is Risk {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.amount, 1) &&
    typeof value.probability === "number" &&
    Number.isFinite(value.probability) &&
    value.probability >= 0 &&
    value.probability <= 1 &&
    isDay(value.day, monthLength) &&
    isBoolean(value.active)
  );
}

function validDecision(
  value: unknown,
  monthLength: number,
): value is DecisionLog {
  if (!isRecord(value)) return false;
  return (
    hasSafeId(value.id) &&
    isText(value.label) &&
    isFiniteInt(value.day, 0, monthLength) &&
    isText(value.consequence, 400)
  );
}

function hasUniqueIds(groups: Array<Array<{ id: string }>>): boolean {
  const ids = groups.flat().map((item) => item.id);
  return new Set(ids).size === ids.length;
}

/** Strict trust boundary for localStorage and user-supplied JSON imports. */
export function parseMoneyState(value: unknown): MoneyState | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.profile))
    return null;
  const profile = value.profile;
  const monthLength = profile.monthLength;
  if (
    !isFiniteInt(monthLength, 1, 31) ||
    !isDay(profile.currentDay, monthLength) ||
    !isFiniteInt(profile.startingBalance, 1) ||
    !isFiniteInt(profile.minimumBuffer) ||
    profile.minimumBuffer > profile.startingBalance ||
    !isFiniteInt(profile.plannedDailySpend) ||
    !riskTolerances.has(profile.riskTolerance as string)
  )
    return null;

  const collections = [
    value.ledger,
    value.commitments,
    value.subscriptions,
    value.goals,
    value.risks,
    value.decisionsLog,
  ];
  if (
    !collections.every(Array.isArray) ||
    collections.some((items) => items.length > 500)
  )
    return null;
  const ledger = value.ledger as unknown[];
  const commitments = value.commitments as unknown[];
  const subscriptions = value.subscriptions as unknown[];
  const goals = value.goals as unknown[];
  const risks = value.risks as unknown[];
  const decisionsLog = value.decisionsLog as unknown[];

  if (
    !ledger.every((item) => validTransaction(item, monthLength)) ||
    !commitments.every((item) => validCommitment(item, monthLength)) ||
    !subscriptions.every((item) => validSubscription(item, monthLength)) ||
    !goals.every((item) => validGoal(item, monthLength)) ||
    !risks.every((item) => validRisk(item, monthLength)) ||
    !decisionsLog.every((item) => validDecision(item, monthLength))
  )
    return null;

  const state = value as unknown as MoneyState;
  if (
    !hasUniqueIds([
      state.ledger,
      state.commitments,
      state.subscriptions,
      state.goals,
      state.risks,
      state.decisionsLog,
    ])
  )
    return null;
  return structuredClone(state);
}

export const MAX_IMPORT_BYTES = 256 * 1024;
