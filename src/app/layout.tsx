import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gatherly - Event Ticketing Platform",
  description: "Discover and book tickets for amazing events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressContentEditableWarning={true}>{children}</body>
    </html>
  );
}
