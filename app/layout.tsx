import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://broke-but-functional-seven.vercel.app"),
  title: {
    default: "Broke But Functional",
    template: "%s · BBF",
  },
  description:
    "A candid 30-day money survival companion for making every rupee count.",
  applicationName: "Broke But Functional",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Broke But Functional",
    description:
      "Survive the month, stress-test your choices, and make every rupee count.",
    url: "/",
    siteName: "Broke But Functional",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Broke But Functional",
    description:
      "Survive the month, stress-test your choices, and make every rupee count.",
  },
};

export const viewport: Viewport = {
  themeColor: "#103f2c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
