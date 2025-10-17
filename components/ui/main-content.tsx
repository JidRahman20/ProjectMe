"use client"

import { useSidebar } from "@/context/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main
      className={`transition-all duration-300 ${
        isCollapsed ? "ml-16" : "ml-64"
      } pt-20`}
    >
      {children}
    </main>
  )
}