"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { MainContent } from "@/components/ui/main-content";
import { SidebarProvider } from "@/context/sidebar-context";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes yang tidak perlu navbar dan sidebar
  const authRoutes = ["/login"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    // Untuk halaman auth, tampilkan children langsung tanpa navbar/sidebar
    return <>{children}</>;
  }

  // Untuk halaman lain, tampilkan dengan navbar dan sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
