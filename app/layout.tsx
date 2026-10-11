import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Broke But Functional — Survive the Month",
  description: "A candid 30-day money survival companion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
