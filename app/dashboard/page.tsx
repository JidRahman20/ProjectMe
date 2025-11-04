import React from "react"
import { Clock, FileText, Users, CheckCircle, BarChart } from "lucide-react"
import { DashboardCard } from "@/components/ui/dashboard-card"

const stats = [
  { id: 1, title: "Orders", value: 1287, delta: "+8%", icon: <Clock className="w-5 h-5 text-green-600" /> },
  { id: 2, title: "Pending", value: 54, delta: "-4%", icon: <FileText className="w-5 h-5 text-yellow-600" /> },
  { id: 3, title: "Approved", value: 1020, delta: "+12%", icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  { id: 4, title: "Customers", value: 412, delta: "+3%", icon: <Users className="w-5 h-5 text-green-600" /> },
]

const recent = [
  { id: 1, order: "#A-1023", customer: "Budi", status: "Disetujui", amount: "Rp 2.500.000" },
  { id: 2, order: "#A-1024", customer: "Siti", status: "Menunggu Persetujuan", amount: "Rp 1.200.000" },
  { id: 3, order: "#A-1025", customer: "Andi", status: "Dibatalkan", amount: "Rp 500.000" },
  { id: 4, order: "#A-1026", customer: "Rina", status: "Disetujui", amount: "Rp 3.000.000" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Ikhtisar aktivitas dan performa</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow">Create Report</button>
          <button className="p-2 rounded-md bg-white dark:bg-gray-800 shadow">
            <BarChart className="w-5 h-5 text-green-600" />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <DashboardCard key={s.id} title={s.title} value={s.value} delta={s.delta} icon={s.icon} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h3>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-green-50/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{r.order}</td>
                    <td className="px-4 py-3">{r.customer}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${r.status === "Disetujui" ? "bg-gradient-to-r from-green-600 to-green-700 text-white" : r.status.includes("Menunggu") ? "bg-yellow-50 text-yellow-700" : "bg-yellow-100 text-yellow-800"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
          <button className="w-full text-left px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-between">
            <span>Create Order</span>
            <span className="text-sm text-green-700">New</span>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-900 flex items-center justify-between">
            <span>Pending Approvals</span>
            <span className="text-sm text-yellow-700">54</span>
          </button>

          <div className="mt-auto">
            <h4 className="text-sm font-medium text-gray-500">Performance</h4>
            <div className="mt-2 h-3 bg-green-50 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Overall throughput improved 8% compared to last week.</p>
          </div>
        </aside>
      </section>
    </div>
  )
}
