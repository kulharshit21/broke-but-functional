import { describe, expect, it } from "vitest";
import { seedState } from "./seed";
import { MAX_IMPORT_BYTES, parseMoneyState } from "./validation";

const clone = () =>
  structuredClone(seedState) as unknown as Record<string, any>;

describe("money-state trust boundary", () => {
  it("accepts and clones the canonical demo state", () => {
    const parsed = parseMoneyState(seedState);
    expect(parsed).toEqual(seedState);
    expect(parsed).not.toBe(seedState);
  });

  it("rejects unsupported versions and incomplete objects", () => {
    expect(parseMoneyState({ version: 2 })).toBeNull();
    expect(parseMoneyState({ version: 1, profile: {} })).toBeNull();
  });

  it("rejects non-finite, negative, and excessive money values", () => {
    for (const amount of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      -1,
      1_000_000_001,
    ]) {
      const state = clone();
      state.ledger[0].amount = amount;
      expect(parseMoneyState(state)).toBeNull();
    }
  });

  it("rejects invalid dates and probabilities", () => {
    const badDay = clone();
    badDay.commitments[0].day = 31;
    expect(parseMoneyState(badDay)).toBeNull();

    const badProbability = clone();
    badProbability.risks[0].probability = 1.01;
    expect(parseMoneyState(badProbability)).toBeNull();
  });

  it("rejects unknown categories, statuses, and transaction types", () => {
    const badCategory = clone();
    badCategory.ledger[0].category = "<script>";
    expect(parseMoneyState(badCategory)).toBeNull();

    const badStatus = clone();
    badStatus.subscriptions[0].status = "free-forever";
    expect(parseMoneyState(badStatus)).toBeNull();

    const badType = clone();
    badType.ledger[0].type = "execute-code";
    expect(parseMoneyState(badType)).toBeNull();
  });

  it("rejects unsafe identifiers and oversized text", () => {
    const badId = clone();
    badId.ledger[0].id = "unsafe id with spaces";
    expect(parseMoneyState(badId)).toBeNull();

    const longLabel = clone();
    longLabel.ledger[0].label = "x".repeat(121);
    expect(parseMoneyState(longLabel)).toBeNull();
  });

  it("rejects duplicate identifiers across collections", () => {
    const duplicate = clone();
    duplicate.commitments[0].id = duplicate.ledger[0].id;
    expect(parseMoneyState(duplicate)).toBeNull();
  });

  it("rejects collections large enough to degrade the interface", () => {
    const oversized = clone();
    oversized.ledger = Array.from({ length: 501 }, (_, index) => ({
      ...oversized.ledger[0],
      id: `row-${index}`,
    }));
    expect(parseMoneyState(oversized)).toBeNull();
  });

  it("caps imported file size at 256 KiB", () => {
    expect(MAX_IMPORT_BYTES).toBe(262_144);
  });
});
