"use client"

import { useSidebar } from "@/context/sidebar-context"
import { usePathname } from "next/navigation"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  const isKonsumsiRoute = pathname?.startsWith("/menu/konsumsi")

  const backgroundClass = isKonsumsiRoute
    ? "bg-gray-50 dark:bg-gray-900"
    : "bg-gradient-to-br from-green-50 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"

  return (
    <main
      className={`transition-all duration-300 ${backgroundClass} min-h-screen 
      ${isCollapsed ? "lg:ml-16" : "lg:ml-64"} 
      ml-0 mt-16 p-4 sm:p-6 lg:p-8`}
    >
      {children}
    </main>
  )
}