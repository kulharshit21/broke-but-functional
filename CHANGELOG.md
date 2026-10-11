# Changelog

All notable changes to **Broke But Functional** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-11

### Added

- **Personalized Runway Intelligence**: Dynamic coaching cues and actionable financial recommendations generated in real time based on runway and safe daily allowance (`HealthAdvice.tsx`).
- **Modular Component Architecture**: Extracted monolithic view logic into clean, dedicated modules across `components/dashboard/`, `components/calendar/`, `components/what-if/`, `components/goals/`, and `components/health/`.
- **Extended Test Suite**: Added 7 new automated tests in `modular-components.test.tsx` and `engine.test.ts`, bringing total test coverage to 30 tests.
- **Architectural & Developer Documentation**: Added `ARCHITECTURE.md`, `CONTRIBUTING.md`, and rich JSDoc documentation across domain types and financial engines.

### Changed

- Refactored `next.config.ts` with compression, power headers removal, and production optimization flags.
- Enhanced responsive CSS rules in `app/globals.css` with fluid grid layouts, mobile touch target compliance, and container safety boundaries.
- Upgraded `app/layout.tsx` with explicit responsive viewport dimensions (`width=device-width, initial-scale=1, maximum-scale=5`).

---

## [1.1.0] - 2026-10-11

### Added

- **₹10,000 Pool Allocation Ring**: Interactive SVG donut chart showing real-time distribution across Available, Spent, Committed Bills, and Goal Reserves.
- **30-Day Spending & Solvency Matrix**: Heatmap-style 30-tile grid revealing historical spending intensity alongside forward-looking solvency status.
- **Category Spending Dynamics**: Breakdown of completed disbursements with percentage distribution tracks.
- **Savings Goal Ripple Effect**: Real-time feedback calculating milestone completion delay and additional daily savings requirements.
- **Emergency Lockbox Simulator**: Interactive slider allowing users to test locking liquid cash into protected reserves.

---

## [1.0.0] - 2026-10-11

### Initial Release

- Core deterministic cashflow engine with integer paise precision.
- What-If Lab comparative simulation with dual-track forecast curves.
- 30-day interactive calendar map and day drawer.
- Goals & subscription manager with pause/resume mechanics.
- Immutable audit ledger with decision revert and JSON backup/restore.
- Full WCAG 2.1 AA accessibility and zero-dependency SVG visualization engine.
