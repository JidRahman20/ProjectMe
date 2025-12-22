"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useAuth } from "@/context/auth-context";
import { DemplonLogo } from "@/components/ui/demplon-logo";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function ApprovalHomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <DemplonLogo className="w-40 h-40 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Approval
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Menunggu Approval</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">12</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disetujui</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">45</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ditolak</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">3</p>
                </div>
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Menu Approval
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/menu/konsumsi"
                className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Approval Konsumsi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Setujui atau tolak pengajuan konsumsi
                </p>
              </Link>

              <Link
                href="/admin"
                className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
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
