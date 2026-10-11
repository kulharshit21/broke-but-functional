# Broke But Functional — Survive the Month

A candid, local-first financial survival companion for anyone stretching ₹10,000 across 30 days. Instead of logging a purchase after the damage is done, the What‑If Lab shows how a choice changes daily allowance, runway, danger days, savings, month-end balance, risk, and health before the user commits.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The demo begins on Day 8 with ₹5,640 available. No account, API key, database, or network connection is needed after the page loads.

```bash
npm test
npm run build
```

The Next.js build is statically exported to `out/` and is ready for Vercel.

## Product decisions

- One engine, many views. Dashboard, chart, calendar, simulator, subscriptions, goals, and ledger all derive from the same state and forecast.
- Decisions are reversible. A simulation is non-destructive; Apply writes it to the month, creates a decision receipt, persists it, and supports undo.
- Candid, not punitive. The product says exactly what breaks and offers a recovery amount without guilt or invented predictions.
- Local-first. Versioned state lives under `bbf-state-v1`. Invalid storage falls back safely to the demo. Users can export, validate, and import JSON.
- Accounting stays explicit. Current cash, future commitments, protected savings, shock reserve, and total savings are separate concepts. Money uses integer paise internally.

## Money engine

Current balance is the opening balance plus completed inflows minus completed outflows. Future-dated items never change current balance.

`safe daily = max(0, current balance − essential commitments − active subscriptions − planned protected contribution − shock reserve − minimum buffer) ÷ usable days left`

The shock reserve is 40% of probability-weighted shock exposure, capped at ₹1,500. The day-by-day forecast subtracts planned variable spend, commitments, active subscriptions and savings, then adds scheduled income in date order. This avoids using income to cover a bill due before that income arrives.

Risk is a transparent 0–100 sum of bounded pressure from danger days, negative month-end balance, next-seven-day commitments, shock exposure, and subscription burden. Labels are Steady (0–24), Tight (25–49), Risky (50–74), and Danger (75–100).

Health is the inverse perspective, weighted from survival runway (30%), ending cushion (20%), savings progress (15%), commitment coverage (15%), spending discipline (10%), and shock readiness (10%). Labels are Fragile, Managing, and Stable.

## Demo month

The seed begins with ₹10,000 and six completed ledger entries, resulting in ₹5,640 on Day 8. The remaining month includes mobile recharge, groceries, subscriptions, education costs, social obligations, two savings goals, and three probability-weighted shocks. The situation is intentionally tight but recoverable.

## Two-minute judge demo

1. Open Today. Point to ₹5,640, Safe to spend today, the 30-day survival line, and the first danger day.
2. Open What‑If Lab and choose **Buy concert ticket**. Show the blue path, metric deltas, and recovery amount.
3. Switch to **Pause OTT**, then **Take freelance gig**. Compare the extra runway and lower risk.
4. Apply the stronger choice. Show the Decision Receipt and the live dashboard recalculation.
5. Open Goals & Subs and pause another recurring cost. Show its immediate forecast impact.
6. Finish on the 30-Day Map: every bill and danger point has a date, and every choice changes the same financial story.

## Deploy to Vercel

Push this folder to GitHub, import the repository in Vercel, keep the detected Next.js preset, and deploy. No environment variables are required. Alternatively, with the Vercel CLI authenticated:

```bash
npx vercel
npx vercel --prod
```

## Architecture

- `app/` — Next.js shell, metadata, and custom Tailwind-backed design system
- `components/money-app.tsx` — five product surfaces and all user interactions
- `lib/types.ts` — domain model
- `lib/seed.ts` — realistic Day-8 demo and scenario presets
- `lib/engine.ts` — pure money, forecast, simulation, risk, health, and apply functions
- `lib/engine.test.ts` — deterministic Vitest coverage for core calculations and edge cases

Known limitation: the app models one 30-day survival cycle. Recurrence beyond Day 30 and multi-account bank sync are intentionally out of scope for a private, client-only hackathon demo.
