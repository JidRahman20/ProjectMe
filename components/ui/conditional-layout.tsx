"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { MainContent } from "@/components/ui/main-content";
import { SidebarProvider } from "@/context/sidebar-context";
import { ScrollbarActivity } from "@/components/ui/scrollbar-activity";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes yang tidak perlu navbar dan sidebar
  const authRoutes = ["/login"];
  const isAuthRoute = authRoutes.includes(pathname);
  const isKonsumsiRoute = pathname.startsWith("/user/menu/konsumsi");
  const backgroundClass = isKonsumsiRoute
    ? "bg-gray-50 dark:bg-gray-900"
    : "bg-gradient-to-br from-green-50 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900";

  if (isAuthRoute) {
    // Untuk halaman auth, tampilkan children langsung tanpa navbar/sidebar
    return <>{children}</>;
  }

  // Untuk halaman lain, tampilkan dengan navbar dan sidebar
  return (
    <SidebarProvider>
      <div className={`min-h-screen ${backgroundClass}`}>
        <ScrollbarActivity />
        <Navbar />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
