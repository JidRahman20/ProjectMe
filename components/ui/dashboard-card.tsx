"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function DashboardCard({
  title,
  value,
  delta,
  icon,
  className,
}: {
  title: string
  value: ReactNode
  delta?: string
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-xl p-5 bg-white dark:bg-gray-800 shadow", className)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
          <div className="mt-1 flex items-center gap-3">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">{value}</h3>
            {delta && (
              <span className="text-sm font-medium text-violet-700 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded">{delta}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
