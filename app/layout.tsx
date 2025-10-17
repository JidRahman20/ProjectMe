import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { SidebarProvider } from "@/context/sidebar-context";
import { ThemeProvider } from "@/context/theme-context";
import { MainContent } from "@/components/ui/main-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DEMPLON",
  description: "Sistem Informasi Master",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}