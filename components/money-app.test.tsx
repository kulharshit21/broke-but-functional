// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { MoneyApp } from "./money-app";

describe("MoneyApp interactions", () => {
  beforeEach(() => localStorage.clear());

  it("renders the connected financial dashboard", async () => {
    render(createElement(MoneyApp));
    expect(await screen.findByText("Safe to spend today")).toBeInTheDocument();
    expect(screen.getByText("Projected month-end")).toBeInTheDocument();
    expect(screen.getByText("Pool Allocation")).toBeInTheDocument();
    expect(screen.getByText("Category Breakdown")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("navigates to the what-if lab without a page reload", async () => {
    const user = userEvent.setup();
    render(createElement(MoneyApp));
    await screen.findByText("Safe to spend today");
    await user.click(screen.getByRole("button", { name: /test a decision/i }));
    expect(screen.getByText("DECISION UNDER TEST")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Decision consequence comparison"),
    ).toBeInTheDocument();
    expect(screen.getByText("Savings Goal Ripple Effect")).toBeInTheDocument();
  });

  it("opens a labelled dialog and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(createElement(MoneyApp));
    await screen.findByText("Safe to spend today");
    await user.click(screen.getByRole("button", { name: "Add expense" }));
    expect(
      screen.getByRole("dialog", { name: "Add expense" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("opens the unexpected-expense drill from the header", async () => {
    const user = userEvent.setup();
    render(createElement(MoneyApp));
    await screen.findByText("Safe to spend today");
    await user.click(
      screen.getByRole("button", {
        name: "Run an unexpected expense shock drill",
      }),
    );
    expect(screen.getAllByText("Phone repair shock").length).toBeGreaterThan(0);
    expect(screen.getByText("WEAKENS MONTH")).toBeInTheDocument();
  });
});
