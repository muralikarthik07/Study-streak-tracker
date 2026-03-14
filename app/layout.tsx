import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreakTracker — Build Your Study Habit",
  description: "Track your daily learning streak. Stay consistent. Grow every day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
