import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";

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
      <body suppressContentEditableWarning={true}>
        <AuthProvider> {children}</AuthProvider>
      </body>
    </html>
  );
}
