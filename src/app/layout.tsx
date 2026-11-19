import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/role-context";
import { DataStoreProvider } from "@/context/data-store-context";
import { PrototypeBanner } from "@/components/layout/prototype-banner";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "AI-Driven Smart Welfare Resource Management System",
  description:
    "A centralized platform for orphanages and old age homes with AI forecasting and health-risk decision support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className="h-full bg-[#f8fafc] text-slate-900 font-sans flex flex-col overflow-hidden">
        <RoleProvider>
          <DataStoreProvider>
            {/* Research Prototype Disclaimer Banner */}
            <PrototypeBanner />

            {/* App Shell handles Landing Page full-bleed vs. Dashboard sidebar */}
            <AppShell>{children}</AppShell>
          </DataStoreProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
