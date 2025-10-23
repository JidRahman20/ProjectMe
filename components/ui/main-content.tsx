"use client"

import { useSidebar } from "@/context/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main
      className={`transition-all duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen ${
        isCollapsed ? "ml-16" : "ml-64"
      } mt-16`}
    >
      {children}
    </main>
  )
}