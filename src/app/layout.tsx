import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";export const metadata: Metadata = {
  title: "RIA Catalyst",
  description: "Private market intelligence platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }} suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, height: "100%", display: "flex", flexDirection: "column" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
