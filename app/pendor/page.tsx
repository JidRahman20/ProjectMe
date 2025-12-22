"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useAuth } from "@/context/auth-context";
import { DemplonLogo } from "@/components/ui/demplon-logo";
import { Package, ClipboardList, TrendingUp, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PendorHomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-orange-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <DemplonLogo className="w-40 h-40 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Pendor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Selamat datang, {user?.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Baru</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">8</p>
                </div>
                <ShoppingCart className="w-12 h-12 text-orange-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Proses</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">15</p>
                </div>
                <Package className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selesai Hari Ini</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">23</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              Menu Pendor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/menu/konsumsi"
                className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Kelola Konsumsi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proses dan kelola order konsumsi
                </p>
              </Link>

              <Link
                href="/admin"
                className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Admin Dashboard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lihat statistik dan laporan lengkap
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
