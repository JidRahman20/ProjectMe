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
        <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
          <div className="mt-1 flex items-center gap-3">
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">{value}</h3>
            {delta && (
              <span className="text-sm font-medium text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">{delta}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
