import type { MoneyState, Scenario } from "./types";

const r = (rupees: number) => Math.round(rupees * 100);

export const seedState: MoneyState = {
  version: 1,
  profile: { monthLength: 30, currentDay: 8, startingBalance: r(10000), minimumBuffer: r(750), plannedDailySpend: r(160), riskTolerance: "cautious" },
  ledger: [
    { id: "t-rent", label: "Room rent", amount: r(3200), day: 2, category: "needs", type: "expense", status: "completed", essential: true },
    { id: "t-grocery", label: "Weekly grocery", amount: r(850), day: 3, category: "groceries", type: "expense", status: "completed", essential: true },
    { id: "t-bus", label: "Bus pass", amount: r(850), day: 4, category: "transport", type: "expense", status: "completed", essential: true },
    { id: "t-freelance", label: "Freelance editing", amount: r(1200), day: 5, category: "income", type: "income", status: "completed", essential: false },
    { id: "t-chai", label: "Chai & snacks", amount: r(180), day: 6, category: "food", type: "expense", status: "completed", essential: false },
    { id: "t-power", label: "Electricity bill", amount: r(480), day: 7, category: "utilities", type: "expense", status: "completed", essential: true },
  ],
  commitments: [
    { id: "c-mobile", label: "Mobile recharge", amount: r(239), day: 9, category: "utilities", essential: true, status: "upcoming" },
    { id: "c-gift", label: "Friend’s birthday gift", amount: r(450), day: 10, category: "social", essential: false, status: "upcoming", optional: true },
    { id: "c-laundry", label: "Laundry", amount: r(180), day: 14, category: "needs", essential: true, status: "upcoming" },
    { id: "c-grocery-2", label: "Grocery restock", amount: r(1100), day: 15, category: "groceries", essential: true, status: "upcoming" },
    { id: "c-grocery-3", label: "Grocery restock", amount: r(1000), day: 20, category: "groceries", essential: true, status: "upcoming" },
    { id: "c-print", label: "Project printout", amount: r(350), day: 24, category: "education", essential: true, status: "upcoming" },
    { id: "c-festival", label: "Festival contribution", amount: r(500), day: 26, category: "social", essential: false, status: "upcoming", optional: true },
  ],
  subscriptions: [
    { id: "s-ott", label: "OTT", amount: r(199), day: 12, category: "subscriptions", status: "active" },
    { id: "s-music", label: "Music", amount: r(119), day: 16, category: "subscriptions", status: "active" },
    { id: "s-cloud", label: "Cloud storage", amount: r(75), day: 22, category: "subscriptions", status: "active" },
  ],
  goals: [
    { id: "g-emergency", label: "Emergency fund", target: r(1500), saved: r(300), protected: true, targetDay: 30, plannedContribution: r(300), note: "Do not touch unless it is serious." },
    { id: "g-festival", label: "Festival savings", target: r(900), saved: 0, protected: false, targetDay: 27, plannedContribution: 0, note: "Optional, but wants to happen." },
  ],
  risks: [
    { id: "r-medical", label: "Medical surprise", amount: r(650), probability: .12, day: 18, active: true },
    { id: "r-phone", label: "Phone repair", amount: r(900), probability: .08, day: 24, active: true },
    { id: "r-wedding", label: "Wedding gift", amount: r(800), probability: .10, day: 27, active: true },
  ],
  decisionsLog: [{ id: "d-pre", label: "Paused gaming subscription", day: 0, consequence: "Saved ₹99 before the month began." }],
};

export const scenarioPresets: Scenario[] = [
  { id: "concert", label: "Buy concert ticket", kind: "expense", amount: r(900), day: 12, category: "fun" },
  { id: "pause-ott", label: "Pause OTT", kind: "pause_subscription", amount: r(199), day: 8, category: "subscriptions", targetId: "s-ott" },
  { id: "medical", label: "Emergency medical bill", kind: "emergency", amount: r(650), day: 18, category: "health" },
  { id: "gig", label: "Take freelance gig", kind: "side_gig", amount: r(1200), secondaryAmount: r(180), day: 11, category: "income" },
  { id: "bnpl", label: "Sneakers on BNPL", kind: "bnpl", amount: r(1500), day: 25, category: "fun" },
  { id: "cancel-music", label: "Cancel music", kind: "cancel_subscription", amount: r(119), day: 8, category: "subscriptions", targetId: "s-music" },
  { id: "save-300", label: "Add ₹300 to emergency fund", kind: "savings", amount: r(300), day: 9, category: "savings", targetId: "g-emergency" },
  { id: "repair", label: "Phone repair shock", kind: "emergency", amount: r(900), day: 18, category: "emergency" },
];
