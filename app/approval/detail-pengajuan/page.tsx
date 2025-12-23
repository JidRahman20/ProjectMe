"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, Filter } from "lucide-react";

interface Order {
  id: string;
  code: string;
  nama_kegiatan: string;
  vendor: string;
  tanggal_kegiatan: string;
  total: number;
  status: string;
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
  divisions?: {
    name: string;
  };
}

export default function DetailPengajuanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/konsumsi/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/konsumsi/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          show: true,
          message: `Pengajuan berhasil ${newStatus === 'approved' ? 'disetujui' : 'ditolak'}!`,
          type: 'success'
        });
        fetchOrders();
        setShowModal(false);
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Gagal mengubah status',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Persetujuan';
      case 'approved': return 'Pesanan Disetujui';
      case 'rejected': return 'Pesanan Dibatalkan';
      default: return status;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Detail Pengajuan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review dan proses pengajuan konsumsi
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan kode, kegiatan, atau vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="pending">Menunggu Persetujuan</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                  <option value="all">Semua Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nama Kegiatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Tidak ada data pengajuan
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {order.nama_kegiatan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {order.vendor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(order.tanggal_kegiatan || order.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          Rp {(order.total || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(order.status)}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal */}
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Detail Pengajuan
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kode Pesanan
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.code}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Kegiatan
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.nama_kegiatan}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Vendor
                        </label>
                        <p className="text-gray-900 dark:text-white">{selectedOrder.vendor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tanggal Kegiatan
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(selectedOrder.tanggal_kegiatan || selectedOrder.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total
                      </label>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        Rp {(selectedOrder.total || 0).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status Saat Ini
                      </label>
                      <span className={getStatusBadge(selectedOrder.status)}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>

                    {selectedOrder.users && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Diajukan Oleh
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedOrder.users.name} ({selectedOrder.users.email})
                        </p>
                      </div>
                    )}

                    {selectedOrder.divisions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Divisi
                        </label>
                        <p className="text-gray-900 dark:text-white">{selectedOrder.divisions.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {selectedOrder.status === 'pending' && (
                    <div className="flex gap-4 mb-4">
                      <button
                        onClick={() => handleStatusChange(selectedOrder.code, 'approved')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedOrder.code, 'rejected')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Tolak
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
