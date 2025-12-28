import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animated Explainer",
  description: "One-minute 2D animated explainer sequence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
