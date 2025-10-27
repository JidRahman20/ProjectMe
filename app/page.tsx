"use client";

import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Activity,
  BookOpen,
  Briefcase,
  Clock
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Karyawan",
      value: "1,234",
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Dokumen Aktif",
      value: "856",
      icon: FileText,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Absensi Hari Ini",
      value: "98%",
      icon: Calendar,
      color: "bg-purple-500",
      change: "+2%",
    },
    {
      title: "Performa",
      value: "94.5%",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5%",
    },
  ];

  const quickAccess = [
    { name: "Absen", icon: Clock, href: "/menu/absen", color: "text-blue-600 dark:text-blue-400" },
    { name: "Konsumsi", icon: Activity, href: "/menu/konsumsi", color: "text-green-600 dark:text-green-400" },
    { name: "Dokumenku", icon: FileText, href: "/menu/dokumenku", color: "text-purple-600 dark:text-purple-400" },
    { name: "Library", icon: BookOpen, href: "/menu/library", color: "text-orange-600 dark:text-orange-400" },
    { name: "Employee", icon: Users, href: "/menu/employee", color: "text-pink-600 dark:text-pink-400" },
    { name: "Work Area", icon: Briefcase, href: "/menu/work-area", color: "text-indigo-600 dark:text-indigo-400" },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang, {user?.name}! 👋
          </h1>
          <p className="text-blue-100">
            Hari ini adalah {new Date().toLocaleDateString("id-ID", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickAccess.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 group"
              >
                <item.icon className={`w-8 h-8 mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {[
              { action: "Absensi masuk", time: "08:00 AM", user: "Anda" },
              { action: "Dokumen disetujui", time: "09:30 AM", user: "Admin" },
              { action: "Meeting dijadwalkan", time: "10:15 AM", user: "HR Team" },
              { action: "Laporan dikirim", time: "11:45 AM", user: "Anda" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      oleh {activity.user}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}