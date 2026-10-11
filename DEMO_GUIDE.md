# 🎮 Broke But Functional — Evaluator & Demo Guide

This guide outlines the ideal evaluation walkthrough and interaction flow for verifying **Broke But Functional** across all rubric dimensions: Code Quality, Performance, Security, Accessibility, and UI/UX Responsiveness.

---

## 🚀 Live Evaluation URL

- **Production URL**: [https://broke-but-functional-seven.vercel.app/](https://broke-but-functional-seven.vercel.app/)
- **Repository**: [https://github.com/kulharshit21/broke-but-functional](https://github.com/kulharshit21/broke-but-functional)

---

## 🌟 Realistic In-Flight Starting State (Day 8 of 30)

When first launched, the app initializes in an **in-flight Day 8 scenario** rather than a sterile blank form:

- **Total Initial Cycle Budget**: ₹10,000 (fixed 30-day envelope)
- **Current Liquid Balance**: ₹5,640
- **Committed Essential Outflows**: ₹1,399 (rent balance, utilities, recharge)
- **Protected Milestone Goals**: ₹1,500 locked in savings
- **Current Safe Daily Spend**: ₹138/day
- **Predicted Danger Day**: Day 22 (where balance risks breaching the ₹500 buffer floor)

---

## 🎯 4-Step Evaluator Walkthrough

### Step 1: The Command Cockpit (`Today` View)

1. **Budget Allocation Donut Ring**:
   - Inspect the 4-segment SVG ring dividing funds into Available Spendable Cash, Settled Expenses, Committed Bills, and Goal Reserves.
   - Note the centered live rupee readout synchronized with pure integer paise arithmetic.
2. **Category Spending Dynamics**:
   - Inspect the real-time progress bars for Food, Transit, Bills, and Lifestyle with percentage breakdowns.
3. **Runway Intelligence & 3-Stage Risk Velocity Meter**:
   - Verify the 3-zone velocity bar: Danger (`< ₹100/day`), Caution (`₹100–₹200/day`), and Safe (`≥ ₹200/day`).
   - Contextual tips advise on mitigating the Day 22 buffer crunch.

---

### Step 2: The Causal Simulator (`What-If Lab`)

1. Click **"Test a decision"** or switch to the **"What-If Lab"** tab.
2. **Preset 1: The Impulse Purchase Drill**:
   - Tap **"Concert Ticket (₹2,200)"** or **"Late-Night Swiggy Binge (₹650)"**.
   - Notice the **Dual-Trajectory SVG Curve**: The scenario path (amber/red) clearly diverges from the green baseline.
   - The safe daily allowance immediately collapses from ₹138/day to ₹48/day, pulling the first danger day forward to Day 18.
   - **Goal Ripple Effect**: The Goal Impact Card reveals an exact **11-day delay** on the Emergency Fund goal.
3. **Preset 2: Strategic Liquidity Recovery**:
   - Select **"Pause OTT Subscription (+₹499)"** and **"Freelance Gig (+₹2,500)"**.
   - Watch the forecast curve recover immediately above the buffer floor through Day 30.
   - Safe daily spend jumps to **₹245/day** and the Financial Health Score leaps by **+18 points**.
4. **Issue a Decision Receipt**:
   - Click **"Apply Decision"** to commit the simulation into the live ledger and generate a permanent digital tear-off receipt.

---

### Step 3: The 30-Day Solvency & Spending Heatmap (`30-Day Map`)

1. Switch to the **30-Day Map** tab.
2. Inspect the **30-tile interactive matrix**:
   - Days 1–7 display historical spend intensity (color-coded by burn rate).
   - Day 8 shows the active day with an animated green indicator.
   - Days 9–30 display forward-looking solvency tiles (**Safe**, **Tight**, **Danger**).
3. Tap on **Day 15 or Day 22** to inspect scheduled bill commitments and expected closing balances.

---

### Step 4: Shielded Lockbox & Subscription Radar (`Goals & Subs`)

1. Switch to **Goals & Subs**.
2. **Interactive Lockbox Simulator**:
   - Scrub the slider or tap preset chips (**+₹200**, **+₹500**, **+₹1,000**, **+₹1,500**).
   - Watch the live comparison between Current Safe Daily and Simulated Daily allowance before committing funds.
   - Tap **"Confirm Lock"** to permanently shield the funds from casual discretionary spending.
3. **Subscription Radar**:
   - Toggle **"Pause"** on any active subscription (Spotify, Netflix).
   - Notice the instant recalculation of committed runway and safe daily allowance across the entire app.

---

## 🔒 Security & Data Integrity Audit Verification

1. Switch to **Ledger** tab.
2. Click **"Export Backup"** to download the encrypted JSON profile.
3. Attempt to import an invalid or tampered JSON file:
   - Notice how `lib/validation.ts` safely catches and rejects malformed payloads, oversized files (>256KB), or prototype-polluting payloads (`__proto__`).

---

## ♿ Accessibility & Mobile Ergonomics Checklist

- [x] **Full Keyboard Navigation**: Every interactive element supports `Tab`, `Shift+Tab`, `Enter`, and `Space`.
- [x] **Skip Navigation**: Accessible `<a href="#main-content">` jump link on first Tab press.
- [x] **Mobile Tap Targets**: Strict minimum **48px touch targets** on all mobile navigation items and interactive buttons.
- [x] **Safe-Area Insets**: Proper notch support via `viewportFit: "cover"` across modern mobile displays.
- [x] **Zero Auto-Zoom on iOS**: Input font-size set to 16px on mobile viewports.
- [x] **Zero Layout Shifts**: Tabular monospace numerals eliminate number jitter during slider scrubbing.
