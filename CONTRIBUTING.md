# Contributing Guidelines

Thank you for contributing to **Broke But Functional**. To maintain code quality, deterministic accuracy, and security, please review the guidelines below.

---

## 1. Development Workflow

### Prerequisites

- Node.js `>= 20.9.0`
- npm `>= 10.0.0`

### Local Setup

```bash
git clone https://github.com/kulharshit21/broke-but-functional.git
cd broke-but-functional
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the local development build.

---

## 2. Quality Gate & Verification

Every pull request and commit must pass the unified verification pipeline:

```bash
npm run verify
```

The verification command executes:

1. `npm run format:check` — Prettier code style validation.
2. `npm run lint` — ESLint strict architecture and TypeScript rules (0 warnings, 0 errors).
3. `npm run typecheck` — TypeScript strict compiler check (`tsc --noEmit`).
4. `npm test` — Vitest automated test suite covering engines and components.
5. `npm run build` — Next.js Turbopack production static export.

---

## 3. Architectural Rules

- **Paise Precision**: Never use floating-point numbers (`0.10`, `0.20`) for raw currency storage. Always scale monetary values by 100 into integer paise.
- **Zero Heavy Dependencies**: Do not introduce heavyweight charting libraries (e.g. Recharts, Chart.js) or heavy CSS-in-JS runtimes. All charts are rendered via native SVG.
- **Input Sanitization**: Any external or user-provided JSON must cross the schema trust boundary defined in `lib/validation.ts`.
- **Accessibility**: All interactive elements must support keyboard navigation, visible focus indicators, and appropriate ARIA attributes.
