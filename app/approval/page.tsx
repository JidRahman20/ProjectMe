"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useAuth } from "@/context/auth-context";
import { CheckCircle2, XCircle, Clock, FileText, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApprovalHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/konsumsi/orders');
      const data = await response.json();
      
      if (data.success) {
        interface OrderStatus {
          status: string;
        }
        const orders: OrderStatus[] = data.orders;
        setStats({
          pending: orders.filter((o) => o.status === 'pending').length,
          approved: orders.filter((o) => o.status === 'approved').length,
          rejected: orders.filter((o) => o.status === 'rejected').length,
          total: orders.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Approval
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Selamat datang, {user?.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Menunggu Approval</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {loading ? '...' : stats.pending}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disetujui</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {loading ? '...' : stats.approved}
                  </p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ditolak</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {loading ? '...' : stats.rejected}
                  </p>
                </div>
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Pengajuan</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {loading ? '...' : stats.total}
                  </p>
                </div>
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/approval/detail-pengajuan"
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FileText className="w-12 h-12 text-white mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Detail Pengajuan
              </h2>
              <p className="text-blue-100">
                Review dan proses pengajuan dengan tombol Approve & Reject
              </p>
            </Link>

            <Link
              href="/approval/riwayat"
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <History className="w-12 h-12 text-white mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Riwayat Approval
              </h2>
              <p className="text-purple-100">
                Lihat riwayat semua pengajuan yang telah diproses
              </p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
