import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";

export const metadata: Metadata = {
  title: "LeadPilot — Dashboard",
  description: "Qualification de leads B2B en pilote automatique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
