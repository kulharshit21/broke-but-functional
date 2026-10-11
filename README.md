# Broke But Functional

### Survive the month. See the consequence before you spend.

[![Live on Vercel](https://img.shields.io/badge/live-Vercel-171a17?style=for-the-badge&logo=vercel)](https://broke-but-functional-seven.vercel.app/)
[![Product checks](https://img.shields.io/github/actions/workflow/status/kulharshit21/broke-but-functional/ci.yml?branch=main&style=for-the-badge&label=tests)](https://github.com/kulharshit21/broke-but-functional/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15-0e5b3a?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-c9f04c?style=for-the-badge)](./LICENSE)

**Broke But Functional** is a local-first financial survival companion for Gen Z users stretching ₹10,000 across 30 days. It does not wait for a bad purchase to become history. The What‑If Lab shows how a decision changes cash, safe daily spend, commitments, runway, savings, danger days, risk, and financial health—before the user commits.

> Most expense trackers tell you where your money went. This one tells you what happens next.

## The product truth

Every screen answers one question: **“What can I safely spend today without breaking the month?”**

| What the user sees | What it actually means |
|---|---|
| Balance now | Cash already in the spending account |
| Locked for bills | Future essential commitments and active subscriptions |
| Protected savings | Money deliberately kept out of casual spending |
| Safe to spend today | The share left after bills, buffer, savings and shock reserve |
| Danger day | The first projected day below the minimum cash buffer |
| Financial risk | Explainable pressure from the forecast—not a fake AI probability |

## The five connected experiences

1. **Today — the command centre.** A high-signal view of safe spend, balance, runway, committed cash, shock reserve, health, and the 30-day survival line.
2. **What‑If Lab — the consequence engine.** Compare a concert ticket, freelance gig, emergency, BNPL purchase, subscription pause, savings transfer, or a custom amount without mutating real state.
3. **30-Day Map — the money calendar.** Inspect future balances and schedule an expense or income event on the correct day without changing today’s cash.
4. **Goals & Subs — protect and question.** Fund goals, preserve protected savings, and pause or resume recurring costs with immediate forecast feedback.
5. **Ledger — the paper trail.** Search and filter completed or upcoming money moves, undo decisions, import/export data, and reset the demo.

## Three moments built for the demo

### 01 — The purchase consequence

Choose **Buy concert ticket**. The current and simulated forecast paths separate in real time, the metric receipt quantifies every delta, and the recovery note says exactly how much daily spending must shrink.

### 02 — The month has geography

The handcrafted 30-day strip and calendar turn vague anxiety into specific dates: bills, subscription renewals, safe days, tight days and the first moment the buffer breaks.

### 03 — Recovery feels possible

Pause OTT or take the freelance gig. The same engine recalculates daily allowance, month-end cash, runway, risk and health. Apply the better move and the product issues a Decision Receipt.

## One source of financial truth

```text
profile + ledger + commitments + subscriptions + goals + risks
                              │
                              ▼
                   deterministic forecast
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
       safe daily        risk + health     30-day cashflow
            │                 │                 │
            └─────────────────┴─────────────────┘
                              │
                    every screen updates
```

All money uses **integer paise** internally. A future purchase affects future cash flow but never today’s actual balance. A savings transfer reduces spendable cash and increases the goal balance; it does not destroy total money. Paused subscriptions disappear from future outflows. Simulations stay non-destructive until Apply.

### Core formula

```text
available for daily spending =
  current balance
  − essential commitments
  − active subscriptions
  − protected planned savings
  − probability-weighted shock reserve
  − minimum cash buffer

safe daily spend = max(0, available for daily spending ÷ usable days left)
```

Shock reserve is 40% of probability-weighted exposure, capped at ₹1,500. Risk is a bounded 0–100 sum of danger days, negative month-end cash, near-term commitment pressure, shock exposure and subscription burden. Health weighs runway, cushion, savings progress, commitment coverage, spending discipline and shock readiness.

## Demo state

The app opens on **Day 8** with **₹5,640** left from the original ₹10,000. Rent, groceries, transport, utilities, a small freelance payment and chai are already in the books. Recharge, two grocery runs, three subscriptions, education costs, social commitments, two savings goals and three plausible shocks still lie ahead.

It is intentionally uncomfortable—but recoverable.

## Two-minute judge script

1. Open **Today**. Point to ₹5,640, Safe to spend today and the first danger day.
2. Enter the **What‑If Lab** and select **Buy concert ticket**. Follow the blue scenario path and metric receipt.
3. Select **Pause OTT**, then **Take freelance gig**. Compare breathing room and risk.
4. Apply the stronger choice and show its Decision Receipt.
5. Open **Goals & Subs** and pause a recurring cost.
6. End on the **30-Day Map**: every consequence has a date, and every view tells the same story.

## Run locally

```bash
git clone https://github.com/kulharshit21/broke-but-functional.git
cd broke-but-functional
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm test
npm run build
```

Vitest covers balance reconciliation, forecast length, negative cash, subscription pauses, emergencies, income improvements, shock scenarios, and score bounds. GitHub Actions runs tests and the production build on every push and pull request.

## Stack and structure

```text
app/
  globals.css            editorial fintech design system
  layout.tsx             metadata and application shell
  page.tsx               product entry point
components/
  money-app.tsx          five experiences and interaction state
lib/
  types.ts               financial domain model
  seed.ts                Day-8 demo and scenario presets
  engine.ts              pure forecast, scoring and simulation engine
  engine.test.ts         deterministic money-engine tests
.github/workflows/
  ci.yml                 test + build gate
```

- Next.js 15, React 19 and strict TypeScript
- Tailwind’s build pipeline with a completely custom design system
- Hand-built accessible SVG forecast charts—no chart library
- Versioned browser storage under `bbf-state-v1`
- Static export with no backend, secret, account or paid API

## Deployment

The GitHub repository is connected to Vercel. Every commit to `main` creates a production deployment after GitHub’s product checks pass. Pull requests receive preview deployments.

No environment variables are required.

## Design language

**Paper ledger meets modern Indian fintech.** Warm paper surfaces, deep institutional green, acid lime used as a signal rather than decoration, hard editorial shadows, serif narrative moments, and monospaced money. The interface is candid and specific without turning financial stress into shame.

## Scope

This release models one 30-day survival cycle. Bank sync, multi-account reconciliation and recurrence beyond Day 30 are deliberately excluded so the hackathon experience stays instant, private and explainable.

---

Built for the moment between **“I can afford this today”** and **“but what does it do to the rest of my month?”**
