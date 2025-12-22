"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useAuth } from "@/context/auth-context";
import { DemplonLogo } from "@/components/ui/demplon-logo";
import { 
  UtensilsCrossed, 
  FileText, 
  Users, 
  BookOpen,
  Calendar,
  Settings,
  LayoutDashboard,
  Building2,
  BookMarked
} from "lucide-react";
import Link from "next/link";

export default function UserPortalPage() {
  const { user } = useAuth();

  const mainMenuItems = [
    {
      title: "Konsumsi",
      description: "Ajukan dan kelola permintaan konsumsi",
      icon: UtensilsCrossed,
      href: "/user/menu/konsumsi",
      color: "purple"
    },
    {
      title: "Dashboard",
      description: "Lihat ringkasan dan statistik",
      icon: LayoutDashboard,
      href: "/admin",
      color: "blue"
    },
    {
      title: "Absensi",
      description: "Kelola kehadiran dan cuti",
      icon: Calendar,
      href: "/user/menu/absen",
      color: "green"
    },
  ];

  const otherMenuItems = [
    {
      title: "Employee Directory",
      description: "Direktori karyawan",
      icon: Users,
      href: "/user/menu/Employee_Directory",
      color: "orange"
    },
    {
      title: "Library",
      description: "Perpustakaan dokumen digital",
      icon: BookOpen,
      href: "/user/menu/library",
      color: "yellow"
    },
    {
      title: "E-Prosedur",
      description: "Prosedur dan panduan kerja",
      icon: BookMarked,
      href: "/user/menu/e-prosedur",
      color: "teal"
    },
    {
      title: "Work Area",
      description: "Area kerja dan ruangan",
      icon: Building2,
      href: "/user/menu/work-area",
      color: "indigo"
    },
    {
      title: "Profile",
      description: "Pengaturan profil dan akun",
      icon: Settings,
      href: "/user/menu/profile",
      color: "gray"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; hover: string; icon: string; bg: string }> = {
      purple: {
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400",
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/10"
      },
      blue: {
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400",
        icon: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/10"
      },
      green: {
        border: "border-green-200 dark:border-green-800",
        hover: "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400",
        icon: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/10"
      },
      orange: {
        border: "border-orange-200 dark:border-orange-800",
        hover: "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400",
        icon: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-900/10"
      },
      yellow: {
        border: "border-yellow-200 dark:border-yellow-800",
        hover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-400",
        icon: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/10"
      },
      teal: {
        border: "border-teal-200 dark:border-teal-800",
        hover: "hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-400",
        icon: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-900/10"
      },
      indigo: {
        border: "border-indigo-200 dark:border-indigo-800",
        hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400",
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/10"
      },
      red: {
        border: "border-red-200 dark:border-red-800",
        hover: "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400",
        icon: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/10"
      },
      gray: {
        border: "border-gray-200 dark:border-gray-800",
        hover: "hover:bg-gray-50 dark:hover:bg-gray-900/20 hover:border-gray-400",
        icon: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-900/10"
      }
    };
    return colors[color] || colors.purple;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <DemplonLogo className="w-32 h-32 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Portal Pengguna
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Selamat datang, <span className="font-semibold text-purple-600 dark:text-purple-400">{user?.name}</span>
            </p>
          </div>

          {/* Main Menu */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Menu Utama
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const colors = getColorClasses(item.color);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-6 border-2 ${colors.border} ${colors.bg} rounded-xl ${colors.hover} transition-all duration-200 group shadow-sm hover:shadow-md`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                        <Icon className={`w-8 h-8 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Other Menu */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Menu Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherMenuItems.map((item) => {
                const Icon = item.icon;
                const colors = getColorClasses(item.color);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-4 border-2 ${colors.border} rounded-lg ${colors.hover} transition-all duration-200 group`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-6 h-6 ${colors.icon} flex-shrink-0 mt-1`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 group-hover:underline">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
