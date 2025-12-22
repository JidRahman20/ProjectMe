"use client"

import React, { useEffect, useState } from "react"
import { Clock, FileText, CheckCircle, BarChart, TrendingUp, DollarSign } from "lucide-react"
import { DashboardCard } from "@/components/ui/dashboard-card"

type DashboardStats = {
  totalOrders: number
  pending: number
  approved: number
  totalCost: number
  todayOrders: number
  todayCost: number
  todayApproved: number
  monthlyData: { month: string; orders: number; cost: number }[]
  topDivisions: { name: string; count: number }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Memuat dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Gagal memuat data</div>
      </div>
    )
  }

  const statsCards = [
    { 
      id: 1, 
      title: "Total Pesanan Bulan Ini", 
      value: stats.totalOrders, 
      delta: "+8%", 
      icon: <Clock className="w-5 h-5 text-purple-700" /> 
    },
    { 
      id: 2, 
      title: "Pending Approval", 
      value: stats.pending, 
      delta: "-4%", 
      icon: <FileText className="w-5 h-5 text-violet-600" /> 
    },
    { 
      id: 3, 
      title: "Approved", 
      value: stats.approved, 
      delta: "+12%", 
      icon: <CheckCircle className="w-5 h-5 text-green-700" /> 
    },
    { 
      id: 4, 
      title: "Total Biaya", 
      value: `Rp ${(stats.totalCost / 1000000).toFixed(1)} Jt`, 
      delta: "+3%", 
      icon: <DollarSign className="w-5 h-5 text-blue-700" /> 
    },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Ikhtisar aktivitas dan performa</p>
        </div>
        <button 
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow hover:from-purple-800 hover:to-purple-700 transition-all"
        >
          <BarChart className="w-4 h-4" />
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => (
          <DashboardCard key={s.id} title={s.title} value={s.value} delta={s.delta} icon={s.icon} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monitoring 6 Bulan Terakhir</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tren pesanan dan biaya konsumsi</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {stats.monthlyData.map((data, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{data.month}</span>
                  <div className="flex gap-4">
                    <span className="text-purple-600 dark:text-purple-400">{data.orders} orders</span>
                    <span className="text-blue-600 dark:text-blue-400">Rp {data.cost.toFixed(1)} Jt</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Orders Bar */}
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                      style={{ width: `${(data.orders / (Math.max(...stats.monthlyData.map(d => d.orders)) || 1)) * 100}%` }}
                    />
                  </div>
                  {/* Cost Bar */}
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                      style={{ width: `${(data.cost / (Math.max(...stats.monthlyData.map(d => d.cost)) || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah Pesanan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Biaya (Juta)</span>
            </div>
          </div>
        </div>

        <aside className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ringkasan Hari Ini</h3>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
              <p className="text-xs text-gray-600 dark:text-gray-400">Pesanan Hari Ini</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.todayOrders}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <p className="text-xs text-gray-600 dark:text-gray-400">Biaya Hari Ini</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                Rp {(stats.todayCost / 1000).toFixed(0)}K
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
              <p className="text-xs text-gray-600 dark:text-gray-400">Disetujui Hari Ini</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.todayApproved}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Divisi Bulan Ini</h4>
            <div className="space-y-2">
              {stats.topDivisions.slice(0, 3).map((div, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{div.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{div.count} orders</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Efisiensi Proses</h4>
            <div className="h-3 bg-purple-50 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full w-[85%]"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">85% pesanan diproses dalam 24 jam</p>
          </div>
        </aside>
      </section>
    </div>
  )
}
