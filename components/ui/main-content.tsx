"use client"

import { useSidebar } from "@/context/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main
      className={`transition-all duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen 
      ${isCollapsed ? "lg:ml-16" : "lg:ml-64"} 
      ml-0 mt-16 p-4 sm:p-6 lg:p-8`}
    >
      {children}
    </main>
  )
}